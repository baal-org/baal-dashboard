import React, { createContext, useContext, useState } from "react";

interface ConfigurationContextValue {
  runId: string | null;
  setRunId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshInterval: string | undefined;
  setrRefreshInterval: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// create config context
const ConfigurationContext = createContext<ConfigurationContextValue>({
  runId: null,
  setRunId: (runId) => {
    return null;
  },
  refreshInterval: undefined,
  setrRefreshInterval: (refreshTime) => {
    return null;
  },
});

type ConfigurationProps = {
  children: React.ReactNode;
};
// create context provider
export const ConfigurationProvider = ({ children }: ConfigurationProps) => {
  const [runId, setRunId] = useState<string | null>(null);
  const [refreshInterval, setrRefreshInterval] = useState<string | undefined>("0");
  // the value passed in here will be accessible anywhere in our application
  // you can pass any value, in our case we pass our state and it's update method
  return (
    <ConfigurationContext.Provider value={{ runId, setRunId, refreshInterval, setrRefreshInterval}}>
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
