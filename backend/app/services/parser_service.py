from __future__ import annotations

from dataclasses import dataclass
import re

from backend.app.services.normalization_service import (
    clean_ocr_line,
    infer_timing_from_food_timing,
    is_noise_line,
    looks_like_duplicate,
    normalize_dosage,
    normalize_duration,
    normalize_food_timing,
    normalize_frequency,
    normalize_medicine_name,
    normalize_timing,
    normalize_whitespace,
)


DOSAGE_PATTERNS = [
    r"\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml)\b",
    r"\b(?:one|two|half)\s+(?:tablet|tablets|capsule|capsules)\b",
    r"\b\d+\s+(?:tablet|tablets|capsule|capsules)\b",
]
DURATION_PATTERNS = [
    r"\bfor\s+\d+\s+days?\b",
    r"\bx\s*\d+\s+days?\b",
    r"\bcontinue\s+daily\b",
]
FREQUENCY_RULES = [
    (r"\bonce\s+daily\b|\bonce\s+a\s+day\b|\bod\b", "Once daily"),
    (r"\btwice\s+daily\b|\btwice\s+a\s+day\b|\bbd\b", "Twice daily"),
    (r"\bthrice\s+daily\b|\bthree\s+times\s+daily\b|\btid\b", "Thrice daily"),
    (r"\bcontinue\s+daily\b", "Continue daily"),
]
TIMING_RULES = [
    (r"\bmorning\s+and\s+night\b", "Morning and Night"),
    (r"\bmorning\b|\bbefore\s+breakfast\b|\bafter\s+breakfast\b", "Morning"),
    (r"\bafternoon\b|\bafter\s+lunch\b|\bbefore\s+lunch\b", "Afternoon"),
    (r"\bevening\b", "Evening"),
    (r"\bnight\b|\bbedtime\b|\bafter\s+dinner\b|\bbefore\s+dinner\b", "Night"),
]
FOOD_TIMING_RULES = [
    (r"\bbefore\s+breakfast\b", "Before breakfast"),
    (r"\bafter\s+breakfast\b", "After breakfast"),
    (r"\bbefore\s+lunch\b", "Before lunch"),
    (r"\bafter\s+lunch\b", "After lunch"),
    (r"\bbefore\s+dinner\b", "Before dinner"),
    (r"\bafter\s+dinner\b", "After dinner"),
    (r"\bbefore\s+food\b|\bbefore\s+meals?\b", "Before food"),
    (r"\bafter\s+food\b|\bafter\s+meals?\b", "After food"),
]
PRN_PATTERN = re.compile(r"\b(?:sos|prn|if\s+fever|if\s+pain|as\s+needed|when\s+needed)\b", re.IGNORECASE)
LOW_CLARITY_PATTERN = re.compile(r"\b(?:unclear|illegible|review|doubtful|smudged)\b", re.IGNORECASE)
MEDICINE_CLUE_PATTERN = re.compile(
    r"(?:mg|mcg|ml|tablet|capsule|syrup|drop|inj|once\s+daily|twice\s+daily|thrice\s+daily|morning|afternoon|evening|night|before|after|sos|prn)",
    re.IGNORECASE,
)
HEADER_PATTERN = re.compile(r"^(discharge\s+summary|prescription|medicines?|advise|advice)[:\s]*$", re.IGNORECASE)
TRAILING_NOISE_PATTERN = re.compile(r"[,:;./\\]+$")


@dataclass
class MedicineCandidate:
    candidate_id: str
    raw_line: str
    name: str
    dosage: str
    frequency: str
    timing: str
    duration: str
    food_timing: str
    warnings: list[str]
    clarity: str


def _extract_first_match(patterns: list[str], line: str) -> str:
    for pattern in patterns:
        match = re.search(pattern, line, flags=re.IGNORECASE)
        if match:
            return match.group(0).strip()
    return ""


