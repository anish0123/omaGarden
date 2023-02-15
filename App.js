import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import Profile from './views/Profile';

const App = () => {
  return (
    <View>
      <Profile />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
