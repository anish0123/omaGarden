import {Avatar, Card, Icon, ListItem as RNEListItem} from '@rneui/themed';
import {View, StyleSheet, Image} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {useFavourite, useTag, useUser} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem = ({singleMedia}) => {
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState('');
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const item = singleMedia;
  const [likes, setLikes] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const {getCurrentUser} = useUser();

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerDetails = await getUserById(item.user_id, token);
      setOwner(ownerDetails);
    } catch (error) {
      console.error('getOwner', error);
    }
  };

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
      const token = await AsyncStorage.getItem('userToken');
      const currentUser = await getCurrentUser(token);
      console.log('trying to get current user', currentUser);
      console.log('likes', likes);
      setLikes(likes);
      if (likes.length > 0) {
        const userLike = likes.filter(
          (like) => like.user_id === currentUser.user_id
        );
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
      const result = await postFavourite(singleMedia.file_id, token);
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
      const result = await deleteFavourite(singleMedia.file_id, token);
      getLikes();
      setUserLikesIt(false);
      console.log(result);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('likeFile' + error);
    }
  };

  useEffect(() => {
    getOwner();
    getLikes();
  }, []);

  useEffect(() => {
    loadAvatar();
  }, [owner]);

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
        <Card.Title></Card.Title>

        <Image
          source={{uri: uploadsUrl + item.thumbnails?.w640}}
          style={styles.image}
        />
        <RNEListItem containerStyle={styles.iconList}>
          {userLikesIt ? (
            <Icon name="favorite" color="red" onPress={dislikeFile} />
          ) : (
            <Icon name="favorite-border" onPress={likeFile} />
          )}
          <Icon name="comment" />
          <Icon name="edit" />
        </RNEListItem>

        <RNEListItem containerStyle={styles.iconList}>
          <RNEListItem.Content>
            <RNEListItem.Title>{likes.length} Likes</RNEListItem.Title>
            <RNEListItem.Title>{item.title}</RNEListItem.Title>
            <RNEListItem.Subtitle>{item.description}</RNEListItem.Subtitle>
          </RNEListItem.Content>
        </RNEListItem>
      </Card>
    </View>
  );
};
ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
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
  },
  image: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default ListItem;
