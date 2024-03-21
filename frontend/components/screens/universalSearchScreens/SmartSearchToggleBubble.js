import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SmartSearchToggleBubble = ({ smartSearch, setSmartSearch }) => {
  const onPress = () => {
    setSmartSearch(!smartSearch);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: smartSearch ? "#7FFFD4" : "#525252" },
        ]}
      >
        <Text
          style={[styles.text, { color: smartSearch ? "#000000" : "#FFFFFF" }]}
        >
          Smart Search
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 14,
  },
});

export default SmartSearchToggleBubble;
