import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import FooterTab from "../FooterTab";

const CalendarScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(new Date());

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

  return (
    <>
      <SafeAreaView style={styles.container}>
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
        <View style={styles.agendaContainer}>
          <Text style={styles.agendaHeaderText}>
            No Workouts Scheduled{" "}
            {selected.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0]
              ? "Today"
              : formatDate(selected.toISOString().split("T")[0])}
          </Text>
        </View>
      </SafeAreaView>
      <FooterTab focused={"Calendar"}></FooterTab>
    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: "100%",
    marginVertical: "3%",
  },
  calendarTheme: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    calendarBackground: "rgba(0, 0, 0, 0)",
    arrowColor: "#6A5ACD",
    todayTextColor: "#000000",
    selectedDayTextColor: "#6A5ACD",
    selectedDayBackgroundColor: "#B6ADEF",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  agendaContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  agendaHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CalendarScreen;
