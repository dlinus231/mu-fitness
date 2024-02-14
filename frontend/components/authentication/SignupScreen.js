import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

const SignupScreen = ({ navigation, handleAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [username, setUsername] = useState('');

  // makes signin request when signin form is submitted
  const handleSignUp = async () => {
    // TODO check that the password and password confirmation match

    try {
      const response = await axios.post('http:/PUT_BACKEND_LINK_HERE', {
        username,
        email,
        password,
      });
      Alert.alert('Sign Up Successful', 'You can now log in with your credentials.');
      // TODO SET ISLOGGEDIN TO TRUE (pass in callback function)
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle errors, such as showing an alert with a message
      Alert.alert('Sign Up Failed', error.response?.data?.error || 'Please try again later.');
    }
  };  

  return (
    <View style={styles.container}>
      <Text>This is the signup screen</Text>
      <Text>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.space}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
    },
    space: {
        marginTop: 20,
    },
});
  
export default SignupScreen;