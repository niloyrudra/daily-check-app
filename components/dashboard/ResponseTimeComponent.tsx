import { auth, db } from '@/config/firebase'
import { LabelValueOption } from '@/types'
import { doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { Alert } from 'react-native'
import DropDownComponent from '../form-components/DropDownComponent'

const options: LabelValueOption[] = [
  { label: '1 hr', value: '1' },
  { label: '2 hrs', value: '2' },
  { label: '3 hrs', value: '3' },
];

const ResponseTimeComponent = () => {
    
    const [value, setValue] = React.useState<string | undefined>('1');
    const [loading, setLoading] = React.useState<boolean>(false);
    
    const responseTimeHandler = async (time: string | undefined) => {
        try {
            setLoading(true);
            setValue(time)
            const user = auth.currentUser;
            if (!user) throw new Error("Not logged in");

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                'automation.responseTime': time 
            });

            Alert.alert("Thank you!", "You have successfully set your response Time to our text message.");

        } catch (error: any) {
            Alert.alert("Sorry", "Something went wrong!");
            console.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropDownComponent
            onSelectHanlder={responseTimeHandler}
            options={options}
            value={value}
            loading={loading}
            placeholder="Select your response time"
            title="Waiting period before we alert your safety contact(s):" // "Your Response Time:"
        />
    )
}

export default ResponseTimeComponent