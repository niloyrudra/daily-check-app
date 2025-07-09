import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import React from 'react';
import { Card } from "react-native-paper";

interface UserData {
    name?: string,
    email?: string,
    emailVerified: boolean,
}

const UserInfoComponent: React.FC<UserData> = ( {name, email, emailVerified} ) => {
  return (
    <Card style={[STYLES.card, {padding: 0}]}>
        <Card.Title
            title={name || email || "User"}
            subtitle={email ? `Email: ${email} ✅` : "Email: No Email ❌"}
            left={(props) => (<FontAwesome name="user-circle" size={40} color={Theme.primary} />)}
            titleStyle={{ color: Theme.text, fontSize: SIZES.title }}
            subtitleStyle={{ color: Theme.borderColor, fontSize: SIZES.contentText }}
        />
        {/* <Card.Title
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
        /> */}
    </Card>
  )
}

export default UserInfoComponent;