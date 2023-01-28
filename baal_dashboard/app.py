import os

import mlflow
from fastapi import FastAPI, HTTPException
from mlflow import MlflowException
from fastapi.middleware.cors import CORSMiddleware
from .datamodels.experiment import Experiment
from .utils.experiment_route_utils import get_experiment_data
from typing import List

MLFLOW_TRACKING_URI = "MLFLOW_TRACKING_URI"

if MLFLOW_TRACKING_URI not in os.environ:
    raise EnvironmentError(f"Please set `{MLFLOW_TRACKING_URI}` as an env.")

mlflow.set_tracking_uri(os.environ[MLFLOW_TRACKING_URI])
client = mlflow.MlflowClient()
 
app = FastAPI()

# Add Options for CORS
# TODO: Change the options below if you plan to put this into prod

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
@app.get('/experiments')
def get_experiments() -> List[Experiment]:
    '''
    The function returns data for runs under each experiment ID. This API
    is called when the page loads for the first time

    Args:
    ----
    None

    Return:
    ----
    exp_details : Returns a List of Experiment and Run Id's
    
    '''
    
    exp_details = []

    experiments = [exp for exp in mlflow.MlflowClient().search_experiments()]

    # Iterate through each experiment
    for exp in experiments:

        exp_data = get_experiment_data(exp)

        exp_details.append(exp_data)

    return exp_details

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
