from pydantic import BaseModel


class Metric(BaseModel):
    step: int
    value: float
