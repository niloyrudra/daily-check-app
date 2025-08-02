import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

import ArrowButton from "@/components/ArrowButton";
import RenderContactInput from "@/components/auth/RenderContactInput";
import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import GreetingCard from "@/components/GreetingCard";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { BASE_URL, getErrorMessage } from "@/utils";

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
        Alert.alert("Sorry!", "Your information failed to store. Please try again later.");
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
          : 
            (
              <RenderContactInput
                contactKey="contact1"
                step={step1}
                storedName={contact1Name}
                setStoredName={setContact1Name}
                storedPhone={contact1Phone}
                setStoredPhone={setContact1Phone}
                stepSetter={setStep1}
                loading={loading1}
                handleSendCode={handleSendCode}
                handleVerifyCode={handleVerifyCode}
                isModifiying={false}
              />
            )
        }

        <View style={{width: "100%", height:0, borderBottomWidth: 1, borderBottomColor: Theme.borderColor, marginVertical: 30}} />
        
        { isVerified2
          ? (<GreetingCard greet="Your secondary contact&apos;s phone number is verified." />)
          : 
            (
              <RenderContactInput
                contactKey="contact2"
                step={step2}
                storedName={contact2Name}
                setStoredName={setContact2Name}
                storedPhone={contact2Phone}
                setStoredPhone={setContact2Phone}
                stepSetter={setStep2}
                loading={loading2}
                handleSendCode={handleSendCode}
                handleVerifyCode={handleVerifyCode}
                isModifiying={false}
              />
            )
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