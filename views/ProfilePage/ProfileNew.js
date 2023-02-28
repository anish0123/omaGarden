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

const ProfileNew = ({navigation, myFilesOnly = true}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  console.log(mediaArray);

  // Loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  const uploadProfile = async () => {
    navigation.navigate('ProfilePictureUpload');
  };

  const showPictures = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      navigation.navigate('ProfilePictures', avatarArray);
    } catch (error) {
      console.error('User avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, [update]);

  return (
    <SafeAreaView style={{paddingTop: Platform.OS === 'android' ? 30 : 0}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginStart: 10,
          marginEnd: 15,
        }}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 110,
            height: 40,
            marginBottom: 20,
            marginTop: 30,
            justifyContent: 'center',
          }}
        ></Image>
        <Icon
          name="settings"
          onPress={() => {
            setShowModal(!showModal);
            setSettingClicked(!settingClicked);
          }}
        />
      </View>
      <Card
        containerStyle={{
          margin: 0,
          padding: 0,
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {avatar != '' ? (
            <Card.Image
              source={{uri: uploadsUrl + avatar}}
              style={{
                width: 120,
                height: 120,
                margin: 15,
                borderRadius: 120 / 2,
                borderWidth: 1,
                borderColor: 'black',
              }}
            />
          ) : (
            <Card.Image
              source={require('../../assets/avatar.png')}
              style={{
                width: 120,
                height: 120,
                margin: 15,
                borderRadius: 120 / 2,
                borderWidth: 1,
                borderColor: 'black',
              }}
            />
          )}

          <View>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20,
                marginHorizontal: Dimensions.get('screen').width / 2 - 135,
              }}
            >
              Posts
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                marginHorizontal: Dimensions.get('screen').width / 2 - 135,
              }}
            >
              {mediaArray.length}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 88,
            left: 106,
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
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: 15,
                      }}
                    >
                      <Icon name="person" type="ionicon" color="white" />
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
                        View profile Picture
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
                          setShowModal(false);
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
        {user.full_name !== 'null' ? (
          <ListItem.Title style={{padding: 10, fontSize: 20, marginLeft: 10}}>
            {user.username}
          </ListItem.Title>
        ) : (
          <ListItem.Title style={{padding: 10, fontSize: 20, marginLeft: 10}}>
            {user.full_name}
          </ListItem.Title>
        )}
        <Button
          title="Edit Profile"
          buttonStyle={{
            backgroundColor: '#62BD69',
            borderColor: 'black',
            borderRadius: 20,
            margin: 5,
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
              onPress={() => navigation.navigate('Single', [item, user])}
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
};
export default ProfileN;
