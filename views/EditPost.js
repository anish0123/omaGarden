import EditPostForm from '../components/EditPostForm';
import PropTypes from 'prop-types';

// This view is created for user change the details for the post/media that user has uploaded.
const EditPost = ({route, navigation}) => {
  return (
    <EditPostForm
      item={route.params[0]}
      navigation={navigation}
      owner={route.params[1]}
    />
  );
};

EditPost.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default EditPost;
