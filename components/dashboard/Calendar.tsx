import { auth, db } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Text as RNText, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Divider, Text } from "react-native-paper";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";
import DropDownComponent from "../form-components/DropDownComponent";
import TitleComponent from "../TitleComponent";
import ActionButton from "./ActionButton";

dayjs.extend(customParseFormat);

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
    time?: string; // ✅ NEW
  };
}

const CalendarComponent: React.FC<CalendarProps> = ({ onModalHandler, userData }) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<"start" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPreviousSchedule = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const selectedDates: { date: string; time: string }[] = data?.automation?.selectedDates || [];
          const restored: MarkedDates = {};

          selectedDates.forEach(({ date, time }) => {
            restored[date] = {
              selected: true,
              marked: true,
              color: Theme.primary,
              textColor: "#fff",
              time: dayjs(time).format("hh:mm A"),
            };
          });

          setMarkedDates(restored);
        }
      } catch (error: any) {
        console.error("Failed to fetch schedule", error);
      }
    };

    fetchPreviousSchedule();
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
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
          time: dayjs(startTime).format("hh:mm A"), // Assign current start time
        };
      }

      return updated;
    });
  };

  const handleMonthSelect = () => {
    const today = dayjs();
    const firstDay = today.startOf("month");
    const lastDay = today.endOf("month");
    const monthDays: MarkedDates = {};

    for (let i = 0; i <= lastDay.diff(firstDay, "day"); i++) {
      const date = firstDay.add(i, "day");
      if (date.isBefore(today, "day")) continue;

      const dateStr = date.format("YYYY-MM-DD");
      monthDays[dateStr] = {
        selected: true,
        marked: true,
        color: Theme.primary,
        textColor: "#fff",
        time: dayjs(startTime).format("hh:mm A"),
      };
    }

    setMarkedDates((prev) => ({ ...prev, ...monthDays }));
  };

  const selectWeekExcludingWeekends = (startDate: string) => {
    const start = dayjs(startDate);
    const today = dayjs();
    const week: MarkedDates = {};

    for (let i = 0; i < 7; i++) {
      const current = start.add(i, "day");
      const weekday = current.day();
      if (weekday === 0 || weekday === 6 || current.isBefore(today, "day")) continue;

      const dateStr = current.format("YYYY-MM-DD");
      week[dateStr] = {
        selected: true,
        marked: true,
        color: Theme.primary,
        textColor: "#fff",
        time: dayjs(startTime).format("hh:mm A"),
      };
    }

    setMarkedDates((prev) => ({ ...prev, ...week }));
  };

  const resetCalendar = () => {
    setMarkedDates({});
    setStartTime(new Date());
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowTimePicker(null);
    if (showTimePicker === "start") {
      setStartTime(selectedDate);

      // Apply to all selected dates
      setMarkedDates((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((date) => {
          updated[date].time = dayjs(selectedDate).format("hh:mm A");
        });
        return updated;
      });
    }
  };

  const getSelectedRange = () => {
    const dates = Object.keys(markedDates).sort();
    return {
      start: dates[0] || null,
      end: dates[dates.length - 1] || null,
    };
  };

  const saveSchedule = async () => {
    const entries = Object.entries(markedDates);
    if (entries.length === 0) {
      Alert.alert("Select at least one date");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const userRef = doc(db, "users", user.uid);

      const formatted = entries.map(([date, data]) => {
        const timeStr = data.time;

        if (!timeStr || typeof timeStr !== "string") {
          throw new Error(`Invalid or missing time for date: ${date}`);
        }

        const dateTime = dayjs(`${date} ${timeStr}`, "YYYY-MM-DD hh:mm A");

        if (!dateTime.isValid()) {
          throw new Error(`Could not parse datetime: ${date} ${timeStr}`);
        }

        return {
          date,
          time: dateTime.toISOString(),
        };
      });

      console.log("✅ Final payload to Firestore:", formatted);

      await updateDoc(userRef, {
        "automation.selectedDates": formatted,
      });

      Alert.alert("Success", "Your schedule has been saved.");
      onModalHandler();
    } catch (error: any) {
      console.error("❌ Save Error:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const { start, end } = getSelectedRange();

  return (
    <View style={{ flex: 1, gap: 20 }}>
      <Calendar
        onDayPress={handleDayPress}
        markingType="period"
        minDate={dayjs().format("YYYY-MM-DD")}
        dayComponent={({ date }) => {
          
          if (!date) return null; // ✅ Safely handle undefined

          const { dateString, day } = date;
          const today = dayjs().startOf("day");
          const isPast = dayjs(dateString).isBefore(today, "day");

          const marking = markedDates[dateString];
          const isSelected = !!marking;

          return (
            <TouchableOpacity
              onPress={() => !isPast && handleDayPress(date)} // ❌ disable tap if past
              activeOpacity={isPast ? 1 : 0.5}
            >
              <View style={{ alignItems: "center", padding: 4 }}>
                <RNText
                  style={{
                    color: isPast ? "#bbb" : isSelected ? "#fff" : Theme.primary,
  
                    backgroundColor: isSelected ? Theme.primary : "transparent",
                    borderRadius: 20,
                    padding: 5,
                    width: 30,
                    textAlign: "center",
                    fontSize: 18
                  }}
                >
                  {date.day}
                </RNText>
                {marking?.time && (
                  <RNText style={{ fontSize: 10, color: Theme.primary }}>{marking.time}</RNText>
                )}
              </View>

            </TouchableOpacity>
          );
        }}
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
        title="Reset Calendar"
        onPress={resetCalendar}
        mode="outlined"
        buttonColor={Theme.accent}
      />

      <Divider style={{ backgroundColor: Theme.primary }} />

      <ActionButton
        title="Time You Get Our Text"
        onPress={() => setShowTimePicker("start")}
        mode="elevated"
        buttonColor={Theme.accent}
      />

      <Divider style={{ backgroundColor: Theme.primary }} />

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