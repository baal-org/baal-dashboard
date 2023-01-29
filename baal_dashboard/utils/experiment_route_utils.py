import mlflow

from ..datamodels.experiment import Experiment


def get_experiment_data(exp: str) -> Experiment:
    """
    Return data for an experiment

    Args:
    ----
    exp : The experiment id

    Returns:
    ----
    Experiment

    """
    exp_dict = {}

    exp_id = exp.experiment_id

    exp_dict["exp_id"] = exp_id

    # Get a list of all run_id's for the current experiment
    runs = mlflow.search_runs(experiment_ids=exp_id)

    run_ids = runs["run_id"].tolist()

    run_details = []

    for idx, run in enumerate(run_ids):
        run_details.append({"run_id": run})

    exp_dict["run_ids"] = run_details

    return exp_dict
