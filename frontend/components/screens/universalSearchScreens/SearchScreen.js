import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";
import BackArrowIcon from "../../icons/BackArrowIcon";
import axios from "axios";
import { BACKEND_URL } from "@env";
import SearchScroller from "./SearchScroller";
import SearchFilterBubble from "./SearchFilterBubble";
// import { getYoutubeMeta } from "react-native-youtube-iframe";

import { useNavigation, useRoute } from "@react-navigation/native";

const SearchScreen = ({
  onSwitchPage, // callback function
  rootPage, // string
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const prevPage = route.params?.prevPage;

  const categories = ["exercises", "workouts", "users"];

  const [searchBar, setSearchBar] = useState("");
  const prevSearch = useRef("");
  const [timer, setTimer] = useState(0);
  const [searchData, setSearchData] = useState({
    exercises: [],
    workouts: [],
    users: [],
  });
  const [loading, setLoading] = useState("");
  const [focus, setFocus] = useState("");
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
          await setSearchData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }, 0);
  }, [timer]);

  //Handles items that are on and navigated to, category is passed in from this screen to each searchscroller
  const handleItemPress = (category, id) => {
    switch (category) {
      case "exercises":
        navigation.navigate("ExerciseScreen", { exercise_id: id });
        break;

      default:
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate(prevPage)}
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

      {focus.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.filterScroll}
          style={{ flexGrow: 0 }}
        >
          {categories.map((category, idx) => {
            return (
              <SearchFilterBubble
                key={idx}
                text={category}
                setFocus={setFocus}
              ></SearchFilterBubble>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.filterScroll}
          style={{ flexGrow: 0 }}
        >
          <SearchFilterBubble
            text={""}
            setFocus={setFocus}
          ></SearchFilterBubble>
          <SearchFilterBubble
            text={focus}
            setFocus={setFocus}
          ></SearchFilterBubble>
        </ScrollView>
      )}
      {focus.length === 0 ? (
        categories.map((category, idx) => {
          return (
            <SearchScroller
              key={idx}
              category={category}
              data={searchData[category]}
              handleItemPress={handleItemPress}
            ></SearchScroller>
          );
        })
      ) : (
        <SearchScroller
          category={focus}
          data={searchData[focus]}
          handleItemPress={handleItemPress}
        ></SearchScroller>
      )}

      <View style={styles.bottomContent}>
        <View style={styles.buttonContainer}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    width: 0,
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
  filterScroll: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    flexGrow: 0,
    marginBottom: 10,
  },
  container: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 10,
    minHeight: "100%",
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
