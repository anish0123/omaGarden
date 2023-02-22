import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Card, Text} from '@rneui/base';
import {uploadsUrl} from '../../utils/variables';
import {Video} from 'expo-av';
import {useRef} from 'react';

const SingleItem = ({route}) => {
  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id : userId,
    media_type : type,
    screenshot,
    thumbnails,
    file_id: fileId,
    filesize,
  } = route.params;

  const video = useRef(null);

  return (
    <View>
      <ScrollView>
        {type === 'image' ? (
          <Card.Image
            style={{
              width: '100%',
              height: 640,
            }}
            source={{uri: uploadsUrl + filename}}
          />
        ) : (
          <Video
            ref={{video}}
            source={{uri: uploadsUrl + filename}}
            style={{width: '100%', height: 200}}
            useNativeControls
            resizeMode="contain"
            isLooping
            usePoster
            posterSource={{uri: uploadsUrl + screenshot}}
          />
        )}

        <Text style={{fontSize: 30}}>{title}</Text>
        <Text style={{fontSize: 30}}>{description}</Text>
      </ScrollView>
    </View>
  );
};
SingleItem.prototype = {
  route: PropTypes.object,
};
export default SingleItem;
