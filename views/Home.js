import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import List from '../components/List';
const Main = () => {
  return (
    <SafeAreaView style={styles.contanier}>
      <List />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0)',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    marginTop: 0,
  },
});

export default Main;
