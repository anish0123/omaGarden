import EditPostForm from '../components/EditPostForm';
import PropTypes from 'prop-types';

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
