import ArrowButton from "@/components/ArrowButton";
import PlainTextLink from "@/components/form-components/auth/PlainTextLink";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import MembershipPlanOptionComponent from "@/components/MembershipPlanOptionComponent";
import { auth, db } from "@/config/firebase";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { Plan } from "@/types";
import Checkbox from "expo-checkbox";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { getIdToken } from "firebase/auth";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";

const MembershipScreen: React.FC = () => {

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user) {
          Alert.alert("Auth Error", "Please sign in again.");
          router.replace("/(auth)/login");
        } else {
          // 🔒 Force-refresh token right after auth state confirms
          await getIdToken(user, true);
          setAuthReady(true);
        }
      }
      catch( error: any ) {
        console.error( "On load Error:", error )
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCheckout = async (plan: Plan ) => {
    setLoading(true)
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User must be signed in");
      await fetch(`${BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plan,
          quantity: 1,
          userId: user.uid
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Open Stripe checkout URL
          Linking.openURL(data.url);

          const userRef = doc(db, "users", user.uid);

          updateDoc(userRef, {
            membershipPlan: {
              plan,
              status: "active",
              since: Timestamp.fromDate(new Date())
            }
          });

        } else {
          Alert.alert("Oops!", "Checkout unsuccessful.");
        }
      });
    }
    catch( error: any ) {
      console.error( error )
      Alert.alert("Oops!", "Checkout unsuccessful.");
    }
    finally {
      setLoading(false)
    }
  }

  if (!authReady) {
    return (
      <AuthScreenLayout title="Membership Plans">
        <View style={STYLES.childContentCentered}>
          <ActivityIndicator size="large" color={Theme.accent} />
        </View>
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout title="" isScrollable={true}>

      <ArrowButton />

      <View style={{ flexDirection: "row", gap: 15, marginBottom: 20}}>

        <Checkbox
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? Theme.accent : undefined}
        />
        <PlainTextLink text="Check out our" linkText="Terms & Conditions." route={"/(auth)/register/terms"} />
      </View>

      {loading ?
        (
          <View style={STYLES.childContentCentered}>
            <ActivityIndicator size="large" color={Theme.accent} />
          </View>
        ) : (
          <View style={{gap: 20}}>
            <MembershipPlanOptionComponent
              title="Basic"
              detailedText="We will text you one time each day, at your appointed time. You pick how long we must wait for your answer (1, 2 OR 3 hours). If after your selected time frame, you have not texted &apos;YES&apos; back, we will text your emergency contact to let them know. Basic Plan $0.99/mo billed annually $11.88, plus tax, after free trial."
              buttonText="Start your 7 day Free Trial"
              handler={() => handleCheckout("basic")}
              disabled={!isChecked}
            />
            
            <MembershipPlanOptionComponent
              title="Premium"
              detailedText="We will text you 2 times each day, at your appointed time and 1 hour later. If after 2 hours and 2 texts, you have not texted &apos;YES&apos; back, we will call you to make sure you hear the phone ring. We will text your emergency contacts to let them know. Premium Plan $2.99/mo billed annually $35.88, plus tax, after free trial."
              buttonText="Start your 7 day Free Trial"
              handler={() => handleCheckout("premium")}
              disabled={!isChecked}
            />
            
          </View>
        )
      }
    </AuthScreenLayout>
  );
};

export default MembershipScreen;