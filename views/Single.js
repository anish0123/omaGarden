import {Card} from '@rneui/themed';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import AddComment from '../components/AddComment';
import FileInfo from '../components/FileInfo';
import Comment from '../components/Comment';

const Single = ({route, navigation}) => {
  const file = route.params[0];
  const owner = route.params[1];

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <View styles={styles.main}>
            <Card styles={styles.post}>
              <FileInfo file={file} owner={owner} />
              <Comment file={file} />
              <AddComment file={file} />
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  post: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '70%',
  },
});

export default Single;
