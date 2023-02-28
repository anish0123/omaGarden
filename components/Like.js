import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useFavourite} from '../hooks/ApiHooks';

// This component is used to like or dislike a file through home and single view.
const Like = ({file}) => {
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const {user, updateLike, setUpdateLike} = useContext(MainContext);
  const [likes, setLikes] = useState([]);

  // Getting the likes of the post
  const getLikes = async () => {
    try {
      setUserLikesIt(false);
      const likes = await getFavouritesByFileId(file.file_id);
      console.log(userLikesIt);
      console.log('likes', likes);
      setLikes(likes);
      if (likes.length > 0) {
        console.log('Is it working till here');
        const userLike = likes.filter((like) => like.user_id === user.user_id);
        if (userLike.length !== 0) {
          setUserLikesIt(true);
        }
      }
    } catch (error) {
      console.log('getLikes' + error);
    }
  };

  // Method for liking the post by the logged in user
  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postFavourite(file.file_id, token);
      getLikes();
      setUserLikesIt(true);
      console.log(result);
      setUpdateLike(!updateLike);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile', error);
    }
  };

  // // Method for disliking the post by the logged in user
  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await deleteFavourite(file.file_id, token);
      getLikes();
      setUserLikesIt(false);
      console.log(result);
      setUpdateLike(!updateLike);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile' + error);
    }
  };
  useEffect(() => {
    getLikes();
  }, [updateLike]);
  return (
    <>
      {userLikesIt ? (
        <Icon name="favorite" color="red" onPress={dislikeFile} />
      ) : (
        <Icon name="favorite-border" onPress={likeFile} />
      )}
      <Text
        style={{
          fontSize: '20',
          marginLeft: 10,
        }}
      >
        {likes.length}
      </Text>
    </>
  );
};

Like.propTypes = {
  file: PropTypes.object,
};

export default Like;
