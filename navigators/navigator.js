import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../views/Home';
import Upload from '../views/Upload';
import LottieIcons from '../components/LottieIcons';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import Login from '../views/Login';
import Single from '../views/Single';
import Profile from '../views/ProfilePage/Profile';
import ProfilePictureUpload from '../views/ProfilePage/ProfilePictureUpload';
import ProfilePictures from '../views/ProfilePage/ProfilePictures';
import EditProfile from '../views/ProfilePage/EditProfile';
import Search from '../views/Search';
import LoginForm from '../components/LoginForm';
import OtherUserProfile from '../views/ProfilePage/OtherUserProfile';
import EditPost from '../views/EditPost';
import {StyleSheet} from 'react-native';
import UsersWhoLiked from '../views/UsersWhoLiked';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          return <LottieIcons iconName={route.name} focused={focused} />;
        },
        tabBarStyle: styles.container,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {padding: 4},
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen
            name="ProfilePictureUpload"
            component={ProfilePictureUpload}
          />
          <Stack.Screen name="LoginForm" component={LoginForm} />
          <Stack.Screen name="ProfilePictures" component={ProfilePictures} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} />
          <Stack.Screen name="EditPost" component={EditPost} />
          <Stack.Screen name="UserWhoLiked" component={UsersWhoLiked} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
});

export default Navigator;
