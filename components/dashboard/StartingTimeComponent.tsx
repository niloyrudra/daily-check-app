import { auth, db } from '@/config/firebase'
import { LabelValueOption } from '@/types'
import { doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { Alert } from 'react-native'
import DropDownComponent from '../form-components/DropDownComponent'

const options: LabelValueOption[] = [
  { label: '1am', value: '01:00 am' },
  { label: '2am', value: '02:00 am' },
  { label: '3am', value: '03:00 am' },
  { label: '4am', value: '04:00 am' },
  { label: '5am', value: '05:00 am' },
  { label: '6am', value: '06:00 am' },
  { label: '7am', value: '07:00 am' },
  { label: '8am', value: '08:00 am' },
  { label: '9am', value: '09:00 am' },
  { label: '10am', value: '10:00 am' },
  { label: '11am', value: '11:00 am' },
  { label: '12am', value: '12:00 am' },
  { label: '1pm', value: '01:00 pm' },
  { label: '2pm', value: '02:00 pm' },
  { label: '3pm', value: '03:00 pm' },
  { label: '4pm', value: '04:00 pm' },
  { label: '5pm', value: '05:00 pm' },
  { label: '6pm', value: '06:00 pm' },
  { label: '7pm', value: '07:00 pm' },
  { label: '8pm', value: '08:00 pm' },
  { label: '9pm', value: '09:00 pm' },
  { label: '10pm', value: '10:00 pm' },
  { label: '11pm', value: '11:00 pm' },
  { label: '12pm', value: '12:00 pm' },
];

const StartingTimeComponent = () => {
    
    const [value, setValue] = React.useState<string | undefined>('1');
    const [loading, setLoading] = React.useState<boolean>(false);
    
    const startingTimeHandler = async (time: string | undefined) => {
        try {
            setLoading(true);
            setValue(time)
            const user = auth.currentUser;
            if (!user) throw new Error("Not logged in");

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                'automation.startingTime': time 
            });

            Alert.alert("Thank you!", "You have successfully set your time.");

        } catch (error: any) {
            Alert.alert("Sorry", "Something went wrong!");
            console.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropDownComponent
            onSelectHanlder={startingTimeHandler}
            options={options}
            value={value}
            loading={loading}
            title="At what time would you like us to text you daily:"
            placeholder="Select the starting time"
        />
    )
}

export default StartingTimeComponent;