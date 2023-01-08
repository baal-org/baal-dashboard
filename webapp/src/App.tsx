import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select'
import axios from 'axios'

function ConfigSelector() {
  let [experiments, setExperiments] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        '/experiments',
      );

      setExperiments(result.data);
    };

    fetchData();
  }, []);

  const options = experiments.map( exp_id => {
    return {value: exp_id, label: exp_id}
  })
  return (
      <Select options={options} />
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ConfigSelector />
        <p>
          Select an <code>Experiment ID</code> press Process.
        </p>
      </header>
    </div>
  );
}

export default App;
