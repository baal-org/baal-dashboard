import os

import mlflow
from fastapi import FastAPI, HTTPException
from mlflow import MlflowException

MLFLOW_TRACKING_URI = "MLFLOW_TRACKING_URI"

if MLFLOW_TRACKING_URI not in os.environ:
    raise EnvironmentError(f"Please set `{MLFLOW_TRACKING_URI}` as an env.")

mlflow.set_tracking_uri(os.environ[MLFLOW_TRACKING_URI])
client = mlflow.MlflowClient()

app = FastAPI()

@app.get('/experiments')
def get_experiments():
    return [exp.experiment_id for exp in mlflow.MlflowClient().search_experiments()]

@app.get("/metric/{run_id}")
def get_metrics(run_id: str):
    try:
        run = mlflow.get_run(run_id)
    except MlflowException:
        raise HTTPException(status_code=404, detail="Not found")
    all_metrics_names = list(run.data.metrics.keys())
    print(all_metrics_names)
    history = {mn: client.get_metric_history(run_id, mn) for mn in all_metrics_names}
    return history
