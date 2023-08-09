import axios from "axios";

type MetricProps = {
  step: number;
  value: number;
};

type MetricResponse = {
  history: Record<string,Record<string, Array<MetricProps>>>;
  plots: Array<any>;
};

const fetchMetrics = (runId: string | null): Promise<MetricResponse> => {
  return axios
    .get(`metric/${runId}?with_plots=true`)
    .then((response) => response.data);
};

export default fetchMetrics;
