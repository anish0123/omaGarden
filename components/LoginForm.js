import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Input} from '@rneui/themed';
import React, {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useAuthentication} from '../hooks/ApiHooks';

const LoginForm = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const logIn = async (logInData) => {
    console.log('Login Button pressed');
    // const data = {username: 'anishm', password: 'anishm123'};
    try {
      const loginResult = await postLogin(logInData);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('logIn', error);
      // TODO: notify user about failed login attempt
    }
  };
  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Username is required',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: 'green',
              borderRadius: 5,
            }}
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Password is required',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: 'green',
              borderRadius: 5,
            }}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="password"
      />
      <Button
        onPress={handleSubmit(logIn)}
        radius={'sm'}
        containerStyle={{width: '30%'}}
        buttonStyle={{backgroundColor: 'rgba(127, 220, 103, 1)'}}
      >
        Sign in!
      </Button>
    </View>
  );
};
export default LoginForm;
