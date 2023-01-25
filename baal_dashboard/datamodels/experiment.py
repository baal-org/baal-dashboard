from pydantic import BaseModel
from typing import List

class RunId(BaseModel):
    run_id: str

class Experiment(BaseModel):
    exp_id: str
    run_ids: List[RunId]