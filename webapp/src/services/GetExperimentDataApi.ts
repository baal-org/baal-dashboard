/** TODO : Change the URL to be read via config instead of hardcode */
const EXP_API_URL = 'http://127.0.0.1:8000/metric';

/**
 * Fetches data from a metric endpoint via `fetch`.
 * @async
 * @function fetchData
 * @param {string} expid - The specific run id under an experiment
 * @returns {Promise<Object>} - Data from endpoint
 * @throws {Error} - Log error in console
 */

const fetchData = async (expid : string) => {

  const URL = `${EXP_API_URL}/${expid}`;

	const config = {
		method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
	};

  return await fetch(URL, config).then( response => response.json() ).catch(err => console.log(err));
  
}

export default fetchData;