import {Button, Card, Image, Input} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useContext, useRef, useState} from 'react';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {Video} from 'expo-av';

const EditPostForm = ({item, owner, navigation}) => {
  // const item = route.params[0];
  // const navigation = route.params[1];
  const [loading, setLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const {putMedia, deleteMedia} = useMedia();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onChange',
  });
  const video = useRef(null);

  const editPost = async (data) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putMedia(item.file_id, data, token);
      Alert.alert(result.message, 'File id: ' + item.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // reset form
            resetValues();
            item.title = data.title;
            item.description = data.description;
            // TODO: navigated to home;
            navigation.navigate('Single', [item, owner]);
          },
        },
      ]);
    } catch (error) {
      throw new Error('edit Post, ' + error.message);
    } finally {
      setLoading(false);
      setUpdate(!update);
    }
  };

  const mediaDelete = async () => {
    const token = await AsyncStorage.getItem('userToken');
    Alert.alert(
      'Do you want to delete this file?',
      'File id: ' + item.file_id,
      [
        {
          text: 'OK',
          onPress: async () => {
            await deleteMedia(item.file_id, token);
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // reset form
            resetValues();
            // TODO: navigated to home;
            navigation.navigate('Home');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  const resetValues = () => {
    reset();
  };
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card>
          {item.media_type === 'image' ? (
            <Image
              source={{uri: uploadsUrl + item.thumbnails?.w640}}
              style={styles.image}
            />
          ) : (
            <Video
              ref={video}
              source={{uri: uploadsUrl + item.filename}}
              style={{width: '100%', height: 500}}
              resizeMode="cover"
              useNativeControls
              onError={(error) => {
                console.log(error);
              }}
              isLooping
            />
          )}

          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Title is required',
              },
              minLength: {
                value: 3,
                message: 'Title Min length is 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            rules={{
              minLength: {
                value: 5,
                message: 'Description Min length is 5 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />
          <Button
            loading={loading}
            onPress={handleSubmit(editPost)}
            radius={'sm'}
            containerStyle={{
              width: '100%',
            }}
            disabled={errors.title || errors.description}
          >
            Edit Info
          </Button>
          <Button type="outline" onPress={resetValues}>
            Reset
          </Button>
          <Button type="outline" onPress={mediaDelete}>
            Delete
          </Button>
          {loading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

EditPostForm.propTypes = {
  item: PropTypes.object,
  navigation: PropTypes.object,
  owner: PropTypes.object,
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
});

export default EditPostForm;
