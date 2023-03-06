import LikedUsersList from '../components/LikedUsersList';
import PropTypes from 'prop-types';

// This view displays the list of the users who have liked post/media
const UsersWhoLiked = ({navigation, route}) => {
  const likes = route.params;
  console.log('likes in UsersWhoLiked', route.params);
  return <LikedUsersList navigation={navigation} likes={likes} />;
};

UsersWhoLiked.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default UsersWhoLiked;
