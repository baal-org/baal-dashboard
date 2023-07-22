import styled from "@emotion/styled";
import { Box, Typography, useTheme } from "@mui/material";
import { useQuery } from "react-query";
import { useConfigurationContext } from "../context/Configuration";
import fetchMetrics from "../services/GetRunMetricsApi";
import { tokens } from "../theme";
import Header from "./global/Header";
import LineChart from "./global/LineChart";
import StatCard from "./global/StatCard";
import React, {useEffect,useRef } from 'react';

export const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { runId, refreshInterval } = useConfigurationContext();
  const intervalId = useRef<any>(null);

  const { isLoading, isError, data, error,refetch} = useQuery({
                    queryKey: ["metrics", runId],
                    queryFn: () => fetchMetrics(runId),
                    enabled: Boolean(runId)
                  })

  // Refetch data
  useEffect(() => {

    if(Number(refreshInterval) > 0 && runId!== null){
      
      clearInterval(intervalId.current);

      intervalId.current = setInterval(() => {
        refetch();  
        console.log("Calling refetch()")
        console.log(runId)
      }, Number(refreshInterval) * 1000); 
    }
    else {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      clearInterval(intervalId.current);
      };
  }, [refreshInterval, runId, refetch]);

  // TODO The backend should do this split probably.
  const dataset_metrics = Object.entries(data || {}).filter(([k, v]) => {
    return k.includes("pool");
  });
  const performance_metrics = Object.entries(data || {}).filter(([k, v]) => {
    return !k.includes("pool");
  });

  const DashboardCardRow = styled(Box)({
    gridColumn: "span 8",
    backgroundColor: colors.primary[400],
    gridGap: "5px",
  });

  const DashboardPlotRow = styled(Box)({
    gridColumn: "span 8",
    gridRow: "span 3",
    backgroundColor: colors.primary[400],
  });

  if (isError || runId === null) {
    return (
      <Box m="20px">
        <Typography variant="h2">Please select a Run to analyse</Typography>
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
        <DashboardCardRow
          display="flex"
          alignItems="center"
          justifyContent="space-around"
        >
          {data &&
            Object.entries(data || {}).map(([key, value]) => {
              return (
                <StatCard title={key} value={value[value.length - 1].value} />
              );
            })}
        </DashboardCardRow>
        {/*Row number two */}
        <DashboardPlotRow
          display="flex"
          alignItems="center"
          justifyContent="left"
        >
          {dataset_metrics && (
            <LineChart
              isDashboard={false}
              data={dataset_metrics.map(([key, value]) => {
                return {
                  id: key,
                  data: value.map((u) => {
                    return { x: u.step, y: u.value };
                  }),
                };
              })}
            />
          )}
          {performance_metrics && (
            <LineChart
              isDashboard={false}
              data={performance_metrics.map(([key, value]) => {
                return {
                  id: key,
                  data: value.map((u) => {
                    return { x: u.step, y: u.value };
                  }),
                };
              })}
            />
          )}
        </DashboardPlotRow>
      </Box>
    </Box>
  );
};