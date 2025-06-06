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
        initialRouteName="login"
    >
        <Stack.Screen name="login" options={{headerShown: false}} />
        <Stack.Screen name="reset-password" options={{headerShown: false}} />
        <Stack.Screen name="forgot-password" options={{headerShown: false}} />
    </Stack>
);

export default RegisterLayout;