from enum import Enum

from pydantic import BaseModel, Field


class ReviewWarning(str, Enum):
    missing_dosage = "missing-dosage"
    unclear_timing = "unclear-timing"
    possible_duplicate = "possible-duplicate"


class ReviewMedicineInput(BaseModel):
    id: str
    name: str
    dosage: str
    frequency: str
    timing: str
    duration: str
    food_timing: str = Field(alias="foodTiming")
    confirmed: bool
    removed: bool
    edited: bool
    warnings: list[ReviewWarning]

    model_config = {"populate_by_name": True}


class NormalizedMedicine(BaseModel):
    medicine_id: str
    name: str
    dosage: str
    frequency: str
    timing: list[str]
    food_note: str
    duration_days: int | None
    status: str


class ReviewMedicinesRequest(BaseModel):
    medicines: list[ReviewMedicineInput]


class ReviewMedicinesResponse(BaseModel):
    review_id: str
    medicines: list[NormalizedMedicine]
    warnings: list[str]
