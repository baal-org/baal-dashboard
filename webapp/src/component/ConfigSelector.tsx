import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import ExperimentInterface from "../interfaces/ExperimentInterface";

/**
 * ConfigSelector is a functional component that renders a select dropdown component and allows the user
 * to select a run under an experiment.
 *
 * @function ConfigSelector
 * @param {Object} onSelect - A callback function to fetch data for the the selected run under an experiment
 * @returns {React.FunctionComponent} - A functional component that renders a select dropdown component.
 *
 * @example
 * <ConfigSelector onChange={handleSelect} />
 *
 * @async
 * @function fetchData
 * @returns {Promise<Object>} - The data fetched from the endpoint. JSON for run id's under different experiments
 *
 * @see Select
 * @see ExperimentInterface
 */

function ConfigSelector({ onSelect }: { onSelect: any }) {
  let [experiments, setExperiments] = useState<ExperimentInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/experiments");

      setExperiments(result.data);
    };

    fetchData();
  }, []);

  const options = experiments.map((item) => {
    return {
      value: item.exp_id,
      label: item.exp_id,
      options: item.runs.map((subItem) => {
        return {
          value: subItem.run_id,
          label:
            Object.entries(subItem.hparams)
              .map(([key, value]) => `${key}=${value}`)
              .join(" ") + ` ${subItem.run_id}`,
        };
      }),
    };
  });

  return <Select options={options} onChange={onSelect} />;
}

export default ConfigSelector;
