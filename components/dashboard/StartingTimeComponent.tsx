import { LabelValueOption } from '@/types';
import React from 'react';
import DropDownComponent from '../form-components/DropDownComponent';

const options: LabelValueOption[] = [
    { label: 'Daily at 12:00 AM', value: '00:00' },
    { label: 'Daily at 01:00 AM', value: '01:00' },
    { label: 'Daily at 02:00 AM', value: '02:00' },
    { label: 'Daily at 03:00 AM', value: '03:00' },
    { label: 'Daily at 04:00 AM', value: '04:00' },
    { label: 'Daily at 05:00 AM', value: '05:00' },
    { label: 'Daily at 06:00 AM', value: '06:00' },
    { label: 'Daily at 07:00 AM', value: '07:00' },
    { label: 'Daily at 08:00 AM', value: '08:00' },
    { label: 'Daily at 09:00 AM', value: '09:00' },
    { label: 'Daily at 10:00 AM', value: '10:00' },
    { label: 'Daily at 11:00 AM', value: '11:00' },
    { label: 'Daily at 12:00 PM', value: '12:00' },
    { label: 'Daily at 01:00 PM', value: '13:00' },
    { label: 'Daily at 02:00 PM', value: '14:00' },
    { label: 'Daily at 03:00 PM', value: '15:00' },
    { label: 'Daily at 04:00 PM', value: '16:00' },
    { label: 'Daily at 05:00 PM', value: '17:00' },
    { label: 'Daily at 06:00 PM', value: '18:00' },
    { label: 'Daily at 07:00 PM', value: '19:00' },
    { label: 'Daily at 08:00 PM', value: '20:00' },
    { label: 'Daily at 09:00 PM', value: '21:00' },
    { label: 'Daily at 10:00 PM', value: '22:00' },
    { label: 'Daily at 11:00 PM', value: '23:00' },
];

interface ComponentProps {
    existingData: string,
    handler: (e: string | undefined) => void
}

const StartingTimeComponent: React.FC<ComponentProps> = ({existingData="", handler}) => {
    
    const [value, setValue] = React.useState<string>(existingData);
    // const [loading, setLoading] = React.useState<boolean>(false);
    
    const startingTimeHandler = async (time: string) => {
        setValue(time)
        handler(time)
        // try {
        //     setLoading(true);
        //     setValue(time)
        //     const user = auth.currentUser;
        //     if (!user) throw new Error("Not logged in");

        //     const userRef = doc(db, "users", user.uid);
        //     await updateDoc(userRef, {
        //         'automation.startingTime': time 
        //     });

        //     Alert.alert("Thank you!", "You have successfully set your time.");

        // } catch (error: any) {
        //     Alert.alert("Sorry", "Something went wrong!");
        //     console.error("Error", error.message);
        // } finally {
        //     setLoading(false);
        // }
    }

    return (
        <DropDownComponent
            onSelectHanlder={startingTimeHandler}
            options={options}
            value={value}
            // loading={loading}
            title="At what time would you like us to text you daily:"
            placeholder="Select the starting time"
        />
    )
}

export default StartingTimeComponent;