import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from "react-native-paper";

interface UserPhoneNumberData {
    phoneNumber?: string,
    phoneNumberVerified: boolean,
}

const UserPhoneNumberComponent: React.FC<UserPhoneNumberData> = ( {phoneNumber='',  phoneNumberVerified} ) => {
  return (
    <Card style={styles.card}>
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

            {phoneNumberVerified ? (
                <FontAwesome5 name="check-circle" size={24} color="green" />
            ) : (
            <MaterialIcons name="pending-actions" size={24} color="orange" />
            )}
        </Card.Content>
        
        ) : (
            <Text variant="bodyMedium" style={{ color: "#aaa", fontSize: SIZES.contentText }}>No phone number is verified yet.</Text>
        )}
    </Card>
  )
}

export default UserPhoneNumberComponent;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "transparent",
        marginBottom: 20,
        padding: 10,
        // borderWidth: 1,
        // borderColor: "#aaa"
        // elevation: 0,
        // boxShadow: "none"
    }
});