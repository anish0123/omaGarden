import {Avatar, Card, Icon, ListItem as RNEListItem} from '@rneui/themed';
import {View, StyleSheet, Image} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {useTag, useUser} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem = ({singleMedia}) => {
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState('');
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const item = singleMedia;

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerDetails = await getUserById(item.user_id, token);
      setOwner(ownerDetails);
    } catch (error) {
      console.error('getOwner', error);
    }
  };

  const loadAvatar = async () => {
    try {
      setAvatar('');
      const avatarArray = await getFilesByTag('OmaGarden_');
      setAvatar(avatarArray[avatarArray.length - 1].filename);
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  useEffect(() => {
    getOwner();
  }, []);

  useEffect(() => {
    loadAvatar();
  }, [owner]);
  return (
    <View styles={styles.main}>
      <Card styles={styles.post}>
        <RNEListItem containerStyle={styles.avatar}>
          {avatar ? (
            <Avatar source={{uri: uploadsUrl + avatar}} size={40} rounded />
          ) : (
            <Avatar
              source={{uri: 'https://placekitten.com/g/200/300'}}
              size={40}
              rounded
            />
          )}

          <RNEListItem.Content>
            <RNEListItem.Title> {owner.username}</RNEListItem.Title>
          </RNEListItem.Content>
        </RNEListItem>
        <Card.Title></Card.Title>

        <Image
          source={{uri: uploadsUrl + item.thumbnails?.w640}}
          style={styles.image}
        />
        <RNEListItem containerStyle={styles.iconList}>
          <Icon name="favorite-border" />
          <Icon name="comment" />
          <Icon name="edit" />
        </RNEListItem>

        <RNEListItem>
          <RNEListItem.Content>
            <RNEListItem.Title>{item.title}</RNEListItem.Title>
            <RNEListItem.Subtitle>{item.description}</RNEListItem.Subtitle>
          </RNEListItem.Content>
        </RNEListItem>
      </Card>
    </View>
  );
};
ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  avatar: {
    margin: 0,
    padding: 0,
  },
  post: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '70%',
  },
  iconList: {
    margin: 0,
    paddingTop: 10,
    paddingBottom: 0,
  },
  image: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default ListItem;
