from typing import Dict, List

import pandas as pd
import plotly.graph_objects as go
from plotly.graph_objects import Figure

from baal_dashboard.datamodels.metric import History


def create_plots(history: History) -> List[Figure]:
    """Create plots from an history of metrics fetched from MLFlow"""
    all_plots: Dict[str, Figure] = {}

    all_metrics = set(
        [inner_key for inner_dict in history.values() for inner_key in inner_dict.keys()]
    )

    for metric in all_metrics:
        all_plots.setdefault(metric, Figure())
        all_plots[metric].update_layout(title=f"{metric} over time")

        for run_id in history.keys():
            get_metric = history[run_id].get(metric)

            if get_metric is None:
                continue

            df = pd.DataFrame.from_records([s.dict() for s in get_metric])

            all_plots[metric].add_trace(
                go.Scatter(
                    x=df["step"],
                    y=df["value"],
                    mode="lines+markers",
                    showlegend=False,
                    name=f"{run_id}_{metric}",
                )
            )

    return list(all_plots.values())
