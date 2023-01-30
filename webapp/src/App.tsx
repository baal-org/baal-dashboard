import logo from "./logo.svg";
import "./App.css";
import SelectorComponent from "./component/SelectorComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SelectorComponent />
        <p>
          Select an <code>Experiment ID</code> press Process.
        </p>
      </header>
    </div>
  );
}

export default App;
