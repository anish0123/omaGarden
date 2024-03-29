import {Button, Card, Icon, Input} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useCallback, useContext, useRef, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';
import {Video} from 'expo-av';
import {Image} from '@rneui/base';
import {LinearGradient} from 'expo-linear-gradient';

// This view is used to upload files into the app
const Upload = ({navigation}) => {
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const [mediaFile, setMediaFile] = useState({});
  const [loading, setLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const video = useRef(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onChange',
  });

  // Method for uploading a post/ file.
  const uploadFile = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediaFile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediaFile.type + '/' + fileExt;
    formData.append('file', {
      uri: mediaFile.uri,
      name: filename,
      type: mimeType,
    });
    console.log('uploadFile: ', formData);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const uploadResult = await postMedia(formData, token);
      console.log('upload Result', uploadResult);

      const appTag = {
        file_id: uploadResult.file_id,
        tag: appId,
      };
      const tagResult = await postTag(appTag, token);
      console.log('tagResult', tagResult);
      Alert.alert(
        'Upload Confirmation',
        mediaFile.type + ' uploaded successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
              // update 'update' state in context
              setUpdate(!update);
              // reset form
              resetValues();
              // TODO: navigated to home;
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Upload Failed!',
        'Please try again with correct credentials',
        [
          {
            text: 'Ok',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Method for asking camera permission from the user
  const getCameraPermission = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permission');
    }
  };

  // Method for opening the camera and taking the pictures.
  const takePicture = async () => {
    // No permissions request is necessary for launching the image library
    try {
      await getCameraPermission();
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log('Pick camera result', result);

      if (!result.canceled) {
        setMediaFile(result.assets[0]);
      }
    } catch (error) {
      console.log('Error in taking picture', error);
    }
  };

  // Method for picking a file
  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      console.log(result);

      if (!result.canceled) {
        setMediaFile(result.assets[0]);
        // Validate form
        trigger();
      }
    } catch (error) {
      console.log('pickFile', error);
    }
  };

  // Method for reseting the values.
  const resetValues = () => {
    setMediaFile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetValues();
      };
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#C9FFBF', '#FFAFBD']}
              style={{height: '100%'}}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                }}
              >
                <Image
                  source={require('../assets/logo.png')}
                  style={{
                    width: 110,
                    height: 40,
                    marginBottom: 20,
                    marginTop: 30,
                    marginLeft: 10,
                    justifyContent: 'center',
                  }}
                ></Image>
              </View>
              <ScrollView>
                <Card.Divider />
                <Card containerStyle={{marginTop: 0}}>
                  {mediaFile.type === 'video' ? (
                    <Video
                      ref={video}
                      source={{uri: mediaFile.uri}}
                      style={{width: '100%', height: 250}}
                      resizeMode="contain"
                      useNativeControls
                      onError={(error) => {
                        console.log(error);
                      }}
                    />
                  ) : (
                    <Card.Image
                      style={{width: '100%', height: 250}}
                      source={{
                        uri:
                          mediaFile.uri || 'https://placekitten.com/g/200/300',
                      }}
                      onPress={pickFile}
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
                        style={{
                          paddingHorizontal: 5,
                        }}
                        containerStyle={{
                          minHeight: 90,
                        }}
                        inputContainer={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        inputContainerStyle={{
                          borderWidth: 1,
                          borderColor: 'green',
                          borderRadius: 7,
                          width: '100%',
                          justifyContent: 'center',
                          minHeight: 100,
                        }}
                        placeholder="Description"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline={true}
                        autoCapitalize="none"
                        errorMessage={
                          errors.description && errors.description.message
                        }
                      />
                    )}
                    name="description"
                  />

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginBottom: 10,
                    }}
                  >
                    <Icon
                      name="photo-camera"
                      onPress={takePicture}
                      size={25}
                      raised
                    />
                    <Icon
                      name="collections"
                      onPress={pickFile}
                      size={25}
                      raised
                    />
                  </View>
                  <Button
                    onPress={resetValues}
                    title="Reset"
                    buttonStyle={{
                      backgroundColor: '#62BD69',
                      borderColor: 'black',
                      borderRadius: 5,
                    }}
                    type="outline"
                    titleStyle={{color: 'black'}}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                  <Card.Divider />
                  <Button
                    buttonStyle={{
                      borderColor: 'black',
                      borderRadius: 5,
                    }}
                    type="outline"
                    titleStyle={{color: 'black'}}
                    loading={loading}
                    disabled={
                      !mediaFile.uri || errors.title || errors.description
                    }
                    title="Upload file"
                    onPress={handleSubmit(uploadFile)}
                  />
                  {loading && <ActivityIndicator size="large" />}
                </Card>
              </ScrollView>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
