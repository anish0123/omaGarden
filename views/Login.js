import {Keyboard, ScrollView, TouchableOpacity, View} from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import {Text} from '@rneui/base';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserById} = useUser();
  const [toggleForm, setToggleForm] = useState(true);
  const checkId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId === null) return;
      const userData = await getUserById(userId);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('checkId', error);
    }
  };
  useEffect(() => {
    checkId();
  }, []);
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        {toggleForm ? <LoginForm /> : <RegisterForm />}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{fontSize: 20}}>
            {toggleForm
              ? "Don't have Account? Please "
              : 'You have an account? Please '}
          </Text>
          <Text
            style={{color: 'green', fontSize: 20}}
            onPress={() => setToggleForm(!toggleForm)}
          >
            {toggleForm ? 'register' : 'sign in'}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
