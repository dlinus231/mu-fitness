import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import FooterTab from "../../FooterTab";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CalendarScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(new Date());
  const [today, setToday] = useState("");
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [marks, setMarks] = useState({});
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState([]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = months[month - 1];

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    return `${monthName} ${day}${suffix}, ${year}`;
  };

  const onScheduleWorkoutPress = () => {
    selected.setHours(selected.getHours() + 12);
    navigation.navigate("ScheduleWorkout", {
      onDate: selected.toISOString(),
    });
  };

  const fetchScheduledWorkouts = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const response = await axios.get(
        BACKEND_URL + `/workout/scheduled/${userId}`
      );
      setScheduledWorkouts(response.data);
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      fetchScheduledWorkouts();
      const currentDate = new Date();
      const offset = currentDate.getTimezoneOffset();
      const todayDate = new Date(currentDate.getTime() - offset * 60000);
      setToday(todayDate.toISOString().split("T")[0]);
      setSelected(todayDate);
    }, [])
  );

  useEffect(() => {
    const marked = {
      [selected.toISOString().split("T")[0]]: {
        dots: [],
        selected: true,
        disableTouchEvent: true,
      },
    };
    if (scheduledWorkouts.length > 0) {
      scheduledWorkouts.forEach((item) => {
        const date = item.date.split("T")[0];
        if (date in marked) {
          marked[date].dots.push({
            color: "#6A5ACD",
            selectedDotColor: "black",
          });
        } else {
          marked[date] = { dots: [] };
          marked[date].dots.push({
            color: "#6A5ACD",
            selectedDotColor: "black",
          });
        }
      });
    }
    setMarks(marked);
  }, [selected, scheduledWorkouts]);

  useEffect(() => {
    const todayStr = selected.toISOString().split("T")[0];
    setSelectedDateWorkouts(
      scheduledWorkouts.filter((item) => item.date.split("T")[0] === todayStr)
    );
  }, [selected]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}
            theme={styles.calendarTheme}
            onDayPress={(day) => {
              setSelected(new Date(day.dateString));
            }}
            markingType={"multi-dot"}
            markedDates={marks}
          ></Calendar>
        </View>
      </SafeAreaView>

      {selectedDateWorkouts.length == 0 ? (
        <View style={styles.agendaContainer}>
          <Text style={styles.agendaHeaderText}>
            No Workouts Scheduled{" "}
            {selected.toISOString().split("T")[0] === today
              ? "Today"
              : formatDate(selected.toISOString().split("T")[0])}
          </Text>
        </View>
      ) : (
        <View style={styles.agendaContainer}>
          <Text style={styles.agendaHeaderText}>
            Workouts on{" "}
            {selected.toISOString().split("T")[0] === today
              ? "Today"
              : formatDate(selected.toISOString().split("T")[0])}
          </Text>
          <ScrollView>
            {selectedDateWorkouts.map((item) => {
              return (
                <TouchableOpacity key={item.id}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={styles.addNewButton}
        onPress={onScheduleWorkoutPress}
      >
        <AntDesign name="pluscircle" size={36} color="#6A5ACD" />
      </TouchableOpacity>
      <FooterTab focused={"Calendar"}></FooterTab>
    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: "100%",
    // height
    marginTop: "3%",
  },
  calendarTheme: {
    backgroundColor: "rgba(0,0,0,0)",
    calendarBackground: "rgba(0,0,0,0)",
    arrowColor: "#6A5ACD",
    todayTextColor: "#000000",
    selectedDayTextColor: "#6A5ACD",
    selectedDayBackgroundColor: "#B6ADEF",
  },
  calendarContainer: { paddingBottom: "3%" },
  container: {
    width: "100%",
    height: "45%",
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  agendaContainer: {
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "52%",
  },
  agendaHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addNewButton: {
    position: "absolute",
    right: "5%",
    bottom: "10%",
  },
});

export default CalendarScreen;
