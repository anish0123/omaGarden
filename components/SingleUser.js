import {Avatar, Card, ListItem} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';

const SingleUser = ({singleUser, navigation}) => {
  const user = singleUser.item;
  const [avatar, setAvatar] = useState('');
  const {getFilesByTag} = useTag();

  // Loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      setAvatar('');
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      // console.error('load Avatar', error);
    }
  };
  useEffect(() => {
    loadAvatar();
  }, [user]);

  return (
    <Card>
      <ListItem
        containerStyle={styles.avatar}
        onPress={() => navigation.navigate('OtherUserProfile', user)}
      >
        {avatar ? (
          <Avatar source={{uri: uploadsUrl + avatar}} size={40} rounded />
        ) : (
          <Avatar
            source={{uri: 'https://placekitten.com/g/200/300'}}
            size={40}
            rounded
          />
        )}

        <ListItem.Content>
          <ListItem.Title> {user.username}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Card>
  );
};

SingleUser.propTypes = {
  singleUser: PropTypes.object,
};

const styles = StyleSheet.create({
  Card: {
    margin: 0,
    padding: 0,
  },
  avatar: {
    margin: 0,
    padding: 0,
  },
});

SingleUser.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SingleUser;
