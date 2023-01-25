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

  const url = `${EXP_API_URL}/${expid}`;

	const config = {
		method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
	};

  try {
      const response = await fetch(url,config);
      const data = await response.json();
      console.log(data)
      return data;
  } catch (error) {
      console.log(error)
  }
  
}

export default fetchData;