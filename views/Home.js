import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Card, Image, Text} from '@rneui/themed';
import {Icon} from '@rneui/base';
import {LinearGradient} from 'expo-linear-gradient';
import {useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

// This is the main view of the app which displays all post/media that users have uploaded
const Home = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const {setIsLoggedIn} = useContext(MainContext);

  // Method for logging out user.
  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('clearing asyncstorage failed ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginStart: 10,
          marginEnd: 15,
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 110,
            height: 40,
            marginBottom: 20,
            marginTop: 30,
            justifyContent: 'center',
          }}
        ></Image>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
              setShowModal(false);
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}
              activeOpacity={1}
              onPress={() => setShowModal(false)}
            >
              <View
                style={{
                  backgroundColor: '#e6ffe6',
                  borderRadius: 10,
                  padding: 30,
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
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      borderRadius: 5,
                      padding: 10,
                      elevation: 2,
                      backgroundColor: '#ccffcc',
                    }}
                    onPress={() => {
                      setShowModal(false);
                      logout();
                    }}
                  >
                    <Icon name="logout" color="black" />
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        marginLeft: 10,
                      }}
                    >
                      Logout
                    </Text>
                  </TouchableOpacity>
                  <Pressable
                    style={{
                      marginTop: 30,
                      borderRadius: 20,
                      padding: 10,
                      elevation: 2,
                      backgroundColor: '#ccffcc',
                    }}
                    onPress={() => setShowModal(false)}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          <Icon
            name="reorder-three-outline"
            type="ionicon"
            size={30}
            onPress={() => {
              setShowModal(true);
            }}
          />
        </View>
      </View>

      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#C9FFBF', '#FFAFBD']}
      >
        <Card.Divider style={{marginBottom: 0}} />
        <View style={{marginBottom: 100, marginTop: 0}}>
          <List navigation={navigation} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default Home;
