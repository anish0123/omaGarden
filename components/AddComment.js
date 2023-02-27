import {Button, Card, Input} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useContext} from 'react';
import {useComment} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

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
    <>
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
      <Button title="Add comment" onPress={handleSubmit(uploadComment)} />
    </>
  );
};

AddComment.propTypes = {
  file: PropTypes.object,
};

export default AddComment;
