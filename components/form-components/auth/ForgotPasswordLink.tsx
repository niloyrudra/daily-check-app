import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const ForgotPasswordLink = () => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "flex-end"              
            }}
        >
            <Link
                href="/(auth)/forgot-password"
                style={{
                    fontSize: 14,
                }}
            >Forgot Password?</Link>
        </View>
    );
}
export default ForgotPasswordLink;