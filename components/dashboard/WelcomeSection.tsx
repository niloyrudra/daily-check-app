import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import { MotiView } from 'moti';
import React from 'react';
import { Text } from "react-native-paper";

interface UserData {
    name?: string,
    email?: string
}

const WelcomeSection: React.FC<UserData> = ( {name, email} ) => {
  return (
    <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", duration: 500 }}
        style={{ marginBottom: 20 }}
    >
        <Text variant="titleLarge" style={{ color: Theme.text, fontSize: SIZES.header }}>Welcome,</Text>
        <Text variant="bodyMedium" style={{ color: "green", fontSize: SIZES.title }}> {/* "#aaa" */}
        {name || email || "User"}
        </Text>
    </MotiView>
  )
}

export default WelcomeSection