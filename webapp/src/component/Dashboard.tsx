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
  const { runId, refreshInterval, runIdArr } = useConfigurationContext();
  const intervalId = useRef<any>(null);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["metrics", runIdArr],
    queryFn: () => fetchMetrics(runIdArr.join('--')),
    enabled: runIdArr.length > 0,
    refetchOnWindowFocus: false,
  });

  // Refetch data
  useEffect(() => {
    if (Number(refreshInterval) > 0 && runIdArr.length > 0) {
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
  }, [refreshInterval, runIdArr, refetch]);

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

  if (isError || runIdArr.length == 0) {
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

  console.log(data)

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
        {/* <DashboardCardRow display="flex">
          {!_.isEmpty(data.history) &&
            Object.entries(data.history).map(([key, value]) => {
              return (
                <StatCard title={key} value={value[value.length - 1].value} />
              );
            })}
        </DashboardCardRow> */}
        <DashboardCardRow display="flex">
          {!_.isEmpty(data.history) &&
            Object.entries(data.history).flatMap(([experimentId, metrics]) => {
              return Object.entries(metrics).map(([metricName, metricValues]) => {
                const latestMetricValue = metricValues[metricValues.length - 1].value;
                return (
                  <StatCard
                    title={experimentId + ' - ' + metricName} // Display experiment ID and metric name
                    value={latestMetricValue}
                  />
                );
              });
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
