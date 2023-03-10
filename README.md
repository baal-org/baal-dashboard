# Baal Dashboard

Tracking UI for Baal experiment building on MLFlow server.

## Install

1. Install the python backend
   1. `poetry install`
2. Install the frontend
   1. `cd webapp && yarn install`

### How to run (Devs):

```bash
# Set tracking URI, can be a sqlite database, an external server, etc.
export MLFLOW_TRACKING_URI=tracking
# If you need fake data
poetry run python scripts/create_fake_data.py
make run
```

Frontend:
```bash
cd webapp
yarn start
```

Both ends will reload automatically on change.

Run a query manually:
1. Go to http://0.0.0.0:8000/docs
2. Find a run ID in `tracking`
3. Try the `/metric` route with this run id.

### Tooling

1. Install precommit hooks `poetry run pre-commit install`
   1. Run precommit manually `poetry run pre-commit run --all-files`
2. Run formatting manually (Python): `make format`


### Generate real data

We have a script `scripts/create_real_data.py` that will run a small model on MNIST.

First install extra deps: `poetry install -E full`
Then run the following:

```bash
export HEURISTIC=bald # Can be one of bald, entropy, random
export SEED=2023 # Seed
# Set tracking URI, can be a sqlite database, an external server, etc.
export MLFLOW_TRACKING_URI=tracking
# If you need fake data
poetry run python scripts/create_real_data.py $HEURISTIC $SEED
make run
```