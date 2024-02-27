import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

const SearchScreen = ({ 
    onSwitchPage, // callback function
    rootPage, // string
}) => {
  return (
    <View style={styles.container}>
      <Text>This is the Search screen</Text>
      <View style={styles.bottomContent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => onSwitchPage(rootPage)}>
            <Text style={{ color: "white" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    display: 'flex',
    alignItems: "flex-end",
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  backButton: {
    borderWidth: 2,
    borderColor: "#6A5ACD",
    borderRadius: 10,
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
  
export default SearchScreen;