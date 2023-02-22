import {Button, Input} from '@rneui/themed';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Dimensions, ScrollView, Text} from 'react-native';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

const RegisterForm = ({navigation}) => {
  // const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postUser} = useUser();
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
  });

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
      console.error('register', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView>
      <Text>Welcome to Oma Garden</Text>
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
              borderRadius: 5,
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
              borderRadius: 5,
            }}
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
              borderRadius: 5,
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
RegisterForm.propTypes = {navigation: PropTypes.object};

export default RegisterForm;
