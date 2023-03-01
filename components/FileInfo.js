import {
  Avatar,
  Card,
  Icon,
  Image,
  ListItem as RNEListItem,
  Text,
} from '@rneui/themed';
import {Video} from 'expo-av';
import moment from 'moment';
import {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useFavourite, useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import Like from './Like';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LikedBy from './LikedBy';

// This component prints the file and file owner info in single view.
const FileInfo = ({navigation, file, owner}) => {
  const video = useRef(null);
  const [avatar, setAvatar] = useState('');
  const {getFilesByTag} = useTag();
  const {user, updateLike} = useContext(MainContext);
  const {getFavouritesByFileId} = useFavourite();
  const [lastLike, setLastLike] = useState('');
  const [likes, setLikes] = useState([]);
  const {getUserById} = useUser();

  // Loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + owner.user_id);
      if (avatarArray.length > 0) {
        setAvatar(avatarArray.pop().filename);
      }
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  // Getting the likes of the post
  const getLikes = async () => {
    try {
      const allLikes = await getFavouritesByFileId(file.file_id);
      if (allLikes.length > 0) {
        setLikes(allLikes);
        const token = await AsyncStorage.getItem('userToken');
        const firstLikedUser = await getUserById(allLikes[0].user_id, token);
        setLastLike(firstLikedUser.username);
      } else {
        setLastLike('');
      }
    } catch (error) {
      console.log('getLikes' + error);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  useEffect(() => {
    getLikes();
  }, [updateLike]);

  return (
    <>
      <RNEListItem
        containerStyle={styles.avatar}
        onPress={() => {
          user.user_id === owner.user_id
            ? navigation.navigate('Profile', owner)
            : navigation.navigate('OtherUserProfile', owner);
        }}
      >
        {avatar ? (
          <Avatar source={{uri: uploadsUrl + avatar}} size={40} rounded />
        ) : (
          <Avatar source={require('../assets/avatar.png')} size={40} rounded />
        )}

        <RNEListItem.Content>
          <RNEListItem.Title> {owner.username}</RNEListItem.Title>
        </RNEListItem.Content>
      </RNEListItem>
      <Card.Divider color="#ffff" />
      {file.media_type === 'image' ? (
        <Image
          source={{uri: uploadsUrl + file.thumbnails?.w640}}
          style={styles.image}
        />
      ) : (
        <Video
          ref={video}
          source={{uri: uploadsUrl + file.filename}}
          style={{width: '100%', height: 500}}
          resizeMode="cover"
          useNativeControls
          onError={(error) => {
            console.log(error);
          }}
          isLooping
        />
      )}

      <RNEListItem containerStyle={styles.iconList}>
        <Like file={file} />
        {file.user_id === user.user_id && (
          <Icon
            name="edit"
            onPress={() => {
              navigation.navigate('EditPost', [file, owner]);
            }}
          />
        )}
      </RNEListItem>
      <LikedBy navigation={navigation} likes={likes} lastLike={lastLike} />

      <Card.Divider style={{margin: 0, padding: 0}} />
      <RNEListItem style={{marginTop: 0}}>
        <RNEListItem.Content>
          <RNEListItem.Title style={{fontSize: 20, fontWeight: '500'}}>
            {file.title}
          </RNEListItem.Title>
          <Card.Divider width={1} />
          <RNEListItem.Subtitle>{file.description}</RNEListItem.Subtitle>
          <RNEListItem.Subtitle style={{marginTop: 10}}>
            Added: {moment(file.time_added).fromNow()}
          </RNEListItem.Subtitle>
        </RNEListItem.Content>
      </RNEListItem>
      <Card.Divider />
      <Text style={{fontSize: 25, marginLeft: 12}}>Comments</Text>
    </>
  );
};

FileInfo.propTypes = {
  file: PropTypes.object,
  owner: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  avatar: {
    margin: 0,
    padding: 0,
  },
  post: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '70%',
  },
  iconList: {
    margin: 0,
    paddingTop: 10,
    paddingBottom: 0,
    width: '100%',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default FileInfo;
