from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

import fitz
import numpy as np
from PIL import Image
from rapidocr_onnxruntime import RapidOCR


SUPPORTED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
LOW_CONFIDENCE_THRESHOLD = 0.72
VERY_LOW_CONFIDENCE_THRESHOLD = 0.55
MIN_TEXT_LENGTH = 32


class UnsupportedDocumentTypeError(ValueError):
    pass


@dataclass
class OCRResult:
    extracted_text: str
    detected_lines: list[str]
    warnings: list[str]


_ocr_engine: RapidOCR | None = None


def validate_document_extension(filename: str) -> str:
    extension = Path(filename).suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        supported = ", ".join(sorted(ext.lstrip(".") for ext in SUPPORTED_EXTENSIONS))
        raise UnsupportedDocumentTypeError(f"Unsupported file type. Use one of: {supported}.")
    return extension


def _get_engine() -> RapidOCR:
    global _ocr_engine
    if _ocr_engine is None:
        _ocr_engine = RapidOCR()
    return _ocr_engine


def _normalize_line(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"^[\-•.:,\s]+", "", text)
    return text


def _extract_line_candidates(raw_result: list | None) -> list[tuple[str, float]]:
    candidates: list[tuple[str, float]] = []
    for item in raw_result or []:
        if len(item) < 2:
            continue
        text = _normalize_line(str(item[1]))
        if len(text) < 3:
            continue
        confidence = float(item[2]) if len(item) > 2 else 0.0
        candidates.append((text, confidence))
    return candidates


def _dedupe_candidates(candidates: list[tuple[str, float]]) -> list[tuple[str, float]]:
    deduped: list[tuple[str, float]] = []
    seen: set[str] = set()
    for text, confidence in candidates:
        key = text.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append((text, confidence))
    return deduped


def _run_ocr_on_image_array(image_array: np.ndarray) -> list[tuple[str, float]]:
    result, _ = _get_engine()(image_array)
    return _extract_line_candidates(result)


def _ocr_image(file_path: Path) -> list[tuple[str, float]]:
    with Image.open(file_path) as image:
        rgb_image = image.convert("RGB")
        return _run_ocr_on_image_array(np.array(rgb_image))


def _ocr_pdf(file_path: Path) -> list[tuple[str, float]]:
    candidates: list[tuple[str, float]] = []
    document = fitz.open(file_path)
    try:
        for page in document:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            page_image = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
            candidates.extend(_run_ocr_on_image_array(np.array(page_image)))
        return candidates
    finally:
        document.close()


def extract_document_text(file_path: str | Path) -> OCRResult:
    path = Path(file_path)
    extension = validate_document_extension(path.name)
    candidates = _ocr_pdf(path) if extension == ".pdf" else _ocr_image(path)
    candidates = _dedupe_candidates(candidates)

    lines = [text for text, _ in candidates]
    extracted_text = "\n".join(lines)
    warnings: list[str] = []

    if not lines:
        warnings.append("No readable text was detected. OCR works best on clean printed PDF or image documents.")
        return OCRResult(extracted_text="", detected_lines=[], warnings=warnings)

    average_confidence = sum(confidence for _, confidence in candidates) / len(candidates)
    low_confidence_count = sum(1 for _, confidence in candidates if confidence < VERY_LOW_CONFIDENCE_THRESHOLD)

    if average_confidence < LOW_CONFIDENCE_THRESHOLD:
        warnings.append("OCR confidence was low. Please review the extracted medicines carefully.")

    if low_confidence_count > 0:
        warnings.append("Some extracted lines were unclear and may need manual review.")

    if len(extracted_text) < MIN_TEXT_LENGTH or len(lines) <= 2:
        warnings.append("Only limited text was detected. The document may need a clearer scan or photo.")

    return OCRResult(extracted_text=extracted_text, detected_lines=lines, warnings=warnings)
