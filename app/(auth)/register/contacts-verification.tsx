import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from "yup";

import ArrowButton from "@/components/ArrowButton";
import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import GreetingCard from "@/components/GreetingCard";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { getErrorMessage } from "@/utils";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";

const phoneSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name requires two characters minimum.")
    .required("Name is required"),
  phone: Yup.string()
    .matches(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format (e.g. +1234567890)")
    .required("Phone is required"),
  code: Yup.string()
    .min(4, "Code too short")
    .max(8, "Code too long"),
});

const ContactsVerificationScreen: React.FC = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);

  const [isVerified1, setIsVerified1] = useState<boolean>(false);
  const [isVerified2, setIsVerified2] = useState<boolean>(false);

  const [step1, setStep1] = useState<"enterPhone" | "enterCode">("enterPhone");
  const [step2, setStep2] = useState<"enterPhone" | "enterCode">("enterPhone");

  const [contact1Name, setContact1Name] = useState<string>("");
  const [contact1Phone, setContact1Phone] = useState<string>("");
  const [contact2Name, setContact2Name] = useState<string>("");
  const [contact2Phone, setContact2Phone] = useState<string>("");

  const handleSendCode = async (phone: string, name: string, contactKey: "contact1" | "contact2") => {
    if (!user) return Alert.alert("Invalid user");
    if( contactKey === "contact1" ) setLoading1(true);
    else setLoading2(true);

    try {
      const response = await fetch(`${BASE_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type: contactKey }),
      });

      const data = await response.json();

      if (data?.error?.status === 400) {
        Alert.alert("Sorry!", getErrorMessage(data.error));
        // return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          [`contactNumbers.${contactKey}.contactName`]: name,
          [`contactNumbers.${contactKey}.phoneNumber`]: phone,
          [`contactNumbers.${contactKey}.verified`]: false,
        });

        if (contactKey === "contact1") {
          setContact1Name(name);
          setContact1Phone(phone);
          setStep1("enterCode");
        } else {
          setContact2Name(name);
          setContact2Phone(phone);
          setStep2("enterCode");
        }

      } catch (err) {
        console.error("Firestore update error:", err);
        Alert.alert("Sorry!", "Your information failed to store in the Database.");
      }

    } catch (error) {
      console.error("Send OTP failed:", error);
      Alert.alert(getErrorMessage(error));
    } finally {
      if( contactKey === "contact1" ) setLoading1(false);
      else setLoading2(false);
    }
  };

  const handleVerifyCode = async (code: string, contactKey: "contact1" | "contact2", phone: string) => {
    if (!user) return Alert.alert("Invalid user");
    if( contactKey === "contact1" ) setLoading1(true);
    else setLoading2(true);

    try {
      const response = await fetch(`${BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone, otp: code.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          [`contactNumbers.${contactKey}.verified`]: true,
        });

        Alert.alert("Success", `${contactKey === "contact1" ? "Primary" : "Secondary"} number verified!`);
        
        if (contactKey === "contact1") setIsVerified1(true);
        else setIsVerified2(true);

        // if (contactKey === "contact1") setStep1("enterCode");
        // else setStep2("enterCode");

        // router.push( "/(auth)/register/opt-in" );

      } else {
        Alert.alert("Sorry!", `Number verification is failed!`);
        throw new Error("Invalid code");
      }
    } catch (error) {
      console.error("Verify OTP failed:", error);
      Alert.alert(getErrorMessage(error));
    } finally {
      if( contactKey === "contact1" ) setLoading1(false);
      else setLoading2(false);
    }
  };

  const renderContactInput = (
    step: "enterPhone" | "enterCode",
    contactKey: "contact1" | "contact2",
    storedName: string,
    setStoredName: (v: string) => void,
    storedPhone: string,
    setStoredPhone: (v: string) => void,
    stepSetter: (v: "enterPhone" | "enterCode") => void
  ) => (
    <Formik
      initialValues={{ name: "", phone: "", code: "" }}
      validationSchema={phoneSchema}
      onSubmit={() => {}}
    >
      {({ handleChange, values, errors, touched }) => (
        <View style={[STYLES.formGroup, {alignItems: "center"}]}>
        
          <Text style={STYLES.formLabel}>
            {contactKey === "contact1" ? "Primary Contact" : "Secondary Contact"}
          </Text>

          {step === "enterPhone" ? (
            <>
              <TextInputComponent
                placeholder="Name"
                inputMode="text"
                autoCapitalize="words"
                value={values.name}
                onChange={handleChange("name")}
                isPassword={false}
              />
              {touched.name && errors.name && <Text style={STYLES.errorMessage}>{errors.name}</Text>}
              
              <TextInputComponent
                placeholder="+1234567890"
                keyboardType="phone-pad"
                inputMode="tel"
                value={values.phone}
                onChange={handleChange("phone")}
                isPassword={false}
              />
              {touched.phone && errors.phone && <Text style={STYLES.errorMessage}>{errors.phone}</Text>}
              
              <ActionPrimaryButton
                buttonTitle="Send Code"
                onSubmit={() => {
                  setStoredName(values.name);
                  setStoredPhone(values.phone);
                  handleSendCode(values.phone, values.name, contactKey);
                }}
                isLoading={(contactKey === "contact1" ? loading1 : loading2)}
              />
            </>
          ) : (
            <>
              <TextInputComponent
                placeholder="123456"
                keyboardType="number-pad"
                inputMode="numeric"
                value={values.code}
                onChange={handleChange("code")}
              />
              {touched.code && errors.code && <Text style={STYLES.errorMessage}>{errors.code}</Text>}

              <ActionPrimaryButton
                buttonTitle="Verify Code"
                onSubmit={() => handleVerifyCode(values.code, contactKey, storedPhone)}
                isLoading={(contactKey === "contact1" ? loading1 : loading2)}
              />
            </>
          )}
        </View>
      )}
    </Formik>
  );

  return (
    <AuthScreenLayout title="Safety Contacts" isScrollable={true}>
      
      <ArrowButton />

      <SkipButton onPress={() => router.push( "/(auth)/register/opt-in" )} />

      <View style={{marginBottom: 30}}>
        <Text style={[STYLES.formLabel, {fontWeight:"800", textAlign:"center"}]}>Text or call your safety contacts and let them know they will be receiving a verification code for you.</Text>
      </View>

      <View style={STYLES.container}>
        { isVerified1
          ? (<GreetingCard greet="Your primary contact&apos;s phone number is verified." />)
          : renderContactInput(step1, "contact1", contact1Name, setContact1Name, contact1Phone, setContact1Phone, setStep1)
        }

        <View style={{width: "100%", height:0, borderBottomWidth: 1, borderBottomColor: Theme.borderColor, marginVertical: 30}} />
        
        { isVerified2
          ? (<GreetingCard greet="Your secondary contact&apos;s phone number is verified." />)
          : renderContactInput(step2, "contact2", contact2Name, setContact2Name, contact2Phone, setContact2Phone, setStep2)
        }
      </View>

      <View style={{width: "100%", height:0, borderBottomWidth: 1, borderBottomColor: Theme.borderColor, marginVertical: 30}} />

      <ActionPrimaryButton
        buttonTitle="Continue"
        onSubmit={() => router.push( "/(auth)/register/opt-in" )}
      />

    </AuthScreenLayout>
  );
};

export default ContactsVerificationScreen;