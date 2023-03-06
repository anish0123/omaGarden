import {Avatar, Card, ListItem} from '@rneui/themed';
import {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {LinearGradient} from 'expo-linear-gradient';

// This component is used to display user details in flatlist in search page.
const SingleUser = ({singleUser, navigation}) => {
  const clickedUser = singleUser.item;
  const [avatar, setAvatar] = useState('');
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);

  // Loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + clickedUser.user_id);
      if (avatarArray.length > 0) {
        setAvatar(avatarArray.pop().filename);
      }
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, [clickedUser]);

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={['#FFEEEE', '#DDEFBB']}
    >
      <Card containerStyle={styles.Card}>
        <>
          <ListItem
            containerStyle={styles.avatar}
            onPress={() => {
              clickedUser.user_id !== user.user_id
                ? navigation.navigate('OtherUserProfile', clickedUser)
                : navigation.navigate('Profile', clickedUser);
            }}
          >
            {avatar ? (
              <Avatar source={{uri: uploadsUrl + avatar}} size={60} rounded />
            ) : (
              <Avatar
                source={require('../assets/avatar.png')}
                size={60}
                rounded
              />
            )}

            <ListItem.Content>
              <ListItem.Title style={{fontSize: 20, fontWeight: '600'}}>
                {clickedUser.username}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </>
      </Card>
    </LinearGradient>
  );
};

SingleUser.propTypes = {
  singleUser: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  Card: {
    borderColor: '#A6EFFD',
    borderRadius: 20,
  },
  avatar: {
    margin: 0,
    padding: 0,
  },
});

export default SingleUser;
