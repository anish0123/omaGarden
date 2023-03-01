import {Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
const LikedBy = ({navigation, likes, lastLike}) => {
  if (likes.length === 0) {
    return (
      <Text
        style={{marginTop: 10, marginLeft: 10, fontSize: 15, marginBottom: 10}}
      >
        No Likes Yet!
      </Text>
    );
  } else {
    return (
      <TouchableOpacity
        style={{marginTop: 10, marginLeft: 10, marginBottom: 10}}
        onPress={() => {
          navigation.navigate('UserWhoLiked', likes);
        }}
      >
        {likes.length > 1 ? (
          <Text style={{fontSize: 15}}>
            Liked By: {lastLike} and {likes.length - 1} others
          </Text>
        ) : (
          <Text style={{fontSize: 15}}>Liked By: {lastLike}</Text>
        )}
      </TouchableOpacity>
    );
  }
};

LikedBy.propTypes = {
  likes: PropTypes.array,
  navigation: PropTypes.object,
  lastLike: PropTypes.string,
};

export default LikedBy;
