import ArrowButton from "@/components/ArrowButton";
import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { auth, db } from "@/config/firebase";
import SIZES from "@/constants/size";
import { Theme } from "@/constants/theme";
import { Plan } from "@/types";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { getIdToken } from "firebase/auth";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";

const MembershipScreen: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const router = useRouter();

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
        <ActivityIndicator size="large" />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout title="Membership Plans" isScrollable={true}>

      <ArrowButton />

      {loading ? (
        <ActivityIndicator size="large" color={Theme.primary} />
      ) : (
        <View style={{gap: 40}}>
          <View style={{ gap: 20, borderWidth: 1, borderColor: Theme.primary, borderRadius: 8, padding: 15}}>
            <Text style={{fontSize: SIZES.contentText, color: Theme.primary}}>
              We will text you one time each day, at your appointed time. You pick how long we must wait for your answer (1, 2 OR 3 hours), if after your selected time frame, you have not texted &apos;YES&apos; back, we will text your emergency contacts to let them know. Basic Plan $0.99/mo billed annually $11.88 after free trial.
            </Text>
            <ActionPrimaryButton buttonTitle="Start your 7 day Free Trial" onSubmit={() => handleCheckout("basic")} />
          </View>
          
          {/* <View style={{height:0, width: "100%", borderBottomWidth: 1, borderBottomColor: Theme.primary, marginVertical: 30}} /> */}

          <View style={{ gap: 20, borderWidth: 1, borderColor: Theme.primary, borderRadius: 8, padding: 15}}>
            <Text style={{fontSize: SIZES.contentText, color: Theme.primary}}>
              We will text you 2 times each day, at your appointed time and 1 hour later, if after 2 hours and 2 texts, you have not texted &apos;YES&apos; back, we will call you to make sure you hear the phone ring. After you don&apos;t answer 2 texts and 1 phone call, we will text your emergency contacts to let them know. Premium Plan $1.99/mo billed annually $23.88 after free trial.
            </Text>
            <ActionPrimaryButton buttonTitle="Start your 7 day Free Trial" onSubmit={() => handleCheckout("premium")} />
          </View>
        </View>
      )}
    </AuthScreenLayout>
  );
};

export default MembershipScreen;