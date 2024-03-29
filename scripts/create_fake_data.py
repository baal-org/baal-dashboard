import argparse
import os
import random

import mlflow
import numpy as np
import time

from baal_dashboard.tracking import TrackingStep

MLFLOW_TRACKING_URI = "MLFLOW_TRACKING_URI"

if MLFLOW_TRACKING_URI not in os.environ:
    raise EnvironmentError(f"Please set `{MLFLOW_TRACKING_URI}` as an env.")

mlflow.set_tracking_uri(os.environ[MLFLOW_TRACKING_URI])


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--steps", default=100)
    parser.add_argument("--query_size", default=15)
    parser.add_argument("--metrics", default=["accuracy", "f1"])
    parser.add_argument("--delay", default=0)
    return parser.parse_args()


def gen_metrics(metric_names):
    return {met_name: random.random() for met_name in metric_names}


def main(args):
    client = mlflow.MlflowClient()
    if not (exp := client.get_experiment_by_name("experiment")):
        client.create_experiment("experiment")
        exp = client.get_experiment_by_name("experiment")
    run = client.create_run(exp.experiment_id)

    # Log HParams (TODO Add this to baal itself)
    client.log_param(run.info.run_id, "query_size", args.query_size)
    client.log_param(run.info.run_id, "steps", args.steps)

    for step_number in range(args.steps):
        n_labelled = step_number * args.query_size
        pool_size = args.steps * args.query_size - n_labelled
        TrackingStep(
            metrics=gen_metrics(args.metrics),
            uncertainty=np.random.rand(pool_size).tolist(),
            dataset_length=n_labelled,
            pool_size=pool_size,
        ).log(run.info.run_id)
        time.sleep(int(args.delay))

    print("Metrics generated")
    print("Tracking URI", os.environ[MLFLOW_TRACKING_URI])
    print("Run id", run.info.run_id)


if __name__ == "__main__":
    main(parse_args())
