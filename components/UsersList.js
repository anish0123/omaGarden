import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import SingleUser from './SingleUser';

const UsersList = ({navigation, userList}) => {
  return (
    <FlatList
      data={userList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(item) => (
        <SingleUser navigation={navigation} singleUser={item} />
      )}
    />
  );
};

UsersList.propTypes = {
  navigation: PropTypes.object,
  userList: PropTypes.array,
};

export default UsersList;
