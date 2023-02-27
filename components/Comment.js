import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useComment} from '../hooks/ApiHooks';
import SingleComment from './SingleComment';
import PropTypes from 'prop-types';

const Comment = ({file}) => {
  const [comments, setComments] = useState([]);
  const {updateComment} = useContext(MainContext);
  const {getCommentsByFileId} = useComment();

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
    getComments();
  }, [updateComment]);
  return (
    <>
      {comments.map((comment, index) => (
        <SingleComment key={index} singleComment={comment} />
      ))}
    </>
  );
};

Comment.propTypes = {
  file: PropTypes.object,
};

export default Comment;
