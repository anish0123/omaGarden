/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Button, Card, Icon, Image, ListItem, Text} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useFavourite, useMedia, useTag, useUser} from '../../hooks/ApiHooks';
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
  const {getFavouritesByFileId} = useFavourite();
  const {setIsLoggedIn, user, setUser, updateLike} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [owner, setOwner] = useState({});
  const [files, setFiles] = useState([]);
  const [likes, totalLikes] = useState(0);
  console.log(userDetail);

  // Loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + userDetail.user_id);
      if (avatarArray.length > 0) {
        setAvatar(avatarArray.pop().filename);
      }
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  const allMediaFiles = async () => {
    let noOfLikes = 0;
    try {
      const mediaFiles = await loadAllMedia(owner.user_id);
      for (let i = 0; i < mediaFiles.length; i++) {
        const likes = await getFavouritesByFileId(mediaFiles[i].file_id);
        noOfLikes += Number(likes.length);
      }
      totalLikes(noOfLikes);
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
  }, [avatar, owner.user_id, updateLike]);

  return (
    <SafeAreaView>
      <Card
        containerStyle={{
          margin: 0,
          padding: 0,
          backgroundColor: '#d6f5d6',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 110,
              height: 40,
              marginBottom: 10,
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
        <Card.Divider width={1} />
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          {avatar ? (
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
          ) : (
            <Card.Image
              source={require('../../assets/avatar.png')}
              style={{
                width: 120,
                height: 120,
                borderRadius: 120 / 2,
                borderWidth: 1,
                borderColor: 'black',
              }}
            />
          )}
          {owner.full_name !== 'null' ? (
            <ListItem.Title style={{padding: 10, fontSize: 20}}>
              {userDetail.username}
            </ListItem.Title>
          ) : (
            <ListItem.Title style={{padding: 10, fontSize: 20}}>
              {userDetail.full_name}
            </ListItem.Title>
          )}
          <ListItem.Title style={{fontSize: 20}}>
            {userDetail.email}
          </ListItem.Title>
          <Card
            containerStyle={{
              width: '100%',
              height: 80,
              backgroundColor: 'white',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <View>
                <Text
                  style={{
                    padding: 0,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                >
                  Posts
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                >
                  {files.length}
                </Text>
              </View>
              <View
                style={{height: '100%', backgroundColor: 'black', width: 1.5}}
              ></View>
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                >
                  Likes
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                >
                  {likes}
                </Text>
              </View>
            </View>
          </Card>
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
      </Card>
      {files.length !== 0 ? (
        <FlatList
          nestedScrollEnabled
          data={files}
          renderItem={({item}) => (
            <View>
              {item.media_type === 'image' ? (
                <Image
                  onPress={() =>
                    navigation.navigate('Single', [item, userDetail])
                  }
                  source={{uri: uploadsUrl + item.filename}}
                  style={{
                    margin: 2,
                    width: Dimensions.get('screen').width / 3,
                    height: Dimensions.get('screen').width / 3,
                  }}
                />
              ) : (
                <Image
                  onPress={() =>
                    navigation.navigate('Single', [item, userDetail])
                  }
                  source={{uri: uploadsUrl + item.screenshot}}
                  style={{
                    margin: 2,
                    width: Dimensions.get('screen').width / 3,
                    height: Dimensions.get('screen').width / 3,
                  }}
                />
              )}
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
