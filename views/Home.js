import {StyleSheet, SafeAreaView, Platform, View} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Card, Image} from '@rneui/themed';
import {Icon} from '@rneui/base';

const Home = ({navigation}) => {
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
        <Icon name="reorder-three-outline" type="ionicon" />
      </View>
      <Card.Divider />
      <List navigation={navigation} />
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
