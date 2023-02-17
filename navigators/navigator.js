import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from '../views/Main';
import Upload from '../views/Upload';
import LottieIcons from '../components/LottieIcons';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import Login from '../views/Login';
import Profile from '../views/Profile';
import ProfilePictureUpload from '../views/ProfilePictureUpload';
import ProfilePictures from '../views/ProfilePictures';
import EditProfile from '../views/EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          return <LottieIcons iconName={route.name} focused={focused} />;
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {padding: 4},
      })}
    >
      <Tab.Screen name="Home" component={Main} />
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
          <Stack.Screen
            name="ProfilePictureUpload"
            component={ProfilePictureUpload}
          />
          <Stack.Screen name="ProfilePictures" component={ProfilePictures} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
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

export default Navigator;
