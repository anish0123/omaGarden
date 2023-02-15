/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {baseUrl} from '../utils/variables';

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    const message = json.error
      ? `${json.message} : ${json.error}`
      : json.message;
    throw new Error(message || response.statusText);
  }
  return json;
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await fetchData(baseUrl + 'tags/' + tag);
    } catch (error) {
      throw new Error('getFilesByTag', error.message);
    }
  };

  const postTag = async (data, token) => {
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      return await fetchData(baseUrl + 'tags', options);
    } catch (error) {
      throw new Error('postTag: ' + error.message);
    }
  };
  return {getFilesByTag, postTag};
};
export {useTag};
