import {Avatar, Card, Icon, ListItem as RNEListItem, Text} from '@rneui/themed';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {useComment, useFavourite, useTag, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Video} from 'expo-av';
import {MainContext} from '../contexts/MainContext';
import Like from './Like';
import LikedBy from './LikedBy';

// ListItem is used to display all the files that have been posted in home view.
const ListItem = ({singleMedia, navigation}) => {
  const video = useRef(null);
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState('');
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const item = singleMedia;
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [lastLike, setLastLike] = useState('');
  const {user, updateComment, updateLike} = useContext(MainContext);
  const {getCommentsByFileId} = useComment();
  const {getFavouritesByFileId} = useFavourite();

  // Method for getting the owner of the specific post or file.
  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerDetails = await getUserById(item.user_id, token);
      setOwner(ownerDetails);
    } catch (error) {
      console.error('getOwner', error);
    }
  };

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

  // Method for getting comments
  const getComments = async () => {
    try {
      const comments = await getCommentsByFileId(item.file_id);
      setComments(comments);
    } catch (error) {
      throw new Error('get comments error', error.message);
    }
  };

  // Getting the likes of the post
  const getLikes = async () => {
    try {
      const allLikes = await getFavouritesByFileId(item.file_id);

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
    getOwner();
  }, [item]);

  useEffect(() => {
    loadAvatar();
  }, [owner]);

  useEffect(() => {
    getComments();
  }, [updateComment]);

  useEffect(() => {
    getLikes();
  }, [updateLike]);

  return (
    <View styles={styles.main}>
      <Card styles={styles.post}>
        <RNEListItem
          containerStyle={styles.avatar}
          onPress={() => {
            owner.user_id !== user.user_id
              ? navigation.navigate('OtherUserProfile', owner)
              : navigation.navigate('Profile', owner);
          }}
        >
          {avatar ? (
            <Avatar source={{uri: uploadsUrl + avatar}} size={40} rounded />
          ) : (
            <Avatar
              source={require('../assets/avatar.png')}
              size={40}
              rounded
            />
          )}

          <RNEListItem.Content>
            <RNEListItem.Title
              onPress={() => {
                user.user_id === owner.user_id
                  ? navigation.navigate('Profile', owner)
                  : navigation.navigate('OtherUserProfile', owner);
              }}
            >
              {' '}
              {owner.username}
            </RNEListItem.Title>
          </RNEListItem.Content>
        </RNEListItem>
        <Card.Divider color="#ffff" />
        {item.media_type === 'image' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Single', [item, owner]);
            }}
          >
            <Image
              source={{uri: uploadsUrl + item.thumbnails?.w640}}
              style={styles.image}
            />
          </TouchableOpacity>
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
          <Like file={item} />
          <Icon
            name="comment"
            onPress={() => {
              navigation.navigate('Single', [item, owner]);
            }}
            style={{marginTop: 0}}
          />
          <Text
            style={{
              fontSize: 20,
            }}
          >
            {comments.length}
          </Text>

          {item.user_id === user.user_id && (
            <Icon
              name="edit"
              onPress={() => {
                navigation.navigate('EditPost', [item, owner]);
              }}
            />
          )}
        </RNEListItem>
        <LikedBy navigation={navigation} likes={likes} lastLike={lastLike} />

        <Card.Divider style={{marginBottom: 0}} />
        <RNEListItem>
          <RNEListItem.Content>
            <RNEListItem.Title style={{fontSize: 20, fontWeight: '500'}}>
              {item.title}
            </RNEListItem.Title>
            <Card.Divider width={1} />
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
    backgroundColor: '#000000',
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
    paddingTop: 10,
    paddingBottom: 0,
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default ListItem;
