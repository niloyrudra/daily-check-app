import { Theme } from '@/constants/theme';
import { Stack } from 'expo-router';

const DashboardLayout = () => {
    return (
        <Stack
            screenOptions={{
                contentStyle: {
                    backgroundColor: Theme.background
                }
            }}
            initialRouteName='home'
        >
            <Stack.Screen name="home" options={{ headerShown:false }} />
            <Stack.Screen name="schedule" options={{ headerShown:false }} />
            {/* <Stack.Screen name="scheduler" options={{ headerShown:false }} /> */}
            <Stack.Screen name="modify-phone-number" options={{ headerShown:false }} />
            <Stack.Screen name="modify-contact-numbers" options={{ headerShown:false }} />
        </Stack>
    )
}
export default DashboardLayout;