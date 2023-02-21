import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

const Main = () => {
  return (
    <SafeAreaView style={styles.container}>
      <List />
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
Main.propTypes = {
  myFilesOnly: PropTypes.bool,
};
export default Main;
