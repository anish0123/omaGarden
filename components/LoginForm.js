import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Input} from '@rneui/themed';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Dimensions, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useAuthentication} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

// This component is used to log in users.
const LoginForm = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const [loading, setLoading] = useState(false);
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

  // Method for logging the user according to the data received from hook form
  const logIn = async (logInData) => {
    setLoading(true);
    console.log('Login Button pressed');
    try {
      const loginResult = await postLogin(logInData);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert(
        'Incorrect username or password',
        'Please try with correct credentials',
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
  return (
    <View
      style={{
        marginTop: 30,
        marginBottom: 30,
        flexDirection: 'column',
      }}
    >
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
            secureTextEntry={true}
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="password"
      />
      <Button
        onPress={handleSubmit(logIn)}
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
      >
        Log in!
      </Button>
    </View>
  );
};
LoginForm.propTypes = {
  navigation: PropTypes.object,
};
export default LoginForm;
