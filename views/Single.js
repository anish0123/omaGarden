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
import {
  View,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useComment, useFavourite, useTag} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import {uploadsUrl} from '../utils/variables';
import {Controller, useForm} from 'react-hook-form';
import SingleComment from '../components/SingleComment';
import moment from 'moment';

const Single = ({route, navigation}) => {
  const file = route.params[0];
  const owner = route.params[1];
  const video = useRef(null);
  const [avatar, setAvatar] = useState('');
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const {getFilesByTag} = useTag();
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const {user, setUpdateComment, updateComment} = useContext(MainContext);
  const {getCommentsByFileId} = useComment();
  const {postComment} = useComment();
  const {updateLike, setUpdateLike} = useContext(MainContext);
  console.log(userLikesIt);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      comment: '',
      file_id: file.file_id,
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

  // Method for liking a post
  const likeFile = async () => {
    try {
      console.log('likeFile', file.file_id);
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

  // Method for disliking a post
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

  // Method for adding a comment
  const uploadComment = async (data) => {
    console.log('upload Comment', data);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const result = await postComment(data, token);
      Alert.alert('Comment added', 'Commend Id: ' + result.comment_id);
      reset();
      setUpdateComment(!updateComment);
    } catch (error) {
      throw new Error('upload comment, ' + error.message);
    }
  };

  // Method for getting comments
  const getComments = async () => {
    try {
      const comments = await getCommentsByFileId(file.file_id);
      /* const token = await AsyncStorage.getItem('userToken');
      let comments = await getAllComments(token);
      comments = comments.filter((comment) => comment.file_id === file.file_id); */
      setComments(comments);
    } catch (error) {
      throw new Error('get comments error', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  useEffect(() => {
    getComments();
  }, [updateComment]);

  useEffect(() => {
    getLikes();
  }, [updateLike]);

  const TopPart = () => {
    return (
      <>
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
          {userLikesIt ? (
            <Icon name="favorite" color="red" onPress={dislikeFile} />
          ) : (
            <Icon name="favorite-border" onPress={likeFile} />
          )}
          {file.user_id === user.user_id && (
            <Icon
              name="edit"
              onPress={() => {
                navigation.navigate('EditPost', [file, owner]);
              }}
            />
          )}
        </RNEListItem>

        <RNEListItem>
          <RNEListItem.Content>
            <RNEListItem.Title>{likes.length} Likes</RNEListItem.Title>
            <RNEListItem.Title>{file.title}</RNEListItem.Title>
            <RNEListItem.Subtitle>{file.description}</RNEListItem.Subtitle>
            <RNEListItem.Subtitle>
              Added: {moment(file.time_added).fromNow()}
            </RNEListItem.Subtitle>
          </RNEListItem.Content>
        </RNEListItem>
        <Card.Divider />
        <Text style={{fontSize: 25}}>Comments</Text>
      </>
    );
  };

  const BottomPart = () => (
    <>
      <Card.Divider />
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
            placeholder="Add Comment"
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
    </>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View styles={styles.main}>
          <Card styles={styles.post}>
            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => <SingleComment singleComment={item} />}
              ListHeaderComponent={TopPart}
              ListFooterComponent={BottomPart}
            />
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
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

export default Single;
