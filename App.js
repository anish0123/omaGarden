import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  console.log('App running');
  return (
    <SafeAreaView style={styles.container}>
      <MainProvider>
        <StatusBar style="auto" />
        <Navigator />
      </MainProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    marginTop: 0,
  },
});

export default App;
