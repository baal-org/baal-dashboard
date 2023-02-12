import mlflow
import mlflow.entities as mlflow_types

from ..datamodels.experiment import Experiment, RunInfo


def get_experiment_data(exp: mlflow_types.Experiment) -> Experiment:
    """
    Return data for an experiment

    Args:
    ----
    exp : The experiment id

    Returns:
    ----
    Experiment

    """
    exp_id = exp.experiment_id

    # Get a list of all run_id's for the current experiment
    runs_data = mlflow.search_runs(experiment_ids=exp_id)
    run_objs = [mlflow.get_run(run_id) for run_id in runs_data["run_id"]]

    return Experiment(
        exp_id=exp_id,
        runs=[RunInfo(run_id=run.info.run_id, hparams=run.data.params) for run in run_objs],
    )
