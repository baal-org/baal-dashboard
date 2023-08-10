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
import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";

export const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { refreshInterval, runIdArr } = useConfigurationContext();
  const intervalId = useRef<any>(null);

  // Swipeable views
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setmaxSteps] = useState(0);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["metrics", runIdArr],
    queryFn: () => fetchMetrics(runIdArr.join("--")),
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
      setActiveStep(0);
    };
  }, [refreshInterval, runIdArr, refetch]);

  useEffect(() => {
    if (!isLoading && !isError && data && data.plots && data.plots.length > 0) {
      setmaxSteps(data.plots.length);
    }
  }, [isLoading, isError, data]);

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        <Grid container>
          <Grid item sm={12} md={12} lg={12}>
            <Header
              title="Baal Dashboard"
              subtitle={`Run Id: ${runIdArr.join(",")}`}
            />
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Row number one (Cards) */}
          {!_.isEmpty(data.history) &&
            Object.entries(data.history).flatMap(([experimentId, metrics]) => {
              return Object.entries(metrics).map(
                ([metricName, metricValues]) => {
                  const latestMetricValue =
                    metricValues[metricValues.length - 1].value;
                  const uniqueKey = `${experimentId}-${metricName}`;
                  return (
                    <Grid item key={uniqueKey} sm={3} md={4} lg={4}>
                      <StatCard
                        title={uniqueKey} // Display experiment ID and metric name
                        value={latestMetricValue}
                      />
                    </Grid>
                  );
                },
              );
            })}
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sm={12} md={6} lg={6}>
            <PlotWrapper props={data.plots[activeStep]} isDashboard={false} />

            <MobileStepper
              variant="text"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                  color="secondary"
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  color="secondary"
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </Grid>
        </Grid>

        {/* </Grid> */}
      </Grid>
    </Box>
  );
};
