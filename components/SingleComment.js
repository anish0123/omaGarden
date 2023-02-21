import {Text} from '@rneui/themed';
import PropTypes from 'prop-types';

const SingleComment = ({singleComment}) => {
  console.log(singleComment);

  return <Text> {singleComment.comment}</Text>;
};

SingleComment.propTypes = {
  singleComment: PropTypes.object,
};

export default SingleComment;
