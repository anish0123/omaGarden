import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useUser} from '../hooks/ApiHooks';
import SingleUser from './SingleUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

// This component displays the list of users who have liked the post.

const LikedUsersList = ({navigation, likes}) => {
  console.log('likes in likedUsersList', likes);
  const {getUserById} = useUser();
  const [userArray, setUserArray] = useState([]);
  const ryArray = [];
  const getOwner = async (like) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerDetails = await getUserById(like.user_id, token);
      console.log('newUserArray', ownerDetails);
      ryArray.push(ownerDetails);
    } catch (error) {
      console.error('getOwner', error);
    }
    setUserArray(ryArray);
  };

  // Method for getting the user details who likes the post.
  const addUsersToList = async () => {
    likes.forEach((like) => {
      getOwner(like);
    });
  };

  // useEffect for loading the full list of users who liked the post.
  useEffect(() => {
    addUsersToList();
  }, []);

  return (
    <FlatList
      data={userArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(item) => (
        <SingleUser navigation={navigation} singleUser={item} />
      )}
    />
  );
};

LikedUsersList.propTypes = {
  navigation: PropTypes.object,
  likes: PropTypes.array,
};

export default LikedUsersList;
