import json
import os
from typing import List

import mlflow
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from mlflow import MlflowException

from .datamodels.experiment import Experiment
from .datamodels.metric import GetMetricsResponse, Metric
from .utils.experiment_route_utils import get_experiment_data
from .utils.plotting import create_plots

MLFLOW_TRACKING_URI = "MLFLOW_TRACKING_URI"

app = FastAPI()

# Add Options for CORS
# TODO: Change the options below if you plan to put this into prod

origins = [
    "*",
]


def get_mlflow_client(mlflow_tracking_uri: str = Query(None)):
    if mlflow_tracking_uri is None and os.getenv(MLFLOW_TRACKING_URI) is None:
        raise EnvironmentError(
            f"Please set `{MLFLOW_TRACKING_URI}` as an env or send it from the frontend."
        )
    uri = mlflow_tracking_uri or os.getenv(MLFLOW_TRACKING_URI)
    mlflow.set_tracking_uri(uri)
    return mlflow.MlflowClient()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/experiments")
def get_experiments(client=Depends(get_mlflow_client)) -> List[Experiment]:
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

    experiments = [exp for exp in client.search_experiments()]

    # Iterate through each experiment
    for exp in experiments:
        exp_data = get_experiment_data(exp)

        exp_details.append(exp_data)

    return exp_details


@app.get("/metric/{run_id}")
def get_metrics(
    run_id: str, with_plots: bool = Query(False), client=Depends(get_mlflow_client)
) -> GetMetricsResponse:
    try:
        run = mlflow.get_run(run_id)
    except MlflowException:
        raise HTTPException(status_code=404, detail="Not found")
    all_metrics_names = list(run.data.metrics.keys())
    print(all_metrics_names)
    history = {
        mn: [Metric(step=m.step, value=m.value) for m in client.get_metric_history(run_id, mn)]
        for mn in all_metrics_names
    }
    if with_plots:
        plots = create_plots(history)
    else:
        plots = []
    return GetMetricsResponse(history=history, plots=[json.loads(p.to_json()) for p in plots])
