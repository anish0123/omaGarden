/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Button, Card, Icon, Image, ListItem, Text} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {useFavourite, useMedia, useRating, useTag} from '../../hooks/ApiHooks';
import {uploadsUrl} from '../../utils/variables';
import PropTypes from 'prop-types';
import Stars from 'react-native-stars';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {MainContext} from '../../contexts/MainContext';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import UsersMedia from '../../components/UsersMedia';

// This view displays the user details of the current logged in user.
const Profile = ({navigation, myFilesOnly = true}) => {
  const {mediaArray} = useMedia(myFilesOnly);
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user} = useContext(MainContext);
  const {getFavouritesByFileId} = useFavourite();
  const {getRatingByFileId} = useRating();
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const {updateLike} = useContext(MainContext);
  const [showStarRating, setShowStarRating] = useState(0);
  const [likes, totalLikes] = useState(0);
  const [totalReviewCount, setTotalReviewCount] = useState(0);

  // Loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      if (avatarArray.length > 0) {
        setAvatar(avatarArray.pop().filename);
      }
    } catch (error) {
      console.log('load Avatar', error);
    }
  };

  // Method for navigating user to change profile picture page
  const uploadProfile = async () => {
    navigation.navigate('ProfilePictureUpload');
  };

  // Method for getting total likes that user has gotten in all his posts.
  const getLikes = async () => {
    let noOfLikes = 0;
    try {
      for (let i = 0; i < mediaArray.length; i++) {
        const likes = await getFavouritesByFileId(mediaArray[i].file_id);
        noOfLikes += Number(likes.length);
      }
    } catch (error) {
      console.log('getLikes' + error);
    }
    totalLikes(noOfLikes);
  };

  const getProfileRating = async () => {
    let totalRating = 0;
    let reviewCount = 0;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      for (let i = 0; i < avatarArray.length; i++) {
        const ratingValue = await getRatingByFileId(avatarArray[i].file_id);
        reviewCount += Number(ratingValue.length);
        for (let j = 0; j < ratingValue.length; j++) {
          totalRating += Number(ratingValue[j].rating);
        }
      }
      setTotalReviewCount(reviewCount);
      if (reviewCount === 0) {
        setShowStarRating(0);
      } else {
        let ratingNum = totalRating / reviewCount;
        const ratingNumCeiling = Math.ceil(ratingNum);
        if (ratingNumCeiling - ratingNum < 0.5) {
          ratingNum = Math.ceil(ratingNum);
        } else {
          ratingNum = Math.floor(ratingNum) + 0.5;
        }
        setShowStarRating(ratingNum);
      }
    } catch (error) {
      console.error('getProfileRating', error);
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
    getProfileRating();
  }, []);

  useEffect(() => {
    getLikes();
    loadAvatar();
  }, [updateLike, mediaArray]);

  return (
    <SafeAreaView style={{paddingTop: Platform.OS === 'android' ? 35 : 0}}>
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
            marginStart: 10,
            marginEnd: 10,
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 110,
              height: 40,
              marginBottom: 15,
              marginTop: 15,
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
            {avatar != '' ? (
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
                  margin: 15,
                  borderRadius: 120 / 2,
                  borderWidth: 1,
                  borderColor: 'black',
                }}
              />
            )}
            {user.full_name !== 'null' ? (
              <ListItem.Title style={{fontSize: 20, marginTop: 10}}>
                {user.username}
              </ListItem.Title>
            ) : (
              <ListItem.Title style={{fontSize: 20, marginTop: 10}}>
                {user.full_name}
              </ListItem.Title>
            )}
            <ListItem.Title style={{padding: 10, fontSize: 20}}>
              {user.email}
            </ListItem.Title>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Stars
                half={true}
                default={showStarRating}
                count={5}
                spacing={1}
                starSize={20}
                disabled={true}
                fullStar={<Icon name={'star'} style={[styles.myStarStyle]} />}
                halfStar={
                  <Icon name={'star-half'} style={[styles.myStarStyle]} />
                }
                emptyStar={
                  <Icon
                    name={'star-outline'}
                    style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                  />
                }
              />
              <Text>({totalReviewCount + ` vote`})</Text>
            </View>
            <Button
              title="Edit Profile"
              buttonStyle={{
                backgroundColor: '#6fdc6f',
                borderColor: 'black',
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 20,
                margin: 5,
              }}
              type="outline"
              titleStyle={{color: 'black', fontSize: 18}}
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
            <Card
              containerStyle={{
                width: '100%',
                height: 75,
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
                    {mediaArray.length}
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
        <View
          style={{
            position: 'absolute',
            top: 156,
            marginHorizontal: Dimensions.get('screen').width / 2 - 70,
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
              setLikeClicked(false);
            }}
          >
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={showModal}
              onRequestClose={() => {
                setShowModal(false);
                setEditClicked(false);
                setSettingClicked(false);
                setLikeClicked(false);
              }}
            >
              <TouchableOpacity
                style={{
                  height: '100%',
                }}
                activeOpacity={1}
                onPressOut={() => {
                  setShowModal(false);
                  setEditClicked(false);
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
                        {user.userName ||
                          user.full_name +
                            ` has total of ` +
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
                {editClicked && (
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
      </Card>
      <UsersMedia navigation={navigation} mediaFile={mediaArray} owner={user} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  myStarStyle: {
    color: '#aaa',
    backgroundColor: '',
    textShadowColor: 'white',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
});
Profile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};
export default Profile;
