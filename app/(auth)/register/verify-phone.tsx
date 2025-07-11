import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from "yup";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import SIZES from "@/constants/size";
import STYLES from "@/constants/styles";
import { getErrorMessage } from "@/utils";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";

// Yup Validation Schema
const phoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format (e.g. +1234567890)")
    .required("Phone number is required"),
  code: Yup.string()
    .min(4, "Code too short")
    .max(8, "Code too long"),
});

const PhoneAuthScreen: React.FC = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingResend, setLoadingResend] = useState<boolean>(false);
  const [step, setStep] = useState<"enterPhone" | "enterCode">("enterPhone");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Send OTP handler
  const handleSendCode = async (phone: string) => {
    if (!user) return Alert.alert("Invalid User");
    setLoading(true);
    try {
      setPhoneNumber(phone);

      const response = await fetch(`${BASE_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type: "user" }),
      });

      const data = await response.json();

      // console.log(data)

      if (!data.success) {
        return Alert.alert("Error", getErrorMessage(data.error || data));
      }

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          phoneNumber: phone,
          phoneNumberVerified: false,
        });

        setStep("enterCode");
      } catch (err) {
        console.error("Firestore update error:", err);
        Alert.alert("Sorry!", "Your information failed to store in the Database.");
      }

    } catch (error) {
      console.error("Send OTP failed:", error);
      Alert.alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

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

      // console.log(data)

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
    if (!trimmedCode || trimmedCode.length < 4) {
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
      router.push("/(auth)/register/contacts-verification");
    } catch (error) {
      console.error("Verify OTP failed:", error);
      Alert.alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Render phone input view
  const renderPhoneInput = (values: any, handleChange: any, errors: any, touched: any) => (
    <View style={[STYLES.formGroup, { alignItems: "center" }]}>
      <Text style={STYLES.formLabel}>Your Phone Number:</Text>
      <TextInputComponent
        placeholder="+1234567890"
        value={values.phone}
        onChange={handleChange("phone")}
        keyboardType="phone-pad"
        inputMode="tel"
        isPassword={false}
      />
      {touched.phone && errors.phone && <Text style={STYLES.errorMessage}>{errors.phone}</Text>}

      <ActionPrimaryButton
        buttonTitle="Send Code"
        isLoading={loading}
        onSubmit={async () => {
          try {
            await phoneSchema.validateAt("phone", values);
            handleSendCode(values.phone);
          } catch (validationError: any) {
            Alert.alert("Validation Error", validationError.message);
          }
        }}
      />
    </View>
  );

  // Render code input view
  const renderCodeInput = (values: any, handleChange: any, errors: any, touched: any) => (
    <View style={STYLES.formGroup}>
      <Text style={STYLES.formLabel}>Enter Code:</Text>
      <TextInputComponent
        placeholder="123456"
        keyboardType="number-pad"
        inputMode="numeric"
        value={values.code}
        onChange={handleChange("code")}
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

  return (
    <AuthScreenLayout title="Phone Number Verification">
      <SkipButton onPress={() => router.push("/(auth)/register/contacts-verification")} />
      <Formik
        initialValues={{ phone: "", code: "" }}
        validationSchema={phoneSchema}
        onSubmit={() => {}}
      >
        {({ handleChange, values, errors, touched }) => (
          <View style={STYLES.childContentCentered}>
            {step === "enterPhone"
              ? renderPhoneInput(values, handleChange, errors, touched)
              : renderCodeInput(values, handleChange, errors, touched)}
          </View>
        )}
      </Formik>
    </AuthScreenLayout>
  );
};

export default PhoneAuthScreen;