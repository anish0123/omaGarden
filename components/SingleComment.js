import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, ListItem} from '@rneui/themed';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useComment, useUser} from '../hooks/ApiHooks';

const SingleComment = ({singleComment}) => {
  const [owner, setOwner] = useState({});
  const {getUserById} = useUser();
  const {user} = useContext(MainContext);
  const {deleteComment} = useComment();
  const {updateComment, setUpdateComment} = useContext(MainContext);

  const getUser = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const user = await getUserById(singleComment.user_id, token);
    setOwner(user);
  };

  const commentDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      Alert.alert(
        'Do you want to delete this comment?',
        'Comment id: ' + singleComment.comment_id,
        [
          {
            text: 'Delete',
            onPress: async () => {
              const result = await deleteComment(
                singleComment.comment_id,
                token
              );
              Alert.alert(result.message);
              setUpdateComment(!updateComment);
            },
          },
          {
            text: 'Cancel',
          },
        ]
      );
    } catch (error) {
      throw new Error('comment Delete, ' + error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <ListItem style={styles.list}>
        <ListItem.Title>{owner.username} :</ListItem.Title>
        <ListItem.Subtitle style={{width: '75%'}}>
          {singleComment.comment}
        </ListItem.Subtitle>
      </ListItem>
      {user.user_id === singleComment.user_id && (
        <Icon
          name="delete"
          onPress={commentDelete}
          containerStyle={styles.icon}
        />
      )}
    </View>
  );
};

SingleComment.propTypes = {
  singleComment: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    flexWrap: 'wrap',
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  list: {
    flex: 2,
  },
});

export default SingleComment;
