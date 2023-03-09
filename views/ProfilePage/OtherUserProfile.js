/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import {Card, Icon, Image, ListItem, Text} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import {
  useFavourite,
  useMedia,
  useRating,
  useTag,
  useUser,
} from '../../hooks/ApiHooks';
import {uploadsUrl} from '../../utils/variables';
import PropTypes from 'prop-types';
import {
  Alert,
  Dimensions,
  Modal,
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
import Stars from 'react-native-stars';
import {Button} from '@rneui/themed';

// This view displays the details of other users that has been clicked.
const OtherUserProfile = ({navigation, route}) => {
  const userDetail = route.params;
  const {loadAllMedia} = useMedia();
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {postRating, getRatingByFileId, deleteRating} = useRating();
  const {getFavouritesByFileId} = useFavourite();
  const {setIsLoggedIn, updateLike, user, update, setUpdate} =
    useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [owner, setOwner] = useState({});
  const [files, setFiles] = useState([]);
  const [likes, totalLikes] = useState(0);
  const [likeClicked, setLikeClicked] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [avatarId, setAvatarId] = useState();
  const [showStarRating, setShowStarRating] = useState(0);
  const [ratingClicked, setRatingClicked] = useState(false);
  const [totalReviewCount, setTotalReviewCount] = useState(0);

  // Method for loading the avatar of the owner of the post
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + userDetail.user_id);

      if (avatarArray.length > 1) {
        setAvatar(avatarArray.pop().filename);
        setAvatarId(avatarArray.pop().file_id);
      } else {
        setAvatar(avatarArray[0].filename);
        setAvatarId(avatarArray[0].file_id);
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

  // Method for uploading the rating for the user
  const uploadRating = async () => {
    setUpdate(false);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const rating = await postRating(avatarId, starRating, token);
      Alert.alert('Rading added', 'Thank you for rating this profile');
      setUpdate(true);
      setShowModal(false);
      setRatingClicked(false);
    } catch (error) {
      console.error('Post rating failed', error.message);
    }
  };

  // gets total review count of the profile
  const getProfileRating = async () => {
    let totalRating = 0;
    let reviewCount = 0;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const avatarArray = await getFilesByTag('avatar_' + userDetail.user_id);
      for (let i = 0; i < avatarArray.length; i++) {
        const ratingValue = await getRatingByFileId(avatarArray[i].file_id);
        console.log(ratingValue);
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
          ratingNum = ratingNumCeiling;
        } else {
          ratingNum = Math.floor(ratingNum) + 0.5;
        }
        setShowStarRating(ratingNum);
      }
    } catch (error) {
      console.error('getProfileRating', error);
    }
  };

  // Method for getting the owner of the specific post or file.
  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const ownerDetails = await getUserById(userDetail.user_id, token);
      setOwner(ownerDetails);
    } catch (error) {
      console.error('getOwner', error);
    }
  };

  // Checks if this profile is already rated or not
  const checkRatingAuth = async () => {
    setUpdate(false);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const avatarArray = await getFilesByTag('avatar_' + userDetail.user_id);

      // Users profile without any pictures cannot be rated.
      if (avatarArray.length === 0) {
        Alert.alert(
          'Profile rating failed',
          userDetail.username + ' has not uploaded any pictures yet. ',
          [
            {
              text: 'Ok',
            },
          ]
        );
        return;
      }
      for (let i = 0; i < avatarArray.length; i++) {
        const ratingValue = await getRatingByFileId(avatarArray[i].file_id);
        for (let j = 0; j < ratingValue.length; j++) {
          if (user.user_id === ratingValue[j].user_id) {
            setRatingClicked(false);
            Alert.alert(
              'Rating already added',
              'You have already rated this profile.' +
                `\n` +
                'Do you want to delete the previous rating?',
              [
                {
                  text: 'Delete',
                  onPress: async () => {
                    const result = await deleteRating(
                      ratingValue[j].file_id,
                      token
                    );
                    Alert.alert(
                      'Rating deleted',
                      'You can again rate this profile'
                    );
                    setUpdate(true);
                  },
                },
                {
                  text: 'Cancel',
                },
              ]
            );
            return;
          }
        }
        setShowModal(true);
        setRatingClicked(true);
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
    getOwner();
    loadAvatar();
    getProfileRating();
    allMediaFiles();
  }, [avatar, update, owner.user_id, updateLike]);

  return (
    <SafeAreaView>
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
            <TouchableOpacity
              style={{display: 'flex', flexDirection: 'row', marginTop: 10}}
              onPress={() => {
                checkRatingAuth();
              }}
            >
              <Stars
                half={true}
                default={showStarRating}
                count={5}
                spacing={1}
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
            </TouchableOpacity>
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
            setRatingClicked(false);
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
              setRatingClicked(false);
            }}
          >
            <TouchableOpacity
              style={{
                height: '100%',
                marginTop: 60,
              }}
              activeOpacity={1}
              onPressOut={() => {
                setShowModal(false);
                setSettingClicked(false);
                setLikeClicked(false);
                setRatingClicked(false);
              }}
            >
              {likeClicked && (
                <View
                  style={{
                    borderRadius: 20,
                    backgroundColor: 'white',
                    width: '80%',
                    marginHorizontal: '10%',
                    marginTop: '50%',
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
              {ratingClicked && (
                <View
                  style={{
                    backgroundColor: 'gray',
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
                      flexDirection: 'column',
                      padding: 15,
                      marginTop: 15,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 30,
                        marginBottom: 30,
                      }}
                    >
                      Rate this Profile
                    </Text>

                    <Stars
                      half={false}
                      default={0}
                      count={5}
                      spacing={8}
                      update={(val) => {
                        setStarRating(val);
                      }}
                      starSize={50}
                    />

                    <Button
                      title="Submit"
                      buttonStyle={{
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 20,
                        marginTop: 50,
                      }}
                      type="outline"
                      titleStyle={{color: 'white', fontSize: 18}}
                      containerStyle={{
                        width: Dimensions.get('screen').width / 3,
                        marginHorizontal: Dimensions.get('screen').width / 3,
                      }}
                      onPress={() => uploadRating()}
                    />
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

OtherUserProfile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  route: PropTypes.object,
};
export default OtherUserProfile;
