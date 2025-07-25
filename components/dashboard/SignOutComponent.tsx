import { auth } from '@/config/firebase';
import { Theme } from '@/constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';

const SignOutComponent = () => {
    const router = useRouter();
    // const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <>
        <TouchableOpacity
            onPress={async () => {
                try {
                    // setLoading(true)
                    await auth.signOut();
                    Alert.alert("You signed out!")
                    router.replace("/(auth)/login");
                }
                catch(error: any) {
                    Alert.alert("Something went wrong during signing out!")
                    // setLoading(false)
                }
            }}

            style={{
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 3
            }}
        >
            {/* <Ionicons name="trail-sign-outline" size={32} color={Theme.accent} /> */}
            <AntDesign name="logout" size={32} color={Theme.accent} />
        </TouchableOpacity>

        {/* <ActionButton
            title="Sign out"
            onPress={async () => {
                try {
                    setLoading(true)
                    await auth.signOut();
                    router.replace("/(auth)/login");
                }
                catch(error: any) {
                    setLoading(false)
                }
                finally {
                    setLoading(false)
                }
            }}
            mode="elevated"
            buttonColor={Theme.accent}
            loading={loading}
        /> */}
    </>
  )
}

export default SignOutComponent