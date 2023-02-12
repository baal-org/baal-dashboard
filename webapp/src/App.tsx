import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import Sidebar from "./component/global/SideBar";
import TopBar from "./component/global/TopBar";
import { ColorModeContext, useMode } from "./theme";
import { ConfigurationProvider } from "./context/Configuration";
import { Dashboard } from "./component/Dashboard";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfigurationProvider>
          <div className="app">
            <Sidebar />
            <main className="content">
              <TopBar />
              <Dashboard />
            </main>
          </div>
        </ConfigurationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
