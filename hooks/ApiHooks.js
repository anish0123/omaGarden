import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, baseUrl} from '../utils/variables';

const doFetch = async (url, options) => {
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

const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);

  const loadMedia = async () => {
    try {
      let json = await useTag().getFilesByTag(appId);

      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }
      json.reverse();
      const media = await Promise.all(
        json.map(async (file) => {
          const fileResponse = await fetch(baseUrl + 'media/' + file.file_id);
          return await fileResponse.json();
        })
      );
      setMediaArray(media);
      console.log('loadMedia', mediaArray);
    } catch (error) {
      throw new Error('loadMedia', error.message);
    }
  };

  const postMedia = async (fileData, token) => {
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: fileData,
    };
    try {
      const uploadResult = await doFetch(baseUrl + 'media', options);
      return uploadResult;
    } catch (error) {
      throw new Error('postMedia: ', error.message);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);

  return {loadMedia, mediaArray, postMedia};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(baseUrl + 'tags/' + tag);
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
      const tagResult = await doFetch(baseUrl + 'tags', options);
      return tagResult;
    } catch (error) {
      throw new Error('postTag', error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useAuthentication = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      const loginResult = await doFetch(baseUrl + 'login', options);
      return loginResult;
    } catch (error) {
      console.log('postlogin', error);
      throw new Error('postLogin: ', error.message);
    }
  };
  return {postLogin};
};

const useUser = () => {
  const getUserById = async (id, token) => {
    try {
      return await doFetch(baseUrl + 'users/' + id, {
        headers: {'x-access-token': token},
      });
    } catch (error) {
      throw new Error('getUserById ' + error.message);
    }
  };

  const getCurrentUser = async (token) => {
    try {
      return await doFetch(baseUrl + 'users/user', {
        headers: {'x-access-token': token},
      });
    } catch (error) {
      throw new Error('getCurrentUser ' + error.message);
    }
  };
  const postUser = async (userData) => {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await doFetch(baseUrl + 'users', options);
    } catch (error) {
      throw new Error('postUser: ' + error.message);
    }
  };

  const putUser = async (data, token) => {
    const options = {
      method: 'put',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      console.log('Options ' + options);
      return await doFetch(baseUrl + 'users', options);
    } catch (error) {
      throw new Error('put user: ' + error.message);
    }
  };

  const checkUsername = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('Check username ' + error.message);
    }
  };
  return {getUserById, getCurrentUser, putUser, checkUsername, postUser};
};

const useFavourite = () => {
  const postFavourite = async (fileId, token) => {
    console.log('posting favourite', fileId);
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({file_id: fileId}),
    };
    console.log(options);
    try {
      // TODO: use fetch to send request to media endpoint and return the result as json, handle errors with try/catch and response.ok
      console.log('trying to post ');
      const tagResult = await doFetch(baseUrl + 'favourites', options);
      console.log(tagResult);
      return tagResult;
    } catch (error) {
      throw new Error('postFavourite: ' + error.message);
    }
  };

  const getFavouritesByUser = async (token) => {};

  const getFavouritesByFileId = async (fileId, token) => {
    try {
      return await doFetch(baseUrl + 'favourites/file/' + fileId);
    } catch (error) {
      throw new Error('getFavourtiesByFileId error, ' + error.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'delete',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(baseUrl + 'favourites/file/' + fileId, options);
    } catch (error) {
      throw new Error('deleteFavourties error, ' + error.message);
    }
  };

  return {
    postFavourite,
    getFavouritesByUser,
    getFavouritesByFileId,
    deleteFavourite,
  };
};

const useComment = () => {
  const getCommentsByFileId = async (fileId) => {
    console.log('get comments by file Id', fileId);
    try {
      return await doFetch(baseUrl + 'comments/file/' + fileId);
    } catch (error) {
      throw new Error('get comments error, ' + error.message);
    }
  };

  const postComment = async (data, token) => {
    console.log('post comment', data);
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    console.log('post Comment', options);
    try {
      const commentResult = await doFetch(baseUrl + 'comments', options);
      return commentResult;
    } catch (error) {
      throw new Error('post Comment error, ' + error.message);
    }
  };

  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'delete',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const deleteResult = await doFetch(
        baseUrl + 'comments/' + commentId,
        options
      );
      return deleteResult;
    } catch (error) {
      throw new Error('delete comment error, ' + error.message);
    }
  };

  return {getCommentsByFileId, postComment, deleteComment};
};

export {useMedia, useTag, useUser, useAuthentication, useFavourite, useComment};
