from __future__ import annotations

from difflib import SequenceMatcher
import re


NOISE_ONLY_PATTERN = re.compile(r"^[\W\d_]+$")
OCR_NOISE_PATTERN = re.compile(r"(?:page\s+\d+|mrn|uhid|ip\s*no|age\s*[:\-]|\bdoctor\b)", re.IGNORECASE)
UNIT_PATTERN = re.compile(r"\b(mg|mcg|g|ml)\b", re.IGNORECASE)
DOSAGE_SUFFIX_PATTERN = re.compile(
    r"(?:\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml)\b|\b(?:one|two|half|\d+)\s+(?:tablet|tablets|capsule|capsules)\b)",
    re.IGNORECASE,
)

DOSAGE_WORDS = {
    "one": "1",
    "two": "2",
    "half": "Half",
}

STOP_TOKENS = (
    "once daily",
    "twice daily",
    "thrice daily",
    "three times daily",
    "morning and night",
    "morning",
    "afternoon",
    "evening",
    "night",
    "bedtime",
    "before breakfast",
    "after breakfast",
    "before lunch",
    "after lunch",
    "before dinner",
    "after dinner",
    "before food",
    "after food",
    "before meals",
    "after meals",
    "continue daily",
    "as needed",
    "when needed",
    "sos",
    "prn",
    "if fever",
    "if pain",
    "od",
    "bd",
    "tid",
    "for ",
    " x ",
)


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def clean_ocr_line(value: str) -> str:
    cleaned = value.replace("|", " ").replace("•", " ").replace("—", " ").replace("–", " ")
    cleaned = re.sub(r"(?i)(tablet|capsule)(before|after)", r"\1 \2", cleaned)
    cleaned = re.sub(r"(?i)(\d)(mg|mcg|g|ml)\b", r"\1 \2", cleaned)
    cleaned = re.sub(r"^\s*(?:rx[:\-\s]*)?", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"^\s*(?:\(?\d+\)?[.)\]:-]?|[-*])\s*", "", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" ,.;:-")
    return normalize_whitespace(cleaned)


def is_noise_line(value: str) -> bool:
    if not value:
        return True
    if len(value) < 4:
        return True
    if NOISE_ONLY_PATTERN.match(value):
        return True
    if OCR_NOISE_PATTERN.search(value) and not re.search(r"\b(?:mg|tablet|capsule|syrup|inj|drop)\b", value, re.IGNORECASE):
        return True
    alpha_count = sum(char.isalpha() for char in value)
    if alpha_count < 3:
        return True
    return False


def normalize_dosage(value: str) -> str:
    cleaned = normalize_whitespace(value.lower())
    if not cleaned:
        return ""
    cleaned = re.sub(r"(?i)(\d)(mg|mcg|g|ml)\b", r"\1 \2", cleaned)
    for word, replacement in DOSAGE_WORDS.items():
        cleaned = re.sub(rf"\b{word}\b", replacement.lower(), cleaned)
    cleaned = UNIT_PATTERN.sub(lambda match: match.group(1).lower(), cleaned)
    cleaned = re.sub(r"\btab\b", "tablet", cleaned)
    cleaned = re.sub(r"\bcap\b", "capsule", cleaned)
    cleaned = normalize_whitespace(cleaned)
    if cleaned.startswith("half "):
        return "Half " + cleaned[5:]
    if cleaned and cleaned[0].isdigit():
        return cleaned
    return cleaned.capitalize()


def normalize_frequency(value: str, *, is_prn: bool = False) -> str:
    cleaned = normalize_whitespace(value.lower())
    if is_prn and not cleaned:
        return "As needed"
    mapping = {
        "once daily": "Once daily",
        "once a day": "Once daily",
        "od": "Once daily",
        "twice daily": "Twice daily",
        "twice a day": "Twice daily",
        "bd": "Twice daily",
        "thrice daily": "Thrice daily",
        "three times daily": "Thrice daily",
        "tid": "Thrice daily",
        "continue daily": "Continue daily",
        "as needed": "As needed",
    }
    return mapping.get(cleaned, cleaned.title() if cleaned else "")


def normalize_food_timing(value: str) -> str:
    cleaned = normalize_whitespace(value.lower())
    mapping = {
        "before breakfast": "Before breakfast",
        "after breakfast": "After breakfast",
        "before lunch": "Before lunch",
        "after lunch": "After lunch",
        "before dinner": "Before dinner",
        "after dinner": "After dinner",
        "before food": "Before food",
        "after food": "After food",
    }
    return mapping.get(cleaned, cleaned.title() if cleaned else "")


def normalize_timing(value: str) -> str:
    cleaned = normalize_whitespace(value.lower())
    mapping = {
        "morning": "Morning",
        "afternoon": "Afternoon",
        "evening": "Evening",
        "night": "Night",
        "morning and night": "Morning and Night",
    }
    return mapping.get(cleaned, cleaned.title() if cleaned else "")


def infer_timing_from_food_timing(food_timing: str) -> str:
    normalized = food_timing.lower()
    if "breakfast" in normalized:
        return "Morning"
    if "lunch" in normalized:
        return "Afternoon"
    if "dinner" in normalized:
        return "Night"
    return ""


def normalize_duration(value: str, *, is_prn: bool = False) -> str:
    cleaned = normalize_whitespace(value.lower())
    if is_prn and not cleaned:
        return "As needed"
    if cleaned.startswith("for "):
        cleaned = cleaned[4:]
    if cleaned.startswith("x "):
        cleaned = cleaned[2:]
    if re.fullmatch(r"(\d+)\s+days?", cleaned):
        count = re.fullmatch(r"(\d+)\s+days?", cleaned).group(1)
        return f"{count} day" if count == "1" else f"{count} days"
    if cleaned == "continue daily":
        return "Continue daily"
    if cleaned == "as needed":
        return "As needed"
    return cleaned.title() if cleaned else ""


def normalize_medicine_name(value: str) -> str:
    cleaned = normalize_whitespace(value)
    if not cleaned:
        return ""
    lowered = cleaned.lower()
    cut_index = len(cleaned)
    for token in STOP_TOKENS:
        index = lowered.find(token)
        if index != -1:
            cut_index = min(cut_index, index)
    cleaned = cleaned[:cut_index]
    cleaned = DOSAGE_SUFFIX_PATTERN.sub("", cleaned)
    cleaned = re.sub(r"\b(?:tab|tabs|cap|caps|tablet|tablets|capsule|capsules)\b$", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" ,.;:-")
    return cleaned.title() if cleaned else ""


def candidate_name_key(name: str) -> str:
    normalized = normalize_whitespace(name.lower())
    normalized = re.sub(r"[^a-z0-9]", "", normalized)
    return normalized


def looks_like_duplicate(name_a: str, name_b: str, dosage_a: str, dosage_b: str) -> bool:
    key_a = candidate_name_key(name_a)
    key_b = candidate_name_key(name_b)
    if not key_a or not key_b:
        return False
    if key_a == key_b:
        return True
    ratio = SequenceMatcher(None, key_a, key_b).ratio()
    if ratio >= 0.9:
        return True
    if dosage_a and dosage_b and normalize_dosage(dosage_a) == normalize_dosage(dosage_b) and ratio >= 0.82:
        return True
    return False
