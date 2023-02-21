/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Button, Card, Icon, Image, ListItem, Text} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../../hooks/ApiHooks';
import {uploadsUrl} from '../../utils/variables';
import PropTypes from 'prop-types';
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContext} from '../../contexts/MainContext';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation, myFilesOnly = true, route}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('OmaGarden_' + user.user_id);
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
      const avatarArray = await getFilesByTag('OmaGarden_' + user.user_id);
      navigation.navigate('ProfilePictures', avatarArray);
    } catch (error) {
      console.error('User avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <SafeAreaView style={{paddingTop: Platform.OS === 'android' ? 30 : 0}}>
      <Card
        containerStyle={{
          backgroundColor: '',
          margin: 0,
          marginTop: 10,
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
          <Icon
            name="settings"
            onPress={() => {
              setShowModal(!showModal);
              setSettingClicked(!settingClicked);
            }}
          />
        </View>
        <Card.Divider />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Card.Image
            source={{uri: uploadsUrl + avatar}}
            style={{
              width: 120,
              height: 120,
              borderRadius: 120 / 2,
              borderWidth: 1,
              borderColor: 'black',
            }}
          />

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              left: 70,
            }}
          >
            Posts
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              left: 70,
            }}
          >
            Posts
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 135,
            left: 88,
            elevation: 8,
            backgroundColor: 'white',
            borderColor: 'black',
            borderWidth: 0.5,
            borderRadius: 20,
          }}
        >
          <GestureRecognizer
            onSwipeDown={() => {
              setShowModal(false);
              setEditClicked(false);
              setSettingClicked(false);
              console.log('Model closed Edit ' + editClicked);
            }}
          >
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
                  height: '50%',
                  marginTop: 'auto',
                  backgroundColor: '#3E3C3C',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                }}
                activeOpacity={1}
                onPressOut={() => {
                  setShowModal(false);
                  setEditClicked(false);
                  setSettingClicked(false);
                  console.log('Model closed edit touch ' + editClicked);
                }}
              >
                {editClicked && (
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
                      <Icon
                        name="camera-outline"
                        type="ionicon"
                        color="white"
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          marginLeft: 15,
                        }}
                        onPress={() => {
                          uploadProfile();
                          setEditClicked(false);
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
                      <Icon
                        name="images-outline"
                        type="ionicon"
                        color="white"
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          marginLeft: 15,
                        }}
                        onPress={() => {
                          showPictures();
                          setShowModal(false);
                          setEditClicked(false);
                        }}
                      >
                        Select Existing Pictures
                      </Text>
                    </View>
                  </View>
                )}

                {settingClicked && (
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
                      <Icon name="logout" color="white" />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          marginLeft: 15,
                        }}
                        onPress={() => {
                          setIsLoggedIn(false);
                          try {
                            AsyncStorage.clear();
                          } catch (error) {
                            console.error(
                              'clearing asyncstorage failed ',
                              error
                            );
                          }
                        }}
                      >
                        Logout
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: 15,
                      }}
                    >
                      <Icon name="help" color="white" />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          marginLeft: 15,
                        }}
                        onPress={() => showPictures()}
                      >
                        Help Center
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Modal>
          </GestureRecognizer>
          <Icon
            onPress={() => {
              setShowModal(!showModal);
              setEditClicked(!editClicked);
            }}
            size={22}
            name="camera-outline"
            type="ionicon"
            style={{
              width: 35,
              height: 35,
              justifyContent: 'center',
            }}
          />
        </View>
        <ListItem.Title style={{margin: 10, fontSize: 20}}>
          {user.username}
        </ListItem.Title>
        <ListItem.Title style={{marginLeft: 10, fontSize: 20}}>
          {user.full_name}
        </ListItem.Title>
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
          onPress={() => {
            navigation.navigate('EditProfile', {
              userName: user.username,
              email: user.email,
              fileName: avatar,
            });
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
    </SafeAreaView>
  );
};
Profile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  route: PropTypes.object,
};
export default Profile;
