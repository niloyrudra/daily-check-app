import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, View } from "react-native";

import RenderCodeInput from "@/components/auth/RenderCodeInput";
import RenderPhoneInput from "@/components/auth/RenderPhoneInput";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import STYLES from "@/constants/styles";
import { phoneSchema } from "@/schemas";
import { BASE_URL, getErrorMessage } from "@/utils";

const PhoneAuthScreen: React.FC = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [loading, setLoading] = useState<boolean>(false);
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
              ? 
                (
                  <RenderPhoneInput
                    values={values}
                    handleChange={handleChange}
                    errors={errors}
                    touched={touched}
                    handleSendCode={handleSendCode}
                    loading={loading}
                  />
                )
              :  (
                  <RenderCodeInput
                    label="Enter Code"
                    values={values}
                    handleChange={handleChange}
                    phoneNumber={phoneNumber}
                    touched={touched}
                    errors={errors}
                  />
                )
            }
          </View>
        )}
      </Formik>
    </AuthScreenLayout>
  );
};

export default PhoneAuthScreen;