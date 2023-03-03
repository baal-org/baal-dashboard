import axios from "axios";

type MetricProps = {
  step: number;
  value: number;
};

type MetricResponse = Record<string, Array<MetricProps>>;

const fetchMetrics = (runId: string | null): Promise<MetricResponse> => {
  return axios.get(`metric/${runId}`).then((response) => response.data);
};

export default fetchMetrics;
