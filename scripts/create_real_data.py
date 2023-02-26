import argparse
import os
import pickle
from copy import deepcopy
from dataclasses import asdict, dataclass

import mlflow
import numpy as np
import structlog
import torch.cuda
from baal import ActiveLearningDataset, ModelWrapper
from baal.active import ActiveLearningLoop, get_heuristic
from baal.bayesian.dropout import patch_module
from torch import nn, optim
from torchvision import transforms
from torchvision.datasets import MNIST
from tqdm import tqdm

from baal_dashboard.tracking import TrackingStep

log = structlog.get_logger(__name__)
UNCERTAINTY_FOLDER = "/tmp"

use_cuda = torch.cuda.is_available()

EXPERIMENT_NAME = "MNIST MC-Dropout"
MLFLOW_TRACKING_URI = "MLFLOW_TRACKING_URI"

if MLFLOW_TRACKING_URI not in os.environ:
    raise EnvironmentError(f"Please set `{MLFLOW_TRACKING_URI}` as an env.")

mlflow.set_tracking_uri(os.environ[MLFLOW_TRACKING_URI])


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("heuristic", choices=["bald", "entropy", "random"])
    parser.add_argument("seed", type=int)
    return parser.parse_args()


@dataclass
class ExperimentConfig:
    heuristic: str
    seed: int


def get_run_id():
    # Get a run id for experiment EXPERIMENT_NAME
    client = mlflow.MlflowClient()
    experiment = client.get_experiment_by_name(EXPERIMENT_NAME)
    if not experiment:
        exp_id = client.create_experiment(name=EXPERIMENT_NAME)
    else:
        exp_id = experiment.experiment_id
    run = mlflow.start_run(experiment_id=exp_id)
    log.info("Starting run!", exp_id=exp_id, run_id=run.info.run_id)
    return run.info.run_id


def log_hparams(run_id, hparams):
    # Log all hparams to the run_id
    client = mlflow.MlflowClient()
    for name, val in asdict(hparams).items():
        client.log_param(run_id, name, val)


def get_datasets(seed):
    train_transform = transforms.Compose([transforms.RandomRotation(30), transforms.ToTensor()])
    test_transform = transforms.ToTensor()
    train_ds = MNIST("/tmp", train=True, transform=train_transform, download=True)
    test_ds = MNIST("/tmp", train=False, transform=test_transform, download=True)
    # Uses an ActiveLearningDataset to help us split labelled and unlabelled examples.
    al_dataset = ActiveLearningDataset(
        train_ds, pool_specifics={"transform": test_transform}, random_state=seed
    )
    al_dataset.label_randomly(200)  # Start with 200 items labelled.
    return al_dataset, test_ds


def load_uncertainty_at(folder, n_labelled, n_unlabelled):
    # Baal currently saves uncertainty on disk.
    pkl_pt = os.path.join(folder, f"uncertainty_pool={n_unlabelled}" f"_labelled={n_labelled}.pkl")
    return pickle.load(open(pkl_pt, "rb"))["uncertainty"].tolist()


args = parse_args()
hparams = ExperimentConfig(heuristic=args.heuristic, seed=args.seed)
run_id = get_run_id()
log_hparams(run_id, hparams)
torch.manual_seed(hparams.seed)
np.random.seed(hparams.seed)

# Creates an MLP to classify MNIST
model = nn.Sequential(
    nn.Flatten(),
    nn.Linear(784, 512),
    nn.Dropout(),
    nn.Linear(512, 512),
    nn.Dropout(),
    nn.Linear(512, 10),
)
model = patch_module(model)  # Set dropout layers for MC-Dropout.
if use_cuda:
    model = model.cuda()
wrapper = ModelWrapper(model=model, criterion=nn.CrossEntropyLoss())
optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9, weight_decay=5e-4)

al_dataset, test_ds = get_datasets(hparams.seed)
# We will use BALD as our heuristic as it is a great tradeoff between performance and efficiency.
heuristic = get_heuristic(hparams.heuristic)
# Setup our active learning loop for our experiments
al_loop = ActiveLearningLoop(
    dataset=al_dataset,
    get_probabilities=wrapper.predict_on_dataset,
    heuristic=heuristic,
    query_size=100,  # We will label 100 examples per step.
    # KWARGS for predict_on_dataset
    iterations=20,  # 20 sampling for MC-Dropout
    batch_size=32,
    use_cuda=use_cuda,
    verbose=False,
    uncertainty_folder=UNCERTAINTY_FOLDER,
)

# Following Gal 2016, we reset the weights at the beginning of each step.
initial_weights = deepcopy(model.state_dict())

for step in tqdm(range(100)):
    n_labelled, pool_size = al_dataset.n_labelled, al_dataset.n_unlabelled
    model.load_state_dict(initial_weights)
    train_loss = wrapper.train_on_dataset(
        al_dataset, optimizer=optimizer, batch_size=32, epoch=5, use_cuda=use_cuda
    )
    test_loss = wrapper.test_on_dataset(test_ds, batch_size=32, use_cuda=use_cuda)

    flag = al_loop.step()
    metrics = wrapper.get_metrics()
    TrackingStep(
        metrics={k: v for k, v in metrics.items() if "train" in k or "test" in k},
        uncertainty=load_uncertainty_at(UNCERTAINTY_FOLDER, n_labelled, pool_size),
        dataset_length=n_labelled,
        pool_size=pool_size,
    ).log(run_id)

    if not flag:
        # We are done labelling! stopping
        break
mlflow.end_run()
