import { auth, db } from '@/config/firebase';
import { Theme } from '@/constants/theme';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';

const numberList = [
  { label: '1 hr', value: '1' },
  { label: '2 hrs', value: '2' },
  { label: '3 hrs', value: '3' },
];

const NumberDropdown: React.FC = () => {
  // const [showDropDown, setShowDropDown] = useState(false);
  const [value, setValue] = useState<string | undefined>('1');
  const [loading, setLoading] = useState<boolean>(false);

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
    <View style={{gap:20 }}>
      <View style={{ backgroundColor: '#FFFFFF' }}>

        <Dropdown
          label="Select your response time"
          placeholder="Select your response time"
          mode="outlined" // "outlined" / "flat"
          value={value}
          options={numberList}
          onSelect={responseTimeHandler}
          maxMenuHeight={300}
          menuContentStyle={{
            borderColor: Theme.primary,
            borderRadius: 30
          }}
        />
      </View>

      {loading && (<ActivityIndicator size="large" color={Theme.accent} />)}

    </View>
  );
};

export default NumberDropdown;