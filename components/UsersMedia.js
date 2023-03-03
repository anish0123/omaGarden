import {Image} from '@rneui/base';
import {Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, View} from 'react-native';
import {uploadsUrl} from '../utils/variables';

const UsersMedia = ({navigation, mediaFile, owner}) => {
  const number = mediaFile.length;

  return (
    <View>
      {number !== 0 ? (
        <FlatList
          data={mediaFile}
          renderItem={({item}) => (
            <View>
              {item.media_type === 'image' ? (
                <Image
                  onPress={() => navigation.navigate('Single', [item, owner])}
                  source={{uri: uploadsUrl + item.filename}}
                  style={{
                    margin: 2,
                    width: Dimensions.get('screen').width / 3,
                    height: Dimensions.get('screen').width / 3,
                  }}
                />
              ) : (
                <Image
                  onPress={() => navigation.navigate('Single', [item, owner])}
                  source={{uri: uploadsUrl + item.screenshot}}
                  style={{
                    margin: 2,
                    width: Dimensions.get('screen').width / 3,
                    height: Dimensions.get('screen').width / 3,
                  }}
                />
              )}
            </View>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text
          style={{
            fontSize: 25,
            textAlignVertical: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            marginVertical: 110,
          }}
        >
          No posts yet
        </Text>
      )}
    </View>
  );
};
UsersMedia.propTypes = {
  mediaFile: PropTypes.array,
  owner: PropTypes.object,
  navigation: PropTypes.object,
};

export default UsersMedia;
