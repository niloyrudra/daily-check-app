import { auth, db } from "@/config/firebase";
import SIZES from "@/constants/size";
import STYLES from "@/constants/styles";
import { BASE_URL, getErrorMessage } from "@/utils";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { FormikHandlers } from "formik";
import React from "react";
import { Alert, Text, View } from "react-native";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";
import TextInputComponent from "../form-components/TextInputComponent";

interface RenderCodeInputProps {
    label: string,
    values: { code: string };
    handleChange: FormikHandlers["handleChange"]; // (field: string) => (value: string) => void;
    phoneNumber: string;
    touched: { code?: boolean };
    errors: { code?: string };
    isModifiying?: boolean
}

const RenderCodeInput: React.FC<RenderCodeInputProps> = ({
    label,
    values,
    handleChange,
    phoneNumber,
    touched,
    errors,
    isModifiying=false
}) => {
    const router = useRouter();
    const user = auth.currentUser;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadingResend, setLoadingResend] = React.useState<boolean>(false);

    // Resend OTP handler
    const handleResendCode = async () => {
        if (!user) return Alert.alert("Invalid User");
        setLoadingResend(true);
        try {
            const response = await fetch(`${BASE_URL}/api/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber, type: "user" }),
            });

            const data = await response.json();

            console.log(data)

            if (!data.success) {
                return Alert.alert("Sorry!", getErrorMessage(data.error || data));
            }

            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                phoneNumber: phoneNumber,
                phoneNumberVerified: false,
                });
            } catch (err) {
                console.error("Firestore update error:", err);
                Alert.alert("Sorry", "Your information is not updated.");
            }

            Alert.alert("New OTP Code Sent", "Previous code is now invalid. Please use the new one.");

        } catch (error) {
            console.error("Resend OTP failed:", error);
            Alert.alert(getErrorMessage(error));
        } finally {
            setLoadingResend(false);
        }
    };

    // Verify OTP handler
    const handleVerifyCode = async (code: string) => {
        if (!user) return Alert.alert("Invalid User");

        const trimmedCode = code.trim();
        if (!trimmedCode || trimmedCode.length < 6) {
            return Alert.alert("Validation Error", "Please enter a valid code.");
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber, otp: trimmedCode }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Invalid code");
            }

            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    phoneNumber,
                    phoneNumberVerified: true,
                });

            } catch (err) {
                console.error("Firestore update error:", err);
                Alert.alert("Sorry!", "Server issue occurred.");
            }

            Alert.alert("Success", "Phone number verified!");

            if ( isModifiying ) router.push("/dashboard/home");
            else router.push("/(auth)/register/contacts-verification");

        } catch (error) {
            console.error("Verify OTP failed:", error);
            Alert.alert(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={STYLES.formGroup}>
            <Text style={STYLES.formLabel}>{label}</Text>
            <TextInputComponent
                placeholder="123456"
                keyboardType="number-pad"
                inputMode="numeric"
                value={values.code}
                // onChange={handleChange("code")}
                onChange={(text) => handleChange("code")(text.trim())}
            />
            {touched.code && errors.code && <Text style={STYLES.errorMessage}>{errors.code}</Text>}

            <View style={{ flexDirection: "row", justifyContent: "space-between", width: SIZES.screenBodyWidth }}>
            
                <ActionPrimaryButton
                    buttonTitle="Verify Code"
                    isLoading={loading}
                    onSubmit={() => handleVerifyCode(values.code)}
                />

                <ActionPrimaryButton
                    buttonTitle="Resend Code"
                    isLoading={loadingResend}
                    onSubmit={handleResendCode}
                />

            </View>
        </View>
    );
};

export default RenderCodeInput;