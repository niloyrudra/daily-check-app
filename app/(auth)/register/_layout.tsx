import { Theme } from "@/constants/theme";
import { Stack } from "expo-router";

const RegisterLayout = () => (
    <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: Theme.background
            }
        }}
        initialRouteName="index"
    >
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="signup" options={{headerShown: false}} />
        <Stack.Screen name="onboarding-three" options={{headerShown: false}} />
        <Stack.Screen name="verify-email" options={{headerShown: false}} />
        <Stack.Screen name="verify-phone" options={{headerShown: false}} />
        <Stack.Screen name="contacts-verification" options={{headerShown: false}} />
        <Stack.Screen name="opt-in" options={{headerShown: false}} />
        <Stack.Screen name="membership" options={{headerShown: false}} />
    </Stack>
);

export default RegisterLayout;