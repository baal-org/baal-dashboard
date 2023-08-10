import React, { createContext, useContext, useState } from "react";

interface ConfigurationContextValue {
  runId: string | null;
  setRunId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshInterval: number | null;
  setRefreshInterval: React.Dispatch<React.SetStateAction<number | null>>;
}

// create config context
const ConfigurationContext = createContext<ConfigurationContextValue>({
  runId: null,
  setRunId: (runId) => {
    return null;
  },
  refreshInterval: null,
  setRefreshInterval: (refreshTime) => {
    return null;
  },
});

type ConfigurationProps = {
  children: React.ReactNode;
};
// create context provider
export const ConfigurationProvider = ({ children }: ConfigurationProps) => {
  const [runId, setRunId] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(0);
  // the value passed in here will be accessible anywhere in our application
  // you can pass any value, in our case we pass our state and it's update method
  return (
    <ConfigurationContext.Provider
      value={{ runId, setRunId, refreshInterval, setRefreshInterval }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

// useConfigurationContext will be used to use and update state accross the app
// we can access to data and setData using this method
// anywhere in any component that's inside ConfigurationProvider
export const useConfigurationContext = () => {
  return useContext(ConfigurationContext);
};
