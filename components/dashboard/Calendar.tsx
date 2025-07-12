import { auth, db } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Divider, Text } from "react-native-paper";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";
import DropDownComponent from "../form-components/DropDownComponent";
import TitleComponent from "../TitleComponent";
import ActionButton from "./ActionButton";

interface CalendarProps {
  onModalHandler: () => void;
  userData: UserData;
}

interface MarkedDates {
  [date: string]: {
    selected: boolean;
    marked?: boolean;
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

const CalendarComponent: React.FC<CalendarProps> = ({ onModalHandler, userData }) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<"start" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔁 Load previously saved dates from Firestore
  useEffect(() => {
    const fetchPreviousSchedule = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const selectedDates: string[] = data?.automation?.selectedDates || [];
          const time = data?.automation?.startingTime;

          const restored: MarkedDates = {};
          selectedDates.forEach((date) => {
            restored[date] = {
              selected: true,
              marked: true,
              color: Theme.primary,
              textColor: "#fff",
            };
          });

          setMarkedDates(restored);
          if (time) setStartTime(new Date(time));
        }
      } catch (error: any) {
        console.error("Failed to fetch schedule", error);
      }
    };

    fetchPreviousSchedule();
  }, []);

  // 🔘 Toggle day selection
  const handleDayPress = (day: DateObject) => {
    const selected = day.dateString;

    setMarkedDates((prev) => {
      const isSelected = !!prev[selected];
      const updated = { ...prev };

      if (isSelected) {
        delete updated[selected];
      } else {
        updated[selected] = {
          selected: true,
          marked: true,
          color: Theme.primary,
          textColor: "#fff",
        };
      }

      return updated;
    });
  };

  // 📅 Select all days of the current month
  const handleMonthSelect = () => {
    const today = dayjs();
    const firstDay = today.startOf("month");
    const lastDay = today.endOf("month");

    const monthDays: MarkedDates = {};
    for (let i = 0; i <= lastDay.diff(firstDay, "day"); i++) {
      const date = firstDay.add(i, "day");
      if (date.isBefore(today, 'day')) continue; // 🚫 skip past dates

      const dateStr = date.format("YYYY-MM-DD");
      monthDays[dateStr] = {
        selected: true,
        marked: true,
        color: Theme.primary,
        textColor: "#fff",
      };
    }

    setMarkedDates((prev) => ({ ...prev, ...monthDays }));
  };


  // 📆 Select current week (excluding weekends)
  const selectWeekExcludingWeekends = (startDate: string) => {
    const start = dayjs(startDate);
    const today = dayjs(); // 🔐 today's date for filtering
    const week: MarkedDates = {};

    for (let i = 0; i < 7; i++) {
      const current = start.add(i, "day");
      const weekday = current.day(); // 0 = Sunday, 6 = Saturday

      // 🚫 skip weekends & past dates
      if ((weekday === 0 || weekday === 6) || current.isBefore(today, 'day')) continue;

      const dateStr = current.format("YYYY-MM-DD");
      week[dateStr] = {
        selected: true,
        marked: true,
        color: Theme.primary,
        textColor: "#fff",
      };
    }

    setMarkedDates((prev) => ({ ...prev, ...week }));
  };


  // 🔄 Reset calendar
  const resetCalendar = () => {
    setMarkedDates({});
    setStartTime(new Date());
  };

  // 🕐 Time picker handler
  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowTimePicker(null);
    if (showTimePicker === "start") {
      setStartTime(selectedDate);
    }
  };

  // 📌 Get display range from selected dates
  const getSelectedRange = () => {
    const dates = Object.keys(markedDates).sort();
    return {
      start: dates[0] || null,
      end: dates[dates.length - 1] || null,
    };
  };

  // 💾 Save to Firestore
  const saveSchedule = async () => {
    const selectedDates = Object.keys(markedDates);
    if (selectedDates.length === 0) {
      Alert.alert("Select at least one date");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        "automation.selectedDates": selectedDates,
        "automation.startingTime": startTime.toISOString(),
      });

      Alert.alert("Success", "Your schedule has been saved.");
      onModalHandler();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const { start, end } = getSelectedRange();

  return (
    <View style={{ flex: 1, gap: 20 }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="period"
        minDate={dayjs().format("YYYY-MM-DD")} // ✅ disables past dates
        style={{
          borderWidth: 1,
          borderColor: Theme.primary,
          borderRadius: 15,
        }}
      />

      <Text variant="bodyMedium" style={{ fontSize: 18, color: Theme.primary }}>
        Tap dates to toggle. Use buttons for bulk selection or reset.
      </Text>

      <ActionButton
        title="Select Full Month"
        onPress={handleMonthSelect}
        mode="elevated"
        buttonColor={Theme.accent}
      />

      <ActionButton
        title="Select This Week"
        onPress={() => {
          const monday = dayjs().startOf("week").add(1, "day");
          selectWeekExcludingWeekends(monday.format("YYYY-MM-DD"));
        }}
        mode="elevated"
        buttonColor={Theme.accent}
      />

      <ActionButton
        title="Pick Start Time"
        onPress={() => setShowTimePicker("start")}
        mode="elevated"
        buttonColor={Theme.accent}
      />

      <Divider style={{backgroundColor: Theme.primary}} />

      <ActionButton
        title="Reset Calendar"
        onPress={resetCalendar}
        mode="outlined"
        buttonColor={Theme.accent}
      />

      <Divider style={{backgroundColor: Theme.primary}} />

      {userData?.membershipPlan?.plan === "basic" && (
        <View style={{ gap: 10 }}>
          <TitleComponent title="Your Response Time:" />
          <DropDownComponent />
        </View>
      )}

      {showTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <View style={{ gap: 5 }}>
        <Text variant="bodyMedium" style={{ fontSize: 18, color: Theme.primary }}>
          Selected Range: {start} → {end || "..."}
        </Text>
        <Text variant="bodyMedium" style={{ fontSize: 18, color: Theme.primary }}>
          Start Time: {startTime.toLocaleTimeString()}
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <ActionPrimaryButton
          buttonTitle="Save Schedule"
          onSubmit={saveSchedule}
          isLoading={loading}
        />
      </View>
    </View>
  );
};

export default CalendarComponent;