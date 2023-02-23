import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListItem} from '@rneui/themed';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {useUser} from '../hooks/ApiHooks';

const SingleComment = ({singleComment}) => {
  console.log(singleComment);
  const [user, setUser] = useState({});
  const {getUserById} = useUser();

  const getUser = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const user = await getUserById(singleComment.user_id, token);
    setUser(user);
    console.log(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ListItem>
      <ListItem.Title>{user.username}</ListItem.Title>
      <ListItem.Subtitle>{singleComment.comment}</ListItem.Subtitle>
    </ListItem>
  );
};

SingleComment.propTypes = {
  singleComment: PropTypes.object,
};

export default SingleComment;
