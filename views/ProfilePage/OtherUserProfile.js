/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Card, Icon, Image, ListItem, Text} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useFavourite, useMedia, useTag, useUser} from '../../hooks/ApiHooks';
import {uploadsUrl} from '../../utils/variables';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContext} from '../../contexts/MainContext';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import UsersMedia from '../../components/UsersMedia';
import {ScrollView} from 'react-native-gesture-handler';

// This view displays the details of other users that has been clicked.
const OtherUserProfile = ({navigation, route}) => {
  const userDetail = route.params;
  const {loadAllMedia} = useMedia();
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {getFavouritesByFileId} = useFavourite();
  const {setIsLoggedIn, updateLike} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [owner, setOwner] = useState({});
  const [files, setFiles] = useState([]);
  const [likes, totalLikes] = useState(0);
  const [likeClicked, setLikeClicked] = useState(false);

  // Method for loading the avatar of the owner of the post
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

  // Method for loading all the medias/posts that have been uploaded by the clicked user.
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

  // Method for logging out the logged in user.
  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('clearing asyncstorage failed ', error);
    }
  };

  useEffect(() => {
    getOwner();
    loadAvatar();
    allMediaFiles();
  }, [avatar, owner.user_id, updateLike]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Card
          containerStyle={{
            margin: 0,
            padding: 0,
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
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#FFEEEE', '#DDEFBB']}
          >
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
                    style={{
                      height: '100%',
                      backgroundColor: 'black',
                      width: 1.5,
                    }}
                  ></View>
                  <TouchableOpacity
                    onPress={() => {
                      setLikeClicked(true);
                      setShowModal(true);
                    }}
                  >
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
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </LinearGradient>
          <GestureRecognizer
            onSwipeDown={() => {
              setShowModal(false);
              setSettingClicked(false);
              setLikeClicked(false);
            }}
          >
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={showModal}
              onRequestClose={() => {
                setShowModal(false);
                setLikeClicked(false);
                setSettingClicked(false);
              }}
            >
              <TouchableOpacity
                style={{
                  height: '100%',
                  marginTop: 55,
                  backgroundColor: 'rgba(52, 52, 52, 0.1)',
                }}
                activeOpacity={1}
                onPressOut={() => {
                  setShowModal(false);
                  setSettingClicked(false);
                  setLikeClicked(false);
                }}
              >
                {likeClicked && (
                  <View
                    style={{
                      borderRadius: 20,
                      backgroundColor: 'white',
                      width: '80%',
                      marginHorizontal: '10%',
                      marginTop: '55%',
                      alignItems: 'center',
                      shadowOpacity: 0.25,
                      elevation: 5,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}
                    >
                      <Icon
                        raised
                        name="heartbeat"
                        type="font-awesome"
                        color="#f50"
                      />
                      <Text
                        style={{
                          padding: 20,
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'center',
                        }}
                      >
                        {userDetail.username +
                          ` has a total of ` +
                          likes +
                          ` likes across all posts.`}
                      </Text>
                      <Pressable
                        onPress={() => {
                          setShowModal(false);
                          setLikeClicked(false);
                        }}
                        style={({pressed}) => [
                          {
                            backgroundColor: pressed ? '#EFEDED' : 'white',
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: 10,
                          }}
                        >
                          Ok
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                {settingClicked && (
                  <View
                    style={{
                      backgroundColor: 'black',
                      height: '50%',
                      marginTop: 'auto',
                      borderTopRightRadius: 30,
                      borderTopLeftRadius: 30,
                    }}
                  >
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
                          logout();
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
        <UsersMedia
          navigation={navigation}
          mediaFile={files}
          owner={userDetail}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

OtherUserProfile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  route: PropTypes.object,
};
export default OtherUserProfile;
