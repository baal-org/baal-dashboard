import ErrorIcon from "@mui/icons-material/Error";
import {
  Box,
  CircularProgress,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import ExperimentInterface from "../interfaces/ExperimentInterface";
import { tokens } from "../theme";

/**
 * ConfigSelector is a functional component that renders a select dropdown component and allows the user
 * to select a run under an experiment.
 *
 * @function ConfigSelector
 * @param {Object} onSelect - A callback function to fetch data for the the selected run under an experiment
 * @returns {React.FunctionComponent} - A functional component that renders a select dropdown component.
 *
 * @example
 * <ConfigSelector onChange={handleSelect} />
 *
 * @async
 * @function fetchData
 * @returns {Promise<Object>} - The data fetched from the endpoint. JSON for run id's under different experiments
 *
 * @see Select
 * @see ExperimentInterface
 */

const ErrorBox = styled(Box)({
  margin: "10px",
  display: "flex",
});

function ConfigSelector({ onSelect }: { onSelect: any }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [],
    queryFn: () => axios.get("/experiments").then((res) => res.data),
    enabled: true,
  });

  if (isLoading) {
    return (
      <Box>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (isError || data === undefined) {
    return (
      <ErrorBox>
        <ErrorIcon sx={{ marginRight: "5px" }} />
        <Typography>Can't access experiments</Typography>
      </ErrorBox>
    );
  }

  const experiments: ExperimentInterface[] = data;
  const options = experiments.map((item) => {
    return {
      value: item.exp_id,
      label: item.exp_id,
      options: item.runs.map((subItem) => {
        return {
          value: subItem.run_id,
          label:
            Object.entries(subItem.hparams)
              .map(([key, value]) => `${key}=${value}`)
              .join(" ") + ` ${subItem.run_id}`,
        };
      }),
    };
  });

  return (
    <Select
      options={options}
      onChange={onSelect}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary: colors.primary[800],
          primary75: colors.primary[600],
          primary50: colors.primary[500],
          primary25: colors.primary[400],
          neutral0: colors.primary[200],
          neutral5: colors.grey[200],
          neutral10: colors.grey[300],
          neutral20: colors.grey[400],
          neutral30: colors.grey[500],
          neutral40: colors.grey[600],
          neutral50: colors.grey[700],
          neutral60: colors.grey[800],
          neutral70: colors.grey[900],
          neutral80: colors.grey[900],
          neutral90: colors.grey[900],
          danger: colors.greenAccent[500],
          dangerLight: colors.greenAccent[500],
        },
      })}
    />
  );
}

export default ConfigSelector;
