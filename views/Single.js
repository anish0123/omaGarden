import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar, Card, Icon, ListItem as RNEListItem} from '@rneui/themed';
import {View, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useFavourite, useTag} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import {uploadsUrl} from '../utils/variables';

const Single = ({route}) => {
  const item = route.params[0];
  const owner = route.params[1];
  const video = useRef(null);
  const [avatar, setAvatar] = useState('');
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getFilesByTag} = useTag();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const {user} = useContext(MainContext);

  const loadAvatar = async () => {
    try {
      setAvatar('');
      const avatarArray = await getFilesByTag('avatar_' + owner.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  const getLikes = async () => {
    try {
      setUserLikesIt(false);
      const likes = await getFavouritesByFileId(item.file_id);
      console.log('likes', likes);
      setLikes(likes);
      if (likes.length > 0) {
        const userLike = likes.filter((like) => like.user_id === user.user_id);
        if (userLike) {
          setUserLikesIt(true);
        }
      }
    } catch (error) {
      console.log('getLikes' + error);
    }
  };

  const likeFile = async () => {
    try {
      console.log('likeFile', item.file_id);
      const token = await AsyncStorage.getItem('userToken');
      const result = await postFavourite(item.file_id, token);
      getLikes();
      setUserLikesIt(true);
      console.log(result);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile', error);
    }
  };

  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await deleteFavourite(item.file_id, token);
      getLikes();
      setUserLikesIt(false);
      console.log(result);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile' + error);
    }
  };

  useEffect(() => {
    loadAvatar();
    getLikes();
  }, []);

  return (
    <View styles={styles.main}>
      <Card styles={styles.post}>
        <RNEListItem containerStyle={styles.avatar}>
          {avatar ? (
            <Avatar source={{uri: uploadsUrl + avatar}} size={40} rounded />
          ) : (
            <Avatar
              source={{uri: 'https://placekitten.com/g/200/300'}}
              size={40}
              rounded
            />
          )}

          <RNEListItem.Content>
            <RNEListItem.Title> {owner.username}</RNEListItem.Title>
          </RNEListItem.Content>
        </RNEListItem>
        <Card.Divider color="#ffff" />
        {item.media_type === 'image' ? (
          <Image
            source={{uri: uploadsUrl + item.thumbnails?.w640}}
            style={styles.image}
          />
        ) : (
          <Video
            ref={video}
            source={{uri: uploadsUrl + item.filename}}
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
          {userLikesIt ? (
            <Icon name="favorite" color="red" onPress={dislikeFile} />
          ) : (
            <Icon name="favorite-border" onPress={likeFile} />
          )}
          {item.user_id === user.user_id && <Icon name="edit" />}
        </RNEListItem>

        <RNEListItem>
          <RNEListItem.Content>
            <RNEListItem.Title>{likes.length} Likes</RNEListItem.Title>
            <RNEListItem.Title>{item.title}</RNEListItem.Title>
            <RNEListItem.Subtitle>{item.description}</RNEListItem.Subtitle>
            <RNEListItem.Subtitle>
              Added At: {new Date(item.time_added).toLocaleString('fi-FI')}
            </RNEListItem.Subtitle>
          </RNEListItem.Content>
        </RNEListItem>
      </Card>
    </View>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
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

export default Single;
