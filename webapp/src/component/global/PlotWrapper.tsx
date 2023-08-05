import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Plot from "react-plotly.js";
import _ from "lodash";

type PlotWrapperProps = {
  isDashboard?: boolean;
  props: any;
};

const PlotWrapper = ({ isDashboard = false, props }: PlotWrapperProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const clone = _.cloneDeep(props);

  // Because of the plotly library mutating the passed props, we have to clone the props here
  // because on rerendered they would not match the object plotly is now using
  // https://github.com/plotly/react-plotly.js/issues/43
  return <Plot {...clone} config={{ displayModeBar: false }} />;
};

export default PlotWrapper;
