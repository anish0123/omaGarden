/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Button, Card, Icon, ListItem} from '@rneui/base';
import {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {View} from 'react-native';

const Profile = () => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('');

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_2711');
      console.log('avatarArray ' + avatarArray.pop().title);
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
          marginTop: 25,
          marginLeft: 0,
          marginRight: 0,
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
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
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
        <ListItem.Title style={{margin: 10, fontSize: 20}}>
          UserName
        </ListItem.Title>
        <ListItem.Title style={{margin: 10, fontSize: 20}}>
          Full Name
        </ListItem.Title>
        <Button
          title="Edit Profile"
          buttonStyle={{
            backgroundColor: '#62BD69',
            borderColor: 'black',
            borderRadius: 5,
          }}
          type="outline"
          titleStyle={{color: 'black', fontSize: 20}}
          containerStyle={{
            width: 160,
            marginHorizontal: 90,
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
            marginStart: 10,
          }}
        >
          <Icon name="collections" onPress={() => {}} />
          <Icon name="favorite" onPress={() => {}} />
        </View>
      </Card>
    </>
  );
};
Profile.propTypes = {
  navigation: PropTypes.object,
};
export default Profile;
