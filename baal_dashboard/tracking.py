from typing import Dict, List

import mlflow
from pydantic import BaseModel


class TrackingStep(BaseModel):
    metrics: Dict[str, float]
    uncertainty: List[float]
    dataset_length: int
    pool_size: int

    def log(self, run_id):
        client = mlflow.MlflowClient()
        for met_name, value in self.metrics.items():
            client.log_metric(run_id=run_id, key=met_name, value=value, step=self.dataset_length)
        client.log_metric(
            run_id=run_id, key="pool_size", value=self.pool_size, step=self.dataset_length
        )
        client.log_dict(
            run_id,
            {"uncertainty": self.uncertainty},
            artifact_file=f"uncertainty_{self.dataset_length}.json",
        )
