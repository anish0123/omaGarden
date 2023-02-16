/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Icon,
  Image,
  ListItem,
  renderNode,
  Text,
} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import MyFilesOnly from './MyFilesOnly';
import GestureRecognizer from 'react-native-swipe-gestures';

const Profile = ({navigation, myFilesOnly = true}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [mediaFile, setMediaFile] = useState({});
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('OmaGarden_');
      setAvatar(avatarArray[avatarArray.length - 1].filename);
    } catch (error) {
      console.error('User avatar fetch failed', error.message);
    }
  };

  const uploadProfile = async () => {
    navigation.navigate('ProfilePictureUpload');
  };

  const showPictures = async () => {
    try {
      const avatarArray = await getFilesByTag('OmaGarden_');
      navigation.navigate('MyFilesOnly', avatarArray);
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
          <GestureRecognizer onSwipeDown={() => setShowModal(false)}>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={showModal}
              onRequestClose={() => {
                console.log('Modal has been closed.');
              }}
            >
              <TouchableOpacity
                style={{
                  height: '46%',
                  marginTop: 'auto',
                  backgroundColor: '#3E3C3C',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                }}
                activeOpacity={1}
                onPressOut={() => {
                  setShowModal(false);
                }}
              >
                <View>
                  <View
                    style={{
                      width: Dimensions.get('screen').width / 3,
                      marginHorizontal: Dimensions.get('screen').width / 3,
                      borderWidth: 2,
                      borderColor: 'white',
                    }}
                  ></View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      padding: 15,
                      marginTop: 15,
                    }}
                  >
                    <Icon name="camera-outline" type="ionicon" color="white" />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        marginLeft: 15,
                      }}
                      onPress={() => {
                        uploadProfile();
                        setShowModal(false);
                      }}
                    >
                      Add Profile Picture
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      padding: 15,
                    }}
                  >
                    <Icon name="images-outline" type="ionicon" color="white" />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        marginLeft: 15,
                      }}
                      onPress={() => showPictures()}
                    >
                      Select Existing Pictures
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </GestureRecognizer>
          <Icon
            onPress={() => {
              setShowModal(!showModal);
            }}
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
            width: Dimensions.get('screen').width / 3,
            marginHorizontal: Dimensions.get('screen').width / 3,
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
    </>
  );
};
Profile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};
export default Profile;
