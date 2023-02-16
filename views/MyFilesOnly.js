import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Image} from '@rneui/base';
import {Dimensions, FlatList, View} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';

const MyFilesOnly = ({myFilesOnly = true, route}) => {
  const {mediaArray} = useMedia(myFilesOnly);

  return (
    <FlatList
      data={mediaArray}
      renderItem={({item}) => (
        <View>
          <Image
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

MyFilesOnly.propTypes = {
  singleMedia: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  route: PropTypes.object,
};

export default MyFilesOnly;
