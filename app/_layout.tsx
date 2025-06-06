import { Theme } from "@/constants/theme";
import { parse } from "expo-linking";
import { router, Stack } from "expo-router";
import React from "react";
import { Alert, Linking } from "react-native";

export default function RootLayout() {

  React.useEffect(() => {
    const handleDeepLink = (event: { url: any; }) => {
      const data = parse(event.url);
      console.log("Received deep link:", data);
      if (data.queryParams?.status === "success") {
        Alert.alert("Success", "Payment completed successfully!");
        router.replace("/dashboard/home"); // or wherever appropriate
      } else if (data.queryParams?.status === "cancel") {
        Alert.alert("Cancelled", "Payment was cancelled.");
      }
    };
  
    const subscription = Linking.addEventListener('url', handleDeepLink);
  
    // Check if app was launched by a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Theme.background
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
    </Stack>
  );
}
