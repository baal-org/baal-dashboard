import axios from "axios";

type MetricProps = {
  step: number;
  value: number;
};

type MetricResponse = {
  history: Record<string, Array<MetricProps>>;
  plots: Array<any>;
};

const fetchMetrics = (
  mlflow_uri: string | null,
  runId: string | null,
): Promise<MetricResponse> => {
  return axios
    .get(`metric/${runId}?mlflow_tracking_uri=${mlflow_uri}&with_plots=true`)
    .then((response) => response.data);
};

export default fetchMetrics;
