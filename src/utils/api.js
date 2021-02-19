import utils from './utils';

export const getMemes = async (sessionId) => {

  const fetch = require('cross-fetch');
  const getOrCreateAuthToken = require('./getOrCreateAuthToken');
  const ENDPOINT = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1`;
  const REACT_APP_ASTRA_DB_KEYSPACE = process.env.REACT_APP_ASTRA_DB_KEYSPACE;
  const TABLE_NAME = 'memegen';
  const {authToken} = await getOrCreateAuthToken();

  try {
    const response = await fetch(`${ENDPOINT}/keyspaces/${REACT_APP_ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows`, {
      headers: {
        'x-cassandra-token': authToken
      }
    });
    return response.json();
  } catch (e) {
    return JSON.stringify(e);
  }
};

export const getMemesSaved = async (query) => {
  const fetch = require('cross-fetch');
  const getOrCreateAuthToken = require('./getOrCreateAuthToken');
  const ENDPOINT = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1`;
  const REACT_APP_ASTRA_DB_KEYSPACE = process.env.REACT_APP_ASTRA_DB_KEYSPACE;
  const TABLE_NAME = 'memes_saved';
  const {authToken} = await getOrCreateAuthToken();

  try {
    const response = await fetch(`${ENDPOINT}/keyspaces/${REACT_APP_ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cassandra-token': authToken
      },
      body: query
    });
    return response.json();
  } catch (e) {
    return JSON.stringify(e);
  }
};

export const deleteMemes = async (sessionId) => {
  // stub for code in /functions
  //return response.json();
};

export const saveMemes = async (meme, sessionId) => {
  //if (!meme.uuid) {
  //  meme.uuid = utils.uuid();
  //}
  meme.uuid = utils.uuid();
  meme['sessionid'] = sessionId;

  const columns = {
    columns: Object.keys(meme).map(key => {
      return {
        name: key,
        value: meme[key]
      };
    })
  };

  const fetch = require('cross-fetch');
  const getOrCreateAuthToken = require('./getOrCreateAuthToken');
  const ENDPOINT = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1`;
  const REACT_APP_ASTRA_DB_KEYSPACE = process.env.REACT_APP_ASTRA_DB_KEYSPACE;
  const TABLE_NAME = 'memes_saved';
  const {authToken} = await getOrCreateAuthToken();

  try {
    const response = await fetch(`${ENDPOINT}/keyspaces/${REACT_APP_ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cassandra-token': authToken,
      },
      body: JSON.stringify(columns)
    });
    return JSON.stringify(await response.json());
  } catch (e) {
    return JSON.stringify(e);
  }

};