import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import React from 'react';
import { View } from 'react-native';
import { Card, Text } from "react-native-paper";

interface UserPhoneNumberData {
    phoneNumber?: string,
    isVerified: boolean,
}

const UserPhoneNumberComponent: React.FC<UserPhoneNumberData> = ( {phoneNumber='',  isVerified} ) => {
  return (
    <Card style={STYLES.card} mode='contained'>
        {phoneNumber ? (
            <Card.Content style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 }}>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 20
                    }}
                >
                    <FontAwesome5 name="phone-alt" size={24} />
                    <Text style={{ color: Theme.text, fontSize: SIZES.contentText }}>{phoneNumber}</Text>
                </View>

                {isVerified ? (<FontAwesome5 name="check-circle" size={24} color="green" />) : (<MaterialCommunityIcons name="timer-sand-complete" size={24} color="orange" />)}
            </Card.Content>
        ) : (
            <Text variant="bodyMedium" style={{ color: "#aaa", fontSize: SIZES.contentText }}>No phone number is available.</Text>
        )}
    </Card>
  )
}

export default UserPhoneNumberComponent;