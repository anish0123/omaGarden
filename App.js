import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  console.log('App running');
  return (
    <MainProvider>
      <StatusBar style="auto" />
      <Navigator />
    </MainProvider>
  );
};

export default App;
