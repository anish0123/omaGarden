import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, baseUrl} from '../utils/variables';

// Method for fetching data from api
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

// Method for working on media (picture or videos).
const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);

  // Method for loading the media from the api.
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
    } catch (error) {
      throw new Error('loadMedia', error.message);
    }
  };

  // Method for loading all the media/post uploaded by the user.
  const loadAllMedia = async (id) => {
    try {
      let json = await useTag().getFilesByTag(appId);

      for (let i = 0; i < json.length; i++) {
        json = json.filter((file) => file.user_id === id);
      }
      json.reverse();
      return await Promise.all(
        json.map(async (file) => {
          const fileResponse = await fetch(baseUrl + 'media/' + file.file_id);
          return await fileResponse.json();
        })
      );
    } catch (error) {
      console.error('List, loadMedia', error);
    }
  };

  // Method for posting the media in the api
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

  // Method for editing a media/post in the api
  const putMedia = async (id, data, token) => {
    const options = {
      method: 'put',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const uploadResult = await doFetch(baseUrl + 'media/' + id, options);
      return uploadResult;
    } catch (error) {
      console.log('putMedia:', error.message);
      throw new Error('putMedia:', error.message);
    }
  };

  // Method for deleting media/post from the api.
  const deleteMedia = async (id, token) => {
    try {
      return await doFetch(baseUrl + 'media/' + id, {
        headers: {'x-access-token': token},
        method: 'delete',
      });
    } catch (error) {
      throw new Error('deleteMedia' + error.message);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);

  return {
    loadMedia,
    mediaArray,
    postMedia,
    putMedia,
    deleteMedia,
    loadAllMedia,
  };
};

// Method for using tag in the media
const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(baseUrl + 'tags/' + tag);
    } catch (error) {
      throw new Error('getFilesByTag', error.message);
    }
  };

  // Method for posting a tag.
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

// Method for authenticating users.
const useAuthentication = () => {
  // Method for logging in users.
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
      throw new Error('postLogin: ', error.message);
    }
  };
  return {postLogin};
};

// Method about users.
const useUser = () => {
  // Method for getting users according to user id
  const getUserById = async (id, token) => {
    try {
      return await doFetch(baseUrl + 'users/' + id, {
        headers: {'x-access-token': token},
      });
    } catch (error) {
      throw new Error('getUserById ' + error.message);
    }
  };

  // Method for getting the current user
  const getCurrentUser = async (token) => {
    try {
      return await doFetch(baseUrl + 'users/user', {
        headers: {'x-access-token': token},
      });
    } catch (error) {
      throw new Error('getCurrentUser ' + error.message);
    }
  };

  // Method for getting list of all the users resgistered in the api.
  const getAllUsers = async (token) => {
    try {
      const result = await doFetch(baseUrl + 'users', {
        headers: {'x-access-token': token},
      });
      return result;
    } catch (error) {
      throw new Error('getAllUsers' + error.message);
    }
  };

  // Method for adding a new user.
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

  // Method for editing current user
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

  // Method for checking the username if it's available
  const checkUsername = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('Check username ' + error.message);
    }
  };
  return {
    getUserById,
    getCurrentUser,
    getAllUsers,
    putUser,
    checkUsername,
    postUser,
  };
};

// Methods for favourites.
const useFavourite = () => {
  // Method for adding a favourite post for the users.
  const postFavourite = async (fileId, token) => {
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
      const tagResult = await doFetch(baseUrl + 'favourites', options);
      return tagResult;
    } catch (error) {
      throw new Error('postFavourite: ' + error.message);
    }
  };

  // Method for getting all the favourites according to the file ID.
  const getFavouritesByFileId = async (fileId, token) => {
    try {
      return await doFetch(baseUrl + 'favourites/file/' + fileId);
    } catch (error) {
      throw new Error('getFavourtiesByFileId error, ' + error.message);
    }
  };

  // Method for deleting the favourites.
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
    getFavouritesByFileId,
    deleteFavourite,
  };
};

// Method for comments.
const useComment = () => {
  // Method for getting comments according to the file id
  const getCommentsByFileId = async (fileId) => {
    try {
      return await doFetch(baseUrl + 'comments/file/' + fileId);
    } catch (error) {
      throw new Error('get comments error, ' + error.message);
    }
  };

  // Method for getting all the comments of all the files
  const getAllComments = async (token) => {
    try {
      const allComments = await doFetch(baseUrl + 'comments', {
        headers: {'x-access-token': token},
      });
      return allComments;
    } catch (error) {
      throw new Error('get All comments, ' + error.message);
    }
  };

  // Method for adding the comments
  const postComment = async (data, token) => {
    const options = {
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const commentResult = await doFetch(baseUrl + 'comments', options);
      return commentResult;
    } catch (error) {
      throw new Error('post Comment error, ' + error.message);
    }
  };

  // Method for deleting the comment
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

  return {getCommentsByFileId, getAllComments, postComment, deleteComment};
};

export {useMedia, useTag, useUser, useAuthentication, useFavourite, useComment};
