from typing import Any, Dict, List

from pydantic import BaseModel


class RunInfo(BaseModel):
    run_id: str
    hparams: Dict[str, Any]


class Run(BaseModel):
    metrics: Dict[str, List[float]]


class Experiment(BaseModel):
    exp_id: str
    runs: List[RunInfo]
