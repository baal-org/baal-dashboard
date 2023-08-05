from typing import List

import pandas as pd
import plotly.express as px
from plotly.graph_objs import Figure

from baal_dashboard.datamodels.metric import History


def create_plots(history: History) -> List[Figure]:
    """Create plots from an history of metrics fetched from MLFlow"""
    all_plots = []
    for metric_name, metric in history.items():
        df = pd.DataFrame.from_records([s.dict() for s in metric])
        all_plots.append(px.line(df, x="step", y="value", title=metric_name))
    return all_plots
