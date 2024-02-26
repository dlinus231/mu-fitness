// LandingScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { VStack, Button, ButtonText} from '@gluestack-ui/themed';

const PersonalProfileMenuScreen = ({ navigation, handleAuthChange }) => {
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.top_text}>This is the personal profile screen</Text>
        <VStack space="md" style={styles.buttonContainer}>
            <Button
                onPress={() => navigation.navigate('journal')}
            >
                <ButtonText>Journal</ButtonText>
            </Button>

            <Button
                onPress={handleAuthChange}
            >
                <ButtonText>Sign out</ButtonText>
            </Button>
        </VStack>
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    buttonContainer: {
      justifyContent: 'space-around',
      // Adjust the padding as needed
      paddingHorizontal: 10,
    },
    top_text: {
        textAlign: 'center',
        paddingHorizontal: '3%',
        paddingBottom: '10%',
    }
});

export default PersonalProfileMenuScreen;
