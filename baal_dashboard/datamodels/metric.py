from typing import Dict, List

from pydantic import BaseModel


class Metric(BaseModel):
    step: int
    value: float


Plot = Dict  # Result of PlotlyFigure.to_json()
History = Dict[str, Dict[str, List[Metric]]]


class GetMetricsResponse(BaseModel):
    history: History
    plots: List[Plot]
