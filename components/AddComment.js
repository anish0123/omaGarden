import {Button, Card, Input} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {useContext} from 'react';
import {useComment} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

// This view is used to add comment about a file in single view.
const AddComment = ({file}) => {
  const {setUpdateComment, updateComment} = useContext(MainContext);
  const {postComment} = useComment();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      comment: '',
      file_id: file.file_id,
    },
  });

  // Method for adding a comment
  const uploadComment = async (data) => {
    console.log('upload Comment', data);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const result = await postComment(data, token);
      Alert.alert('Comment added', 'Commend Id: ' + result.comment_id);
      reset();
      setUpdateComment(!updateComment);
    } catch (error) {
      throw new Error('upload comment, ' + error.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Card.Divider />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'comment is required',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Add Comment"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.title && errors.title.message}
            />
          )}
          name="comment"
        />
        <Button
          onPress={handleSubmit(uploadComment)}
          title="Add comment"
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
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

AddComment.propTypes = {
  file: PropTypes.object,
};

export default AddComment;
