import { auth, db } from "@/config/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import React from "react";
import { Alert, View } from "react-native";

import RenderCodeInput from "@/components/auth/RenderCodeInput";
import RenderPhoneInput from "@/components/auth/RenderPhoneInput";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import STYLES from "@/constants/styles";
import { phoneSchema } from "@/schemas";
import { BASE_URL, getErrorMessage } from "@/utils";

const PhoneNumberModificationScreen: React.FC = () => {
  const router = useRouter();
  const { existingPhoneNumber } = useLocalSearchParams();
  const user = auth.currentUser;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingResend, setLoadingResend] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<"enterPhone" | "enterCode">("enterPhone");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");

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
      } catch (err) {
        console.error("Firestore update error:", err);
        Alert.alert("Sorry!", "Your information failed to store in the Database.");
      }

      setStep("enterCode");
    } catch (error) {
      console.error("Send OTP failed:", error);
      Alert.alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };


  // // Resend OTP handler
  // const handleResendCode = async () => {
  //   if (!user) return Alert.alert("Invalid User");
  //   setLoadingResend(true);
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/send-otp`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: phoneNumber, type: "user" }),
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       return Alert.alert("Sorry!", getErrorMessage(data.error || data));
  //     }

  //     try {
  //       const userRef = doc(db, "users", user.uid);
  //       await updateDoc(userRef, {
  //         phoneNumber: phoneNumber,
  //         phoneNumberVerified: false,
  //       });
  //     } catch (err) {
  //       console.error("Firestore update error:", err);
  //     }

  //     Alert.alert("New Code Sent", "Previous code is now invalid. Please use the new one.");
  //   } catch (error) {
  //     console.error("Resend OTP failed:", error);
  //     Alert.alert(getErrorMessage(error));
  //   } finally {
  //     setLoadingResend(false);
  //   }
  // };

  // // Verify OTP handler
  // const handleVerifyCode = async (code: string) => {
  //   if (!user) return Alert.alert("Invalid User");

  //   const trimmedCode = code.trim();
  //   if (!trimmedCode || trimmedCode.length < 4) {
  //     return Alert.alert("Validation Error", "Please enter a valid code.");
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/verify-otp`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: phoneNumber, otp: trimmedCode }),
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       throw new Error(data.message || "Invalid code");
  //     }

  //     try {
  //       const userRef = doc(db, "users", user.uid);
  //       await updateDoc(userRef, {
  //         phoneNumber,
  //         phoneNumberVerified: true,
  //       });
  //     } catch (err) {
  //       console.error("Firestore update error:", err);
  //       Alert.alert("Sorry!", "Server issue occurred.");
  //     }

  //     Alert.alert("Success", "Phone number verified!");
  //     router.push("/dashboard/home");
      
  //   } catch (error) {
  //     console.error("Verify OTP failed:", error);
  //     Alert.alert(getErrorMessage(error));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthScreenLayout title="Phone Number Modification">

      <SkipButton
        onPress={() => router.push("/dashboard/home")}
        title="CANCEL"
      />

      <Formik
        enableReinitialize
        initialValues={{ phone: existingPhoneNumber || "", code: "" }}
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

export default PhoneNumberModificationScreen;