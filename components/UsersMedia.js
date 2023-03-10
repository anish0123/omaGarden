import {Image} from '@rneui/base';
import {Text} from '@rneui/themed';
import {FlashList} from '@shopify/flash-list';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {Dimensions, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';

// This component returns list of all the post/ media that a user has uploaded in flatlist.
const UsersMedia = ({navigation, mediaFile, owner}) => {
  const {user} = useContext(MainContext);
  const number = mediaFile.length;

  const Images = () => {
    return (
      <>
        {number !== 0 ? (
          <FlashList
            data={mediaFile}
            renderItem={({item}) => (
              <View>
                {item.media_type === 'image' ? (
                  <Image
                    onPress={() => navigation.navigate('Single', [item, owner])}
                    source={{uri: uploadsUrl + item.filename}}
                    style={{
                      margin: 2,
                      width: Dimensions.get('screen').width / 3 - 3,
                      height: Dimensions.get('screen').width / 3 - 3,
                    }}
                  />
                ) : (
                  <Image
                    onPress={() => navigation.navigate('Single', [item, owner])}
                    source={{uri: uploadsUrl + item.screenshot}}
                    style={{
                      margin: 2,
                      width: Dimensions.get('screen').width / 3 - 3,
                      height: Dimensions.get('screen').width / 3 - 3,
                    }}
                  />
                )}
              </View>
            )}
            estimatedItemSize={200}
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
      </>
    );
  };

  return (
    <>
      {user.user_id === owner.user_id ? (
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height - 570,
          }}
        >
          <Images />
        </View>
      ) : (
        <View
          style={{
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height - 570,
          }}
        >
          <Images />
        </View>
      )}
    </>
  );
};
UsersMedia.propTypes = {
  mediaFile: PropTypes.array,
  owner: PropTypes.object,
  navigation: PropTypes.object,
};

export default UsersMedia;
