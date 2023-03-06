import AsyncStorage from '@react-native-async-storage/async-storage';
import {SearchBar} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import UsersList from '../components/UsersList';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

// This is the view where the user can search for other users
const Search = ({navigation}) => {
  const [value, setValue] = useState('');
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const {getAllUsers} = useUser();

  // Method for getting list of all the searched users.
  const getUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const usersList = await getAllUsers(token);
      setFilteredUsersList(
        usersList.filter((user) =>
          user.username.toLowerCase().includes(value.toLowerCase())
        )
      );
    } catch (error) {
      throw new Error('getUsers, ' + error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, [value]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        platform="default"
        containerStyle={{backgroundColor: '#62BD69'}}
        inputContainerStyle={{backgroundColor: '#ffff'}}
        inputStyle={{color: '#000000'}}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        loadingProps={{}}
        onChangeText={(newVal) => setValue(newVal)}
        placeholder="Username..."
        placeholderTextColor="#888"
        round
        cancelButtonTitle="Cancel"
        cancelButtonProps={{}}
        autoCapitalize="none"
        value={value}
      />

      <UsersList navigation={navigation} userList={filteredUsersList} />
    </SafeAreaView>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    marginTop: 0,
  },
});

export default Search;
