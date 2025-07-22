import { auth } from '@/config/firebase';
import { Theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import ActionButton from './ActionButton';

const SignOutComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <ActionButton
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
    />
  )
}

export default SignOutComponent