import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@gluestack-ui/themed";

import TopBarMenu from "../TopBarMenu";

const PublicFeedScreen = ({ navigation }) => {
  const handleSwitchPage = (page) => {
    navigation.navigate(page, { prevPage: "PublicFeed" });
  };

  return (
    <>
      <TopBarMenu onSwitchPage={handleSwitchPage} />
      <View style={styles.container}>
        <Text>This is the public feed screen</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PublicFeedScreen;
