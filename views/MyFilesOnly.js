import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Image} from '@rneui/base';
import {View} from 'react-native';

const MyFilesOnly = ({singleMedia}) => {
  const item = singleMedia;
  console.log(item);

  return (
    <View>
      <Image
        source={{uri: uploadsUrl + item.filename}}
        style={{width: 100, height: 100, margin: 15}}
      />
    </View>
  );
};

MyFilesOnly.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default MyFilesOnly;
