import {Card} from '@rneui/base';
import {Button, Input} from '@rneui/themed';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';

const RegisterForm = (props) => {
  // const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postUser} = useUser();
  const {
    control,
    getValues,
    handleSubmit,
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
    console.log('Registering: ', registerData);
    // const data = {username: 'anishm', password: 'anishm123'};
    try {
      const registerResult = await postUser(registerData);
      console.log('register', registerResult);
    } catch (error) {
      console.error('register', error);
    }
  };
  return (
    <Card>
      <Card.Title>Login</Card.Title>
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
        radius={'sm'}
        containerStyle={{width: '100%'}}
      >
        Register now!
      </Button>
    </Card>
  );
};
export default RegisterForm;
