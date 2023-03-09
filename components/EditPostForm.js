// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react';
import {Card, Image, Input, Button} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {useContext, useRef, useState} from 'react';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {Video} from 'expo-av';
import {Icon} from '@rneui/base';

// This component is used to edit file info in editPost view.
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
      title: item.title,
      description: item.description,
    },
    mode: 'onChange',
  });
  const video = useRef(null);

  // Method for editing post and updating the post.
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

  // Method for deleting the post/media.
  const mediaDelete = async () => {
    const token = await AsyncStorage.getItem('userToken');
    Alert.alert('Delete Confirmation', 'Do you want to delete this file?', [
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
    ]);
  };
  const resetValues = () => {
    reset();
  };
  return (
    <Card containerStyle={{margin: 0}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Icon
          raised
          name="refresh-outline"
          type="ionicon"
          onPress={resetValues}
        />
        <Icon
          raised
          name="trash-outline"
          type="ionicon"
          color="red"
          onPress={mediaDelete}
        />
      </View>
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
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: 'green',
              borderRadius: 7,
              width: '100%',
              justifyContent: 'center',
              marginTop: 20,
              padding: 5,
            }}
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
            multiline
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: 'green',
              borderRadius: 7,
              width: '100%',
              justifyContent: 'center',
              padding: 5,
            }}
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
        onPress={handleSubmit(editPost)}
        title="Save Changes"
        disabled={errors.title || errors.description}
        buttonStyle={{
          backgroundColor: '#62BD69',
          borderColor: 'black',
          borderRadius: 20,
        }}
        type="outline"
        titleStyle={{color: 'black'}}
        containerStyle={{
          width: Dimensions.get('screen').width / 3,
          marginHorizontal: Dimensions.get('screen').width / 4,
        }}
      />
      {loading && <ActivityIndicator size="large" />}
    </Card>
  );
};

// Prop validation for editPostForm params
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
