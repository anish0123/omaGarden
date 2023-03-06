import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

// This component is used to handle the list of media files in home view.
const List = ({navigation, myFilesOnly = false}) => {
  // Media Array provides all the posts from the api and is printed in flatlist.
  const {mediaArray} = useMedia(myFilesOnly);
  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
