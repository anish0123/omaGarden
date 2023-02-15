/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Button, Card, Icon, ListItem} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import MyFilesOnly from './MyFilesOnly';

const Profile = ({myFilesOnly = true}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('User avatar fetch failed', error.message);
    }
  };
  useEffect(() => {
    loadAvatar();
  }, []);
  return (
    <>
      <Card
        containerStyle={{
          backgroundColor: '',
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginStart: 10,
          }}
        >
          <Card.Title style={{fontSize: 22, color: 'darkgreen'}}>
            OmaGarden
          </Card.Title>
          <Icon name="settings" />
        </View>
        <Card.Divider />
        <Card.Image
          source={{uri: uploadsUrl + avatar}}
          style={{
            width: 120,
            height: 120,
            borderRadius: 120 / 2,
            borderWidth: 2,
            borderColor: 'green',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 85,
            left: 100,
            elevation: 8,
            backgroundColor: 'white',
            borderRadius: 20,
          }}
        >
          <Icon
            onPress={() => {}}
            size={30}
            name="edit"
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
            }}
          />
        </View>
        <ListItem.Title style={{margin: 10}}>{user.username}</ListItem.Title>
        <ListItem.Title style={{margin: 10}}>{user.full_name}</ListItem.Title>
        <Button
          title="Edit Profile"
          buttonStyle={{
            backgroundColor: '#62BD69',
            borderColor: 'black',
            borderRadius: 5,
          }}
          type="outline"
          titleStyle={{color: 'black'}}
          containerStyle={{
            width: 120,
            marginHorizontal: Dimensions.get('screen').width / 2 - 60,
          }}
        />
      </Card>
      <Card
        containerStyle={{
          backgroundColor: '#62BD69',
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Icon name="collections" onPress={() => {}} />
          <Icon name="favorite" onPress={() => {}} />
        </View>
      </Card>
      <FlatList
        data={mediaArray}
        renderItem={({item}) => (
          <MyFilesOnly singleMedia={item} myFilesOnly={true} />
        )}
        numColumns={3}
      />
    </>
  );
};
Profile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};
export default Profile;
