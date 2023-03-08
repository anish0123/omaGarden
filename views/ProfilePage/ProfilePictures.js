import PropTypes from 'prop-types';
import {uploadsUrl} from '../../utils/variables';
import {Image} from '@rneui/base';
import {Dimensions, FlatList, View} from 'react-native';
import {useContext} from 'react';
import {MainContext} from '../../contexts/MainContext';

// This view is made up for changing the avatar of the logged in user.
const ProfilePictures = ({navigation, route}) => {
  const {user} = useContext(MainContext);
  console.log(route.params.length);

  return (
    <FlatList
      data={route.params}
      renderItem={({item}) => (
        <View>
          <Image
            onPress={() => {
              console.log(item);
              navigation.navigate('Single', [item, user]);
            }}
            source={{uri: uploadsUrl + item.filename}}
            style={{
              borderWidth: 1,
              borderColor: 'black',
              margin: 1,
              width: Dimensions.get('screen').width / 3,
              height: Dimensions.get('screen').width / 3,
            }}
          />
        </View>
      )}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

ProfilePictures.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default ProfilePictures;
