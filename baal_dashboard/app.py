import json
import os
from typing import Any, Dict, List

import mlflow
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from mlflow import MlflowException

from .datamodels.experiment import Experiment
from .datamodels.metric import GetMetricsResponse, Metric
from .utils.experiment_route_utils import get_experiment_data
from .utils.plotting import create_plots

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


@app.get("/experimentsflat")
def get_experimentsflat() -> List[Dict[str, Any]]:
    """
    Return a flattened list of experiments and runs
    """
    response_flat = []

    experiments = get_experiments()

    for exp in experiments:
        exp_id = exp.exp_id
        runs = exp.runs

        response_flat += [
            {"exp_id": exp_id, "run_id": run.run_id, "hparams": run.hparams} for run in runs
        ]

    return response_flat


@app.get("/experiments")
def get_experiments() -> List[Experiment]:
    """
    The function returns data for runs under each experiment ID. This API
    is called when the page loads for the first time

    Args:
    ----
    None

    Return:
    ----
    exp_details : Returns a List of Experiment and Run Id's

    """

    exp_details = []

    experiments = [exp for exp in mlflow.MlflowClient().search_experiments()]

    # Iterate through each experiment
    for exp in experiments:
        exp_data = get_experiment_data(exp)

        exp_details.append(exp_data)

    return exp_details


@app.get("/metric/{run_id}")
def get_metrics(run_id: str, with_plots: bool = Query(False)) -> GetMetricsResponse:
    history = {}

    for id in run_id.split("--"):
        try:
            run = mlflow.get_run(id)
        except MlflowException:
            raise HTTPException(status_code=404, detail="Not found")
        all_metrics_names = list(run.data.metrics.keys())
        print(all_metrics_names)
        history[id] = {
            mn: [Metric(step=m.step, value=m.value) for m in client.get_metric_history(id, mn)]
            for mn in all_metrics_names
        }

    if with_plots:
        plots = create_plots(history)
    else:
        plots = []
    return GetMetricsResponse(history=history, plots=[json.loads(p.to_json()) for p in plots])
