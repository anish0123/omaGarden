import {useEffect, useState} from 'react';
import {useComment} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native';
import SingleComment from './SingleComment';

const CommentList = ({item}) => {
  const file = item;
  const [comments, setComments] = useState({});
  const {getCommentsByFileId} = useComment();

  // Getting comments by fileId from the api.
  const getComments = async () => {
    console.log('getcomments, ' + file.file_id);
    try {
      const comments = await getCommentsByFileId(file.file_id);
      setComments(comments);
    } catch (error) {
      throw new Error('get comments error', error.message);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <FlatList
      data={comments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <SingleComment singleComment={item} />}
    />
  );
};

CommentList.propTypes = {
  item: PropTypes.object,
};

export default CommentList;