def _extract_rule_value(rules: list[tuple[str, str]], line: str) -> str:
    for pattern, value in rules:
        if re.search(pattern, line, flags=re.IGNORECASE):
            return value
    return ""


def _looks_like_medicine_line(line: str) -> bool:
    if not line or HEADER_PATTERN.match(line):
        return False
    if is_noise_line(line):
        return False
    return bool(MEDICINE_CLUE_PATTERN.search(line))


def _extract_name(line: str) -> str:
    stripped = TRAILING_NOISE_PATTERN.sub("", line)
    return normalize_medicine_name(stripped)


def _infer_frequency_from_timing(timing: str) -> str:
    if timing == "Morning and Night":
        return "Twice daily"
    return ""


def _candidate_clarity(warnings: list[str], *, has_name: bool, has_dosage: bool) -> str:
    if not has_name or ("low-clarity-line" in warnings and len(warnings) >= 2):
        return "low"
    if not has_dosage and "possible-prn-instruction" not in warnings:
        return "low"
    return "review" if warnings else "clear"


def parse_medicine_candidates(detected_lines: list[str], extracted_text: str = "") -> list[MedicineCandidate]:
    source_lines = detected_lines or [segment.strip() for segment in extracted_text.splitlines() if segment.strip()]
    candidates: list[MedicineCandidate] = []

    for index, raw_line in enumerate(source_lines, start=1):
        original_line = normalize_whitespace(raw_line)
        line = clean_ocr_line(original_line)
        if not _looks_like_medicine_line(line):
            continue

        is_prn = bool(PRN_PATTERN.search(line))
        dosage = normalize_dosage(_extract_first_match(DOSAGE_PATTERNS, line))
        frequency = normalize_frequency(_extract_rule_value(FREQUENCY_RULES, line), is_prn=is_prn)
        food_timing = normalize_food_timing(_extract_rule_value(FOOD_TIMING_RULES, line))
        timing = normalize_timing(_extract_rule_value(TIMING_RULES, line))
        if not timing:
            timing = normalize_timing(infer_timing_from_food_timing(food_timing))
        if not frequency:
            frequency = _infer_frequency_from_timing(timing)
        duration = normalize_duration(_extract_first_match(DURATION_PATTERNS, line), is_prn=is_prn)
        name = _extract_name(line)

        warnings: list[str] = []
        if not name or len(name) < 3:
            warnings.append("low-clarity-line")
        if not dosage and not is_prn:
            warnings.append("missing-dosage")
        if not timing and not frequency and not is_prn:
            warnings.append("unclear-timing")
        if is_prn:
            warnings.append("possible-prn-instruction")
        if LOW_CLARITY_PATTERN.search(line):
            warnings.append("low-clarity-line")
        if len(line) < 8:
            warnings.append("low-clarity-line")

        warnings = list(dict.fromkeys(warnings))
        clarity = _candidate_clarity(warnings, has_name=bool(name), has_dosage=bool(dosage))

        candidates.append(
            MedicineCandidate(
                candidate_id=f"cand_{index:03d}",
                raw_line=original_line,
                name=name or "Review needed",
                dosage=dosage,
                frequency=frequency,
                timing=timing,
                duration=duration or ("As needed" if is_prn else "Continue daily"),
                food_timing=food_timing,
                warnings=warnings,
                clarity=clarity,
            )
        )

    for outer_index, candidate in enumerate(candidates):
        for inner_index, other in enumerate(candidates):
            if outer_index >= inner_index:
                continue
            if looks_like_duplicate(candidate.name, other.name, candidate.dosage, other.dosage):
                if "possible-duplicate" not in candidate.warnings:
                    candidate.warnings.append("possible-duplicate")
                if "possible-duplicate" not in other.warnings:
                    other.warnings.append("possible-duplicate")
                if candidate.clarity == "clear":
                    candidate.clarity = "review"
                if other.clarity == "clear":
                    other.clarity = "review"

    return candidates
