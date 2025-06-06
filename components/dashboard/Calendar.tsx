import { auth, db } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Paragraph } from "react-native-paper";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";

// Marked dates structure
interface MarkedDates {
  [date: string]: {
    selected: boolean;
    marked?: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
}

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const CalendarComponent: React.FC = () => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<"start" | "end" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDayPress = (day: DateObject) => {
    const selected = day.dateString;

    if (!range.start || (range.start && range.end)) {
      // Start new range
      setRange({ start: selected, end: null });
      setMarkedDates({
        [selected]: {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: Theme.primary,
          textColor: "#fff",
        },
      });
    } else {
      // End range
      const start = dayjs(range.start);
      const end = dayjs(selected);
      if (end.isBefore(start)) {
        Alert.alert("Invalid Range", "End date can't be before start date");
        return;
      }

      const rangeDays: MarkedDates = {};
      for (let i = 0; i <= end.diff(start, "day"); i++) {
        const date = start.add(i, "day").format("YYYY-MM-DD");
        rangeDays[date] = {
          selected: true,
          color: Theme.primary,
          textColor: "#fff",
        };
      }

      // Add range flags
      rangeDays[range.start]!.startingDay = true;
      rangeDays[selected]!.endingDay = true;

      setMarkedDates(rangeDays);
      setRange({ ...range, end: selected });
    }
  };

  const handleMonthSelect = () => {
    const today = dayjs();
    const firstDay = today.startOf("month");
    const lastDay = today.endOf("month");

    const monthDays: MarkedDates = {};
    for (let i = 0; i <= lastDay.diff(firstDay, "day"); i++) {
      const date = firstDay.add(i, "day").format("YYYY-MM-DD");
      monthDays[date] = {
        selected: true,
        marked: true,
        color: Theme.primary,
        textColor: "#fff",
      };
    }
    setRange({ start: firstDay.format("YYYY-MM-DD"), end: lastDay.format("YYYY-MM-DD") });
    setMarkedDates(monthDays);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowTimePicker(null);
    if (showTimePicker === "start") {
      setStartTime(selectedDate);
    } else {
      setEndTime(selectedDate);
    }
  };

  const saveSchedule = async () => {
    if (!range.start || !range.end) {
      Alert.alert("Select a valid date range");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        schedules: [
          {
            from: range.start,
            to: range.end,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        ],
      });

      Alert.alert("Congratulations!", "Your schedule has been saved!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="period"
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 15,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        style={{ backgroundColor: Theme.primary, padding: 10, borderRadius: 30, marginBottom: 10 }}
        onPress={handleMonthSelect}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18, fontWeight: "800" }}>Select Full Current Month</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: Theme.primary, padding: 10, borderRadius: 30, marginBottom: 10 }}
        onPress={() => setShowTimePicker("start")}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18, fontWeight: "800" }}>Pick Start Time</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: Theme.primary, padding: 10, borderRadius: 30, marginBottom: 10 }}
        onPress={() => setShowTimePicker("end")}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18, fontWeight: "800" }}>Pick End Time</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={showTimePicker === "start" ? startTime : endTime}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <View style={{ marginVertical: 20 }}>
        <Paragraph style={{fontSize: 18}}>Selected Range: {range.start} → {range.end || "..."}</Paragraph>
        <Paragraph style={{fontSize: 18}}>Start Time: {startTime.toLocaleTimeString()}</Paragraph>
        <Paragraph style={{fontSize: 18}}>End Time: {endTime.toLocaleTimeString()}</Paragraph>
      </View>

      <ActionPrimaryButton
        buttonTitle="Save Schedule"
        onSubmit={saveSchedule}
        isLoading={loading}
      />
    </View>
  );
};

export default CalendarComponent;
