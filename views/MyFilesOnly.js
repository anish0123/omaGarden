import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Image} from '@rneui/base';
import {Dimensions, View} from 'react-native';

const MyFilesOnly = ({singleMedia}) => {
  const item = singleMedia;

  return (
    <View>
      <Image
        source={{uri: uploadsUrl + item.filename}}
        style={{
          borderWidth: 1,
          borderColor: 'green',
          margin: 1,
          width: Dimensions.get('screen').width / 3,
          height: Dimensions.get('screen').width / 3,
        }}
      />
    </View>
  );
};

MyFilesOnly.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default MyFilesOnly;
