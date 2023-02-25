/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Button, Card, Icon, Image, ListItem, Text} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag, useUser} from '../../hooks/ApiHooks';
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

const OtherUserProfile = ({navigation, route}) => {
  const userDetail = route.params;
  const {loadAllMedia} = useMedia();
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [owner, setOwner] = useState({});
  const [files, setFiles] = useState([]);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + userDetail.user_id);
      setAvatar(avatarArray[avatarArray.length - 1].filename);
    } catch (error) {
      console.error('User avatar fetch failed ', error.message);
    }
  };

  const allMediaFiles = async () => {
    /* try {
      const mediaFiles = {mediaArray};
      setFiles(mediaFiles);
      console.log('Length of all media files ' + files.length);
    } catch (error) {
      console.error('All media files fetching failed ', error.message);
    }
    */
    try {
      const mediaFiles = await loadAllMedia(owner.user_id);
      console.log(mediaFiles);
      setFiles(mediaFiles);
      console.log('Length of all media files ' + files.length);
    } catch (error) {
      console.error('All media files fetching failed ', error.message);
    }
  };

  // Method for getting the owner of the specific post or file.
  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerDetails = await getUserById(userDetail.user_id, token);
      setOwner(ownerDetails);
    } catch (error) {
      // console.error('getOwner', error);
    }
  };

  useEffect(() => {
    getOwner();
    loadAvatar();
    allMediaFiles();
  }, [avatar, owner.user_id]);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginEnd: 10,
          marginStart: 15,
        }}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 110,
            height: 40,
            marginTop: 15,
            marginBottom: 15,
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
          paddingTop: Platform.OS === 'android' ? 30 : 0,
        }}
      >
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
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20,
                marginHorizontal: Dimensions.get('screen').width / 3,
              }}
            >
              Posts
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                marginHorizontal: Dimensions.get('screen').width / 3,
              }}
            >
              {files.length}
            </Text>
          </View>
        </View>
        <GestureRecognizer
          onSwipeDown={() => {
            setShowModal(false);
            setSettingClicked(false);
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
                setSettingClicked(false);
              }}
            >
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
                        setShowModal(false);
                        setIsLoggedIn(false);
                        try {
                          AsyncStorage.clear();
                        } catch (error) {
                          console.error('clearing asyncstorage failed ', error);
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
                    >
                      Help Center
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Modal>
        </GestureRecognizer>
        {owner.full_name === 'null' ? (
          <ListItem.Title style={{margin: 10, fontSize: 20}}>
            {userDetail.username}
          </ListItem.Title>
        ) : (
          <View>
            <ListItem.Title style={{margin: 10, fontSize: 20}}>
              {userDetail.username}
            </ListItem.Title>
            <ListItem.Title style={{margin: 10, fontSize: 20}}>
              {owner.full_name}
            </ListItem.Title>
          </View>
        )}
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
      {files.length !== 0 ? (
        <FlatList
          data={files}
          renderItem={({item}) => (
            <View>
              <Image
                onPress={() =>
                  navigation.navigate('Single', [item, userDetail])
                }
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
      ) : (
        <Text
          style={{
            fontSize: 25,
            textAlignVertical: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            marginVertical: 110,
          }}
        >
          No posts yet
        </Text>
      )}
    </SafeAreaView>
  );
};

OtherUserProfile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  route: PropTypes.object,
};
export default OtherUserProfile;
