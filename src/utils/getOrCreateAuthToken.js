const fetch = require('cross-fetch')
const ENDPOINT = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1`;
const REACT_APP_ASTRA_DB_USERNAME = process.env.REACT_APP_ASTRA_DB_USERNAME;
const REACT_APP_ASTRA_DB_PASSWORD = process.env.REACT_APP_ASTRA_DB_PASSWORD;

/*
 * This global variable will persist across requests throughout the life of the lambda.
 * We only need to fetch a token for the first request
 * Lambda creates new containers when the original one expires or if there is high concurrency
 * in which case the new containers will have to fetch their own tokens.
 */
let cachedToken;

module.exports = async function getOrCreateAuthToken() {
  if (cachedToken) {
    return cachedToken;
  }
  try {
    console.log(ENDPOINT)
    const response = await fetch(`${ENDPOINT}/auth`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: REACT_APP_ASTRA_DB_USERNAME,
        password: REACT_APP_ASTRA_DB_PASSWORD,
      }),
    });
    cachedToken = await response.json();
    return cachedToken;
  } catch (e) {
    throw new Error('Could not authenticate with the Astra API');
  }
}