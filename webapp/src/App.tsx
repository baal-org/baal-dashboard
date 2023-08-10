import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import Sidebar from "./component/global/SideBar";
import TopBar from "./component/global/TopBar";
import { ColorModeContext, useMode } from "./theme";
import { ConfigurationProvider } from "./context/Configuration";
import { Dashboard } from "./component/Dashboard";
import { ExperimentTable } from "./component/ExperimentTable";
import { QueryClient, QueryClientProvider } from "react-query";
import Grid from "@mui/material/Grid";

function App() {
  const [theme, colorMode] = useMode();
  const queryClient = new QueryClient();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <ConfigurationProvider>
            <Grid container width="100%">
              <div className="app">
                <Sidebar />
                <main className="content">
                  <TopBar />
                  <Dashboard />
                  <ExperimentTable />
                </main>
              </div>
            </Grid>
          </ConfigurationProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
