import {Avatar, Card, Icon, ListItem as RNEListItem, Text} from '@rneui/themed';
import {
  View,
  StyleSheet,
  Image,
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
import SingleComment from '../components/SingleComment';
import moment from 'moment';
import AddComment from '../components/AddComment';
import Like from '../components/Like';

const Single = ({route, navigation}) => {
  const file = route.params[0];
  const owner = route.params[1];
  const video = useRef(null);
  const [avatar, setAvatar] = useState('');
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const {getFilesByTag} = useTag();
  const {getFavouritesByFileId} = useFavourite();
  const {user, updateComment} = useContext(MainContext);
  const {getCommentsByFileId} = useComment();
  const {updateLike} = useContext(MainContext);

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
      const likes = await getFavouritesByFileId(file.file_id);
      setLikes(likes);
    } catch (error) {
      console.log('getLikes' + error);
    }
  };

  // Method for getting comments
  const getComments = async () => {
    try {
      const comments = await getCommentsByFileId(file.file_id);
      console.log(comments);
      setComments(comments);
    } catch (error) {
      throw new Error('get comments error', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
    getComments();
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

  const BottomPart = () => <AddComment file={file} />;

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
