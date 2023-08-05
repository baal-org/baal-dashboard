import styled from "@emotion/styled";
import { Box, Typography, useTheme } from "@mui/material";
import { useQuery } from "react-query";
import { useConfigurationContext } from "../context/Configuration";
import fetchMetrics from "../services/GetRunMetricsApi";
import { tokens } from "../theme";
import Header from "./global/Header";
import PlotWrapper from "./global/PlotWrapper";
import StatCard from "./global/StatCard";
import _ from "lodash";
import React, { useEffect, useRef } from "react";

export const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { runId, refreshInterval, mlflowTrackingURI } =
    useConfigurationContext();
  const intervalId = useRef<any>(null);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["metrics", runId],
    queryFn: () => fetchMetrics(mlflowTrackingURI, runId),
    enabled: Boolean(runId),
    refetchOnWindowFocus: false,
  });

  // Refetch data
  useEffect(() => {
    if (Number(refreshInterval) > 0 && runId !== null) {
      clearInterval(intervalId.current);

      intervalId.current = setInterval(
        () => {
          refetch();
        },
        Number(refreshInterval) * 1000,
      );
    } else {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      clearInterval(intervalId.current);
    };
  }, [refreshInterval, runId, refetch]);

  const DashboardCardRow = styled(Box)({
    gridColumn: "span 8",
    backgroundColor: colors.primary[400],
    gridGap: "5px",
  });

  const DashboardPlotRow = styled(Box)({
    gridColumn: "span 8",
    gridRow: "span 6",
    flexFlow: "wrap",
    alignContent: "baseline",
    justifyContent: "space-between",
    backgroundColor: colors.primary[400],
  });

  const DashboardPlotItem = styled(Box)({
    gridColumn: "span 4",
    maxWidth: "100%",
    gridRow: "span 2",
    backgroundColor: colors.primary[400],
  });

  if (isError || runId === null) {
    return (
      <Box m="20px">
        <Typography variant="h2">Please select a Run to analyse</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box m="20px">
        <Typography variant="h2">No data available.</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Baal Dashboard" subtitle={`Run Id: ${runId}`} />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Row number one (Cards) */}
        <DashboardCardRow display="flex">
          {!_.isEmpty(data.history) &&
            Object.entries(data.history).map(([key, value]) => {
              return (
                <StatCard title={key} value={value[value.length - 1].value} />
              );
            })}
        </DashboardCardRow>
        {/*Row number two */}
        <DashboardPlotRow display="flex" alignItems="top" justifyContent="left">
          {data.plots &&
            data.plots.map((data) => {
              return (
                <DashboardPlotItem>
                  <PlotWrapper props={data} isDashboard={false} />
                </DashboardPlotItem>
              );
            })}
        </DashboardPlotRow>
      </Box>
    </Box>
  );
};
