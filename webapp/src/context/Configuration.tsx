import React, { createContext, useContext, useState } from "react";

interface ConfigurationContextValue {
  refreshInterval: number | null;
  setRefreshInterval: React.Dispatch<React.SetStateAction<number | null>>;
  runIdArr: Array<string> | [];
  setRunIdArr: React.Dispatch<React.SetStateAction<Array<string> | []>>;
}

// create config context
const ConfigurationContext = createContext<ConfigurationContextValue>({
  refreshInterval: null,
  setRefreshInterval: (refreshTime) => {
    return null;
  },
  runIdArr: [],
  setRunIdArr: (runIdArr) => {
    return [];
  },
});

type ConfigurationProps = {
  children: React.ReactNode;
};
// create context provider
export const ConfigurationProvider = ({ children }: ConfigurationProps) => {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(0);
  const [runIdArr, setRunIdArr] = useState<Array<string> | []>([]);
  // the value passed in here will be accessible anywhere in our application
  // you can pass any value, in our case we pass our state and it's update method
  return (
    <ConfigurationContext.Provider
      value={{ refreshInterval, setRefreshInterval, runIdArr, setRunIdArr }}
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
