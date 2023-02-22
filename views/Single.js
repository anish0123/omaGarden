import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Avatar,
  Button,
  Card,
  Icon,
  Input,
  ListItem as RNEListItem,
  Text,
} from '@rneui/themed';
import {View, StyleSheet, Image, ScrollView, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useComment, useFavourite, useTag} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import {uploadsUrl} from '../utils/variables';
import {Controller, useForm} from 'react-hook-form';
import CommentList from '../components/CommentList';

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
  const {postComment} = useComment();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      comment: '',
      file_id: item.file_id,
    },
  });

  // Loading the avatar
  const loadAvatar = async () => {
    try {
      setAvatar('');
      const avatarArray = await getFilesByTag('avatar_' + owner.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  // Getting the likes
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

  // Method for liking a post
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

  // Method for disliking a post
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

  // Method for adding a comment
  const uploadComment = async (data) => {
    console.log('upload Comment', data);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const result = await postComment(data, token);
      Alert.alert('Comment added', 'Commend Id: ' + result.comment_id);
      reset();
    } catch (error) {
      throw new Error('upload comment, ' + error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
    getLikes();
  }, []);

  return (
    <ScrollView>
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
          <View>
            <Text>Comments</Text>
            <CommentList item={item} />
          </View>
        </Card>
        <Card>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'comment is required',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Comment"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="comment"
          />
          <Button title="Add comment" onPress={handleSubmit(uploadComment)} />
        </Card>
      </View>
    </ScrollView>
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
