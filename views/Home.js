import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.contanier}>
      <List navigation={navigation} />
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

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
