import {Button, Card, Input} from '@rneui/base';
import {useCallback, useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import {Alert, Dimensions, View} from 'react-native';
import {Video} from 'expo-av';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';

const ProfilePictureUpload = ({navigation}) => {
  const {postMedia} = useMedia();
  const [mediaFile, setMediaFile] = useState({});
  const [loading, setLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();
  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
    reset,
  } = useForm({
    defaultValues: {title: '', description: ''},
    mode: 'onChange',
  });

  const uploadFile = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const fileName = mediaFile.uri.split('/').pop();
    let fileExtension = fileName.split('.').pop();

    if (fileExtension === 'jpg') fileExtension = 'jpeg';
    const mimeType = mediaFile.type + '/' + fileExtension;

    formData.append('file', {
      uri: mediaFile.uri,
      name: fileName,
      type: mimeType,
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postMedia(formData, token);

      const appTag = {
        file_id: result.file_id,
        tag: 'OmaGarden_',
      };
      const tagResult = await postTag(appTag, token);
      console.log('tag result', tagResult);

      Alert.alert('Upload complete', 'Fild id : ' + result.file_id, [
        {
          text: 'ok',
          onPress: () => {
            console.log('Ok Pressed');
            setUpdate(!update);
            navigation.navigate('Profile');
          },
        },
      ]);
    } catch (error) {
      console.error('File upload error', error);
    } finally {
      setLoading(false);
    }
    console.log('Upload a file');
  };

  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setMediaFile(result.assets[0]);
        trigger();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setMediaFile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetForm();
      };
    }, [])
  );

  return (
    <Card
      containerStyle={{
        backgroundColor: '',
        margin: 0,
      }}
    >
      {mediaFile.type === 'video' ? (
        <Video
          ref={Video}
          source={{uri: mediaFile.uri}}
          style={{width: '100%', height: 200}}
          useNativeControls
          resizeMode="contain"
          onError={(error) => {
            console.log(error);
          }}
        />
      ) : (
        <Card.Image
          source={{
            uri: mediaFile.uri,
          }}
          onPress={pickFile}
        />
      )}

      <Controller
        rules={{
          required: {
            value: true,
            message: 'is required',
          },
          minLength: {
            value: 3,
            message: 'Length should be 3 characters',
          },
        }}
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.title && errors.title.message}
          />
        )}
        name="title"
      />

      <Controller
        rules={{
          minLength: {
            value: 5,
            message: 'Length should be 5 characters',
          },
        }}
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.description && errors.description.message}
          />
        )}
        name="description"
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onPress={pickFile}
          title="Select file"
          buttonStyle={{
            backgroundColor: '#62BD69',
            borderColor: 'black',
            borderRadius: 5,
          }}
          type="outline"
          titleStyle={{color: 'black'}}
          containerStyle={{
            width: Dimensions.get('screen').width / 2 - 20,
          }}
        />
        <Button
          onPress={resetForm}
          title="Reset"
          buttonStyle={{
            backgroundColor: '#62BD69',
            borderColor: 'black',
            borderRadius: 5,
          }}
          type="outline"
          titleStyle={{color: 'black'}}
          containerStyle={{
            width: Dimensions.get('screen').width / 2 - 20,
          }}
        />
      </View>
      <Button
        loading={loading}
        disabled={!mediaFile.uri || errors.title || errors.description}
        title="Upload file"
        onPress={handleSubmit(uploadFile)}
      />
    </Card>
  );
};
ProfilePictureUpload.propTypes = {
  navigation: PropTypes.object,
};

export default ProfilePictureUpload;
