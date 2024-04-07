import React, { useCallback, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import FooterTab from "../FooterTab";
import { useFocusEffect } from "@react-navigation/native";

const CalendarScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(new Date());
  const [today, setToday] = useState("");

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

  useFocusEffect(
    useCallback(() => {
      const currentDate = new Date();
      const offset = currentDate.getTimezoneOffset();
      const todayDate = new Date(currentDate.getTime() - offset * 60000);
      setToday(todayDate.toISOString().split("T")[0]);
      setSelected(todayDate);
    }, [])
  );

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
            markedDates={{
              [selected.toISOString().split("T")[0]]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
          ></Calendar>
        </View>
      </SafeAreaView>
      <View style={styles.agendaContainer}>
        <Text style={styles.agendaHeaderText}>
          No Workouts Scheduled{" "}
          {selected.toISOString().split("T")[0] === today
            ? "Today"
            : formatDate(selected.toISOString().split("T")[0])}
        </Text>
      </View>

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
});

export default CalendarScreen;
