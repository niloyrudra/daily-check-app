import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from "react-native-paper";

interface UserData {
    name?: string,
    email?: string,
    emailVerified: boolean,
}

const UserInfoComponent: React.FC<UserData> = ( {name, email, emailVerified} ) => {
  return (
    <Card style={[styles.card, {padding: 0}]}>
        <Card.Title
        title={name || email || "User"}
        subtitle={emailVerified ? "Email: Verified ✅" : "Email: Unverified ❌"}
        left={(props) => (
            // <Avatar.Image
            // {...props}
            // source={{ uri: "https://i.pravatar.cc/119" }}
            // size={50}
            // />
            <FontAwesome name="user-circle" size={40} color={Theme.primary} />
        )}
        titleStyle={{ color: Theme.text, fontSize: SIZES.title }}
        subtitleStyle={{ color: "#aaa", fontSize: SIZES.contentText }}
        />
    </Card>
  )
}

export default UserInfoComponent;

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