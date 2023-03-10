import {Button, Input} from '@rneui/themed';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Dimensions, ScrollView, View} from 'react-native';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Text} from '@rneui/base';

// This component is used to register new users.
const RegisterForm = ({navigation}) => {
  const {postUser, checkUsername} = useUser();
  const [loading, setLoading] = useState(false);
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onChange',
  });

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  // Method of registering the user according to the data received from hook form
  const register = async (registerData) => {
    delete registerData.confirmPassword;
    setLoading(true);
    console.log('Registering: ', registerData);
    // const data = {username: 'anishm', password: 'anishm123'};
    try {
      const registerResult = await postUser(registerData);
      console.log('register', registerResult);
      Alert.alert('Registered successfully.', 'UserName and Password Created', [
        {
          text: 'OK',
          onPress: () => {
            reset({
              username: '',
              password: '',
              confirmPassword: '',
              email: '',
              full_name: '',
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'User Registeration Failed',
        'Please try again with valid credentials',
        [
          {
            text: 'OK',
            onPress: () => {
              reset({
                password: '',
                confirmPassword: '',
              });
            },
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView
      style={{
        marginTop: 30,
        marginBottom: 30,
        flexDirection: 'column',
      }}
    >
      <Text
        h2
        h2Style={{
          fontSize: 30,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        Welcome to OmaGarden
      </Text>
      <View
        style={{
          marginTop: 30,
          marginBottom: 30,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Username is required',
            },
            minLength: {
              value: 3,
              message: 'Username Min length is 3 characters.',
            },
            validate: checkUser,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 7,
                width: '80%',
                justifyContent: 'center',
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
            pattern: {
              value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
              message:
                'min 5 characters, needs one number, one uppercase letter',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 7,
                width: '80%',
              }}
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
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
                return 'password doesnt match';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 7,
                width: '80%',
              }}
              placeholder="Confirm Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              autoCapitalize="none"
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
          name="confirmPassword"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Email is required in form of abc@de.fg',
            },
            pattern: {
              value: /^[a-z0-9.]{1,64}@[a-z0-9.-]{3,64}/i,
              message: 'Must be a valid email',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 7,
                width: '80%',
              }}
              autoCapitalize="none"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email && errors.email.message}
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            minLength: {value: 3, message: 'must be at least 3 characters'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 7,
                width: '80%',
              }}
              placeholder="Full name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
              errorMessage={errors.full_name && errors.full_name.message}
            />
          )}
          name="full_name"
        />
      </View>
      <Button
        onPress={handleSubmit(register)}
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
        Register now!
      </Button>
    </ScrollView>
  );
};
RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
