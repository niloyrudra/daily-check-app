import { auth } from '@/config/firebase';
import { Theme } from '@/constants/theme';
import { BASE_URL } from '@/utils';
import React from 'react';
import { Alert } from 'react-native';
import ActionButton from './ActionButton';

const PausAndResumeServiceButton = () => {
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    // const [isResumed, setIsResumed] = React.useState<boolean>(false);
    const [loadingPauseAction, setLoadingPauseAction] = React.useState<boolean>(false);
    const [loadingResumeAction, setLoadingResumeAction] = React.useState<boolean>(false);
    
    const pauseServiceActionHandler = async () => {
        setIsPaused( prevValue => prevValue = !prevValue )
        try {
            setLoadingPauseAction(true)
            const user = auth.currentUser;
            if (!user) throw new Error("Not logged in");
            // const userRef = doc(db, "users", user.uid);
            // await updateDoc(userRef, {
            //   "membershipPlan.status": isPaused ? "paused" : "active",
            // });
            const response = await fetch(`${BASE_URL}/api/pause-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error:', errorText);
                throw new Error(errorText || 'Server error occurred');
            }

            const successMessage = await response.text();
            console.log('✅', successMessage);
            // Optionally update your UI state here
            Alert.alert(successMessage);
        }
        catch(error: any) {
            console.error('❌ Network or other error:', error.message);
            Alert.alert(`Failed to pause subscription: ${error.message}`);

            setLoadingPauseAction(false)
        }
        finally {
            setLoadingPauseAction(false)
        }
    }

    const resumeServiceActionHandler = async () => {
        setIsPaused( prevValue => prevValue = !prevValue )
        try {
            setLoadingResumeAction(true)
            const user = auth.currentUser;
            if (!user) throw new Error("Not logged in");

            const response = await fetch(`${BASE_URL}/api/resume-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error:', errorText);
                throw new Error(errorText || 'Server error occurred');
            }

            const successMessage = await response.text();
            console.log('✅', successMessage);
            // Optionally update your UI state here
            Alert.alert(successMessage);
        }
        catch(error: any) {
            console.error('❌ Network or other error:', error.message);
            Alert.alert(`Failed to resume subscription: ${error.message}`);

            setLoadingResumeAction(false)
        }
        finally {
            setLoadingResumeAction(false)
        }
    }

    return (
        <ActionButton
            title={ isPaused ? "Resume Service" : "Pause Service"}
            onPress={isPaused ? resumeServiceActionHandler : pauseServiceActionHandler }
            mode="elevated"
            buttonColor={Theme.accent}
            buttonStyle={{width: 250}}
            loading={isPaused ? loadingResumeAction : loadingPauseAction}
        />
    )
}

export default PausAndResumeServiceButton;