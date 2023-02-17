import React, {useContext, useState} from 'react';
import {Button, Card, Input} from '@rneui/base';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Dimensions} from 'react-native';
import {useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const EditProfile = ({navigation, route}) => {
  const {fileName} = route.params;
  const {putUser, checkUsername} = useUser();
  const [loading, setLoading] = useState(false);
  const {update, setUpdate, setIsLoggedIn} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: route.params.userName,
      email: route.params.email,
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const modifyProfile = async (data) => {
    setLoading(true);
    delete data.confirmPassword;
    if (!data.password.trim()) {
      delete data.password;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putUser(data, token);
      console.log('Result ' + result);

      Alert.alert('Personal Info Updated', 'You will be logged out.', [
        {
          text: 'ok',
          onPress: () => {
            setUpdate(!update);
            setIsLoggedIn(false);
            try {
              AsyncStorage.clear();
            } catch (error) {
              console.error('clearing asyncstorage failed ', error);
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Profile Modify error', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkuser' + userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkuser ' + error.message);
    }
  };

  return (
    <Card
      containerStyle={{
        backgroundColor: '',
        margin: 0,
      }}
    >
      <Card.Image
        source={{uri: uploadsUrl + fileName}}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginHorizontal: Dimensions.get('screen').width / 2 - 75,
          width: 100,
          height: 100,
          marginBottom: 20,
          borderRadius: 100 / 2,
          borderWidth: 2,
          borderColor: 'green',
        }}
      ></Card.Image>
      <Controller
        control={control}
        rules={{
          validate: checkUser,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{
              borderWidth: 1,
              padding: 8,
            }}
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            defaultValue={value}
            autoCapitalize="none"
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          pattern: {
            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/,
            message: 'Provide valid email address',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{
              borderWidth: 1,
              padding: 8,
            }}
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            defaultValue={value}
            errorMessage={errors.email && errors.email.message}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          pattern: {
            value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
            message: 'min 5 characters, one number and one uppercase letter',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{
              borderWidth: 1,
              padding: 8,
            }}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            defaultValue={value}
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          validate: (value) => {
            if (value === getValues('password')) {
              return true;
            } else {
              return 'Password do not match';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{
              borderWidth: 1,
              padding: 8,
            }}
            placeholder="Confirm Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            errorMessage={
              errors.confirmPassword && errors.confirmPassword.message
            }
          />
        )}
        name="confirmPassword"
      />

      <Button
        loading={loading}
        title="Save Changes"
        buttonStyle={{
          backgroundColor: '#62BD69',
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 20,
        }}
        type="outline"
        titleStyle={{color: 'black', fontSize: 20}}
        containerStyle={{
          padding: 10,
          width: Dimensions.get('screen').width / 2,
          marginHorizontal: Dimensions.get('screen').width / 5,
        }}
        onPress={handleSubmit(modifyProfile)}
      ></Button>
    </Card>
  );
};

EditProfile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EditProfile;
