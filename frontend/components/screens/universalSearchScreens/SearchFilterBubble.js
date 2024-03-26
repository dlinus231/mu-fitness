import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SearchFilterBubble = ({ text, setFocus, pressed }) => {
  const onPress = () => {
    setFocus(text);
  };
  if (text.length === 0) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.bubble, styles.clearFocusBubble]}>
          <Text style={[styles.text, styles.clearFocusText]}>X</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      { !pressed ? (
        <View style={styles.bubble}>
          <Text style={styles.text}>{text}</Text>
        </View>
      ) : (
        <View style={styles.pressedBubble}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
      
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
    backgroundColor: "#525252",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pressedBubble: {
    borderRadius: 20,
    backgroundColor: "#a99ee1",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearFocusBubble: {
    backgroundColor: "#AAAAAA",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  clearFocusText: {
    color: "#525252",
  },
  smartSearchtext: {
    color: "#FFFFFF",
  },
});

export default SearchFilterBubble;
