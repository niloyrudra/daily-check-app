import { auth, db } from "@/config/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, View } from "react-native";

import RenderContactInput from "@/components/auth/RenderContactInput";
import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import GreetingCard from "@/components/GreetingCard";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { BASE_URL, getErrorMessage } from "@/utils";
import { Divider } from "react-native-paper";


const ModifyContactNumbersScreen: React.FC = () => {
  const router = useRouter();
  const { c1Name, c1PhnNum, c2Name, c2PhnNum, membershipPlan } = useLocalSearchParams();
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
        Alert.alert(getErrorMessage(data.error));
        // return;
      }

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

        Alert.alert("Success", `${contactKey === "contact1" ? "Primary" : "Secondary"} number is verified!`);
        
        if (contactKey === "contact1") setIsVerified1(true);
        else setIsVerified2(true);

        // if (contactKey === "contact1") setStep1("enterCode");
        // else setStep2("enterCode");

        // router.push( "/dashboard/home" );

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
      
      <SkipButton
        onPress={() => router.push("/dashboard/home")}
        title="CANCEL"
      />

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
                cName={typeof c1Name === "string" ? c1Name : ""}
                cPhoneNumber={typeof c1PhnNum === "string" ? c1PhnNum : ""}
              />
            )
        }

        {
          membershipPlan && membershipPlan === "premium" && (
            <>
              <Divider style={{backgroundColor: Theme.primary}} />
              
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
                      cName={typeof c2Name === "string" ? c2Name : ""}
                      cPhoneNumber={typeof c2PhnNum === "string" ? c2PhnNum : ""}
                    />
                  )
              }
              
            </>
          )
        }
        
      </View>

      <Divider style={{backgroundColor: Theme.primary}} />

      <ActionPrimaryButton
        buttonTitle="Go To Dashboard"
        buttonStyle={{
          backgroundColor: Theme.accent
        }}
        onSubmit={() => router.push( "/dashboard/home" )}
      />

    </AuthScreenLayout>
  );
};

export default ModifyContactNumbersScreen;