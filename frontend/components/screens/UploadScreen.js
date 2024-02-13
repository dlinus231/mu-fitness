import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

const UploadScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is the upload screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});
  
export default UploadScreen;