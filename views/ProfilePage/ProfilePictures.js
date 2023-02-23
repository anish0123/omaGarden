import PropTypes from 'prop-types';
import {uploadsUrl} from '../../utils/variables';
import {Image} from '@rneui/base';
import {Alert, Dimensions, FlatList, View} from 'react-native';
import {useTag} from '../../hooks/ApiHooks';
import {useContext} from 'react';
import {MainContext} from '../../contexts/MainContext';

const ProfilePictures = ({navigation, route}) => {
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  console.log(route.params.length);
  const setProfilePicture = async (tagId) => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      console.log('setProfilePicture', avatarArray);

      for (let index = 0; index < avatarArray.length; index++) {
        if (avatarArray[index].tag_id === tagId) {
          console.log(
            'File ID ' + avatarArray[index].file_id + ' Tag ID ' + tagId
          );
          Alert.alert(
            'Alert',
            'Do you want to set this as your Profile Picture ?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  navigation.navigate('Profile', tagId);
                },
              },
            ]
          );
        }
      }
      console.log(avatarArray);
    } catch (error) {
      console.error('User avatar fetch failed', error.message);
    }
  };

  return (
    <FlatList
      data={route.params}
      renderItem={({item}) => (
        <View>
          <Image
            onPress={() => setProfilePicture(item.tag_id)}
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
