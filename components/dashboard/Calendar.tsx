import { auth, db } from "@/config/firebase";
import SIZES from "@/constants/size";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Text as RNText, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import TitleComponent from "../TitleComponent";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";
import DropDownComponent from "../form-components/DropDownComponent";
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
    time?: string;
  };
}

const CalendarComponent: React.FC<CalendarProps> = ({ onModalHandler, userData }) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [pendingDates, setPendingDates] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReset, setLoadingReset] = useState<boolean>(false);
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState<dayjs.Dayjs>(dayjs());

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
    const isAlreadySaved = markedDates[selected];
    const isPending = pendingDates.includes(selected);

    if (isAlreadySaved) {
      setMarkedDates((prev) => {
        const updated = { ...prev };
        delete updated[selected];
        return updated;
      });
    } else if (isPending) {
      setPendingDates((prev) => prev.filter((d) => d !== selected));
    } else {
      setPendingDates((prev) => [...prev, selected]);
    }
  };

  const applyTimeToPendingDates = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowTimePicker(false);

    const time = dayjs(selectedDate).format("hh:mm A");
    const updates: MarkedDates = {};

    pendingDates.forEach((date) => {
      updates[date] = {
        selected: true,
        marked: true,
        color: Theme.primary,
        textColor: "#fff",
        time,
      };
    });

    setMarkedDates((prev) => ({ ...prev, ...updates }));
    setPendingDates([]);
  };

  const handleBulkSelect = (dates: string[]) => {
    const filtered = dates.filter((d) => !markedDates[d] && !pendingDates.includes(d));
    setPendingDates((prev) => [...prev, ...filtered]);
  };

  const handleMonthSelect = () => {
    const firstDay = currentVisibleMonth.startOf("month");
    const lastDay = currentVisibleMonth.endOf("month");
    const today = dayjs();
    const monthDays: string[] = [];

    for (let i = 0; i <= lastDay.diff(firstDay, "day"); i++) {
      const date = firstDay.add(i, "day");
      if (date.isBefore(today, "day")) continue;
      monthDays.push(date.format("YYYY-MM-DD"));
    }

    handleBulkSelect(monthDays);
  };

  const selectWeekExcludingWeekends = () => {
    const start = currentVisibleMonth.startOf("week").add(1, "day");
    const week: string[] = [];

    for (let i = 0; i < 7; i++) {
      const current = start.add(i, "day");
      if (current.day() === 0 || current.day() === 6 || current.isBefore(dayjs(), "day")) continue;
      week.push(current.format("YYYY-MM-DD"));
    }

    handleBulkSelect(week);
  };

  const resetCalendar = async () => {

    try {
      setLoadingReset(true)
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        "automation.selectedDates": [],
      });
      setMarkedDates({});
      setPendingDates([]);

      Alert.alert("Your scheduled dates are reset!")
    }
    catch(error: any) {
      console.log("Failed to reset the database!", error.message)
      Alert.alert("Failed to reset the database!")
      setLoadingReset(false)
    }
    finally {
      setLoadingReset(false)
    }

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

     
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc?.data();

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

      await updateDoc(userRef, {
        "automation.selectedDates": formatted,
      });

      if( userData ) {
        const {cat, dog, children, otherPet, extra} = userData?.dependents
        if (!cat && !dog && !children && !otherPet && !extra) {
          onModalHandler();
        }
        // else Alert.alert("Value added!")
      }
      
      Alert.alert("Your schedule has been recorded. You will be receiving texts as requested");

    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, gap: 20 }}>
      <Calendar
        onDayPress={handleDayPress}
        onMonthChange={(month) => setCurrentVisibleMonth(dayjs(`${month.year}-${month.month}-01`))}
        markingType="period"
        minDate={dayjs().format("YYYY-MM-DD")}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          borderColor: Theme.primary
        }}
        dayComponent={({ date }) => {
          if (!date) return null;
          const { dateString } = date;
          const today = dayjs().startOf("day");
          const isPast = dayjs(dateString).isBefore(today, "day");

          const marking = markedDates[dateString];
          const isSelected = !!marking;
          const isPending = pendingDates.includes(dateString);

          return (
            <TouchableOpacity
              onPress={() => !isPast && handleDayPress(date)}
              activeOpacity={isPast ? 1 : 0.5}
            >
              <View style={{ alignItems: "center", padding: 4 }}>
                <RNText
                  style={{
                    color: isPast ? "#bbb" : isSelected || isPending ? "#fff" : Theme.primary,
                    backgroundColor: isSelected || isPending ? Theme.primary : "transparent",
                    borderRadius: 20,
                    padding: 5,
                    width: 28,
                    textAlign: "center",
                  }}
                >
                  {date.day}
                </RNText>
                {(marking?.time || isPending) && (
                  <RNText style={{ fontSize: 10, color: Theme.primary, textAlign: "center" }}>
                    {marking?.time || "?"}
                  </RNText>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={{marginVertical: 10}}>
        <RNText style={{color: Theme.primary, fontSize: SIZES.contentText, lineHeight: 24}}>Tap dates to toggle. Use buttons for bulk selection or reset. Click "Save Schedule" then return to calendar to set a different time.</RNText>
      </View>

      <ActionButton title="Select Full Month" onPress={handleMonthSelect} mode="elevated" buttonColor={Theme.accent} />
      <ActionButton title="Select This Week" onPress={selectWeekExcludingWeekends} mode="elevated" buttonColor={Theme.accent} />
      <ActionButton title="Reset Calendar" onPress={resetCalendar} mode="outlined" buttonColor={Theme.accent} loading={loadingReset} />
      
      <ActionButton title="Apply Time to Selected Dates" onPress={() => setShowTimePicker(true)} mode="elevated" buttonColor={Theme.accent} />
      
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          onChange={applyTimeToPendingDates}
        />
      )}

      {/* <Divider style={{ backgroundColor: Theme.primary }} /> */}

      {userData?.membershipPlan?.plan === 'basic' && (
        <View style={{gap:10, marginBottom: 10}}>
          <TitleComponent title="Your Response Time:" />
          <DropDownComponent />
        </View>
      )}

      <View style={{alignItems: "center" }}>
        <ActionPrimaryButton buttonTitle="Save Schedule" onSubmit={saveSchedule} isLoading={loading} />
      </View>
    </View>
  );
};

export default CalendarComponent;