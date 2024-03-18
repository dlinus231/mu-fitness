import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";
import BackArrowIcon from "../../icons/BackArrowIcon";
import axios from "axios";
import { BACKEND_URL } from "@env";
import SearchScroller from "./SearchScroller";

const SearchScreen = ({
  onSwitchPage, // callback function
  rootPage, // string
}) => {
  const [searchBar, setSearchBar] = useState("");
  const prevSearch = useRef("");
  const [timer, setTimer] = useState(0);
  const [searchData, setSearchData] = useState({
    exercises: [],
    workouts: [],
    users: [],
  });
  const [loading, setLoading] = useState("");
  const TextInputRef = useRef(null);

  //Drop keyboard on return
  const onKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter") {
      TextInputRef.current.blur();
    }
  };

  //Prevent newline character
  const onChangeText = (newText) => {
    setSearchBar(newText.replace(/\n/g, ""));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
    }, 500);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    setTimeout(async () => {
      if (searchBar.length > 0 && prevSearch.current !== searchBar) {
        prevSearch.current = searchBar;
        try {
          const response = await axios.get(
            BACKEND_URL + `/search/${searchBar}`
          );
          setSearchData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }, 0);
  }, [timer]);

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onSwitchPage(rootPage)}
        >
          <BackArrowIcon></BackArrowIcon>
        </TouchableOpacity>
        <View style={{ width: "90%", paddingHorizontal: "5%" }}>
          <TextInput
            ref={TextInputRef}
            style={styles.text}
            placeholder="Search for exercises, workouts, users, and more..."
            multiline={true}
            numberOfLines={2}
            textAlignVertical="top"
            placeholderTextColor="#525252"
            value={searchBar}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
          ></TextInput>
          <View style={styles.hr}></View>
        </View>
      </View>
      <SearchScroller
        category={"Exercises"}
        data={searchData.exercises}
      ></SearchScroller>
      <SearchScroller
        category={"Workouts"}
        data={searchData.workouts}
      ></SearchScroller>
      <SearchScroller
        category={"Users"}
        data={searchData.users}
      ></SearchScroller>

      <View style={styles.bottomContent}>
        <View style={styles.buttonContainer}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    width: 0,
    flexGrow: 1,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  backButton: {
    marginTop: 10,
    alignItems: "center",
    width: "10%",
  },
  topContent: {
    flexDirection: "row",
    padding: 10,
    alignItems: "flex-start",
    width: "95%",
    marginTop: "5%",
  },
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    height: "100%",
    backgroundColor: "#000000",
    flexDirection: "column",
  },
  hr: {
    borderBottomColor: "#525252",
    borderBottomWidth: 1,
  },
  text: {
    textAlign: "left",
    fontSize: 19,
    marginTop: 10,
    height: 55,
    width: "90%",
    flexWrap: "wrap",
    color: "#525252",
  },
});

export default SearchScreen;
