import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <LoginForm />
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;
