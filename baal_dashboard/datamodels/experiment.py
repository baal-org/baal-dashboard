from typing import List

from pydantic import BaseModel


class RunId(BaseModel):
    run_id: str


class Experiment(BaseModel):
    exp_id: str
    run_ids: List[RunId]
