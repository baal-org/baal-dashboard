import { useConfigurationContext } from "../context/Configuration";
import { Typography } from "@mui/material";

export const Dashboard = () => {
  const { runId } = useConfigurationContext();

  return <Typography>{runId || "No Experiment selected"}</Typography>;
};
