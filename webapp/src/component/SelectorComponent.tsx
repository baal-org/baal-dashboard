import React, {useState} from 'react';
import ConfigSelector from './ConfigSelector';
import fetchData from '../services/GetExperimentDataApi';

/**
 * SelectorComponent is a functional component that renders a ConfigSelector component and handles the selected option.
 * @function SelectorComponent
 * @returns {React.FunctionComponent} - A functional component that renders a ConfigSelector and handles 
 * the selected option.
 *
 * @example
 * <SelectorComponent />
 *
 * @async
 * @function handleSelect
 * @param {Object} selectedOption - An object that holds the selected option value and label.
 * @param {string} selectedOption.value - The selected option value.
 * @param {string} selectedOption.label - The selected option label.
 * @returns {Promise<Object>} - The data fetched from the endpoint.
 * 
 * @see ConfigSelector
 * @see fetchData
 */

function SelectorComponent() {
    async function handleSelect(selectedOption : {value: string, label: string}) {

        const data = await fetchData(selectedOption.value);
    }

    return (
        <div>
            <ConfigSelector onSelect={handleSelect} />
        </div>
    )
}
export default SelectorComponent


