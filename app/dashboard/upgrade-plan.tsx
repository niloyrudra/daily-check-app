import PlainTextLink from "@/components/form-components/auth/PlainTextLink";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import MembershipPlanOptionComponent from "@/components/MembershipPlanOptionComponent";
import { auth, db } from "@/config/firebase";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { Plan } from "@/types";
import { BASE_URL } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getIdToken } from "firebase/auth";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
// import { UserData } from "@/types";

const UpgradePlan: React.FC = () => {

  const {subscriptionId} = useLocalSearchParams()

  console.log("User's subscriptionId:", subscriptionId)

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
      await fetch(`${BASE_URL}/api/upgrade-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plan,
          subscriptionId: subscriptionId,
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

          Alert.alert("Congratulations!", "You are now our Premium Member.");

          router.push("/dashboard/home")

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
      <AuthScreenLayout title="Upgrade To Primium">
        <View style={STYLES.childContentCentered}>
          <ActivityIndicator size="large" color={Theme.accent} />
        </View>
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout title="" isScrollable={true}>

      {/* <ArrowButton /> */}

      <TouchableOpacity
        style={{
          position: "absolute",
          left: 0,
          top: 0
        }}
        onPress={() => router.push("/dashboard/home")}
      >
        <Ionicons name="arrow-back" size={24} color={Theme.primary} />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 15, marginBottom: 20}}>

        <Checkbox
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? Theme.accent : undefined}
        />
        <PlainTextLink
          text="Check out our"
          linkText="Terms & Conditions."
          route={"/(auth)/register/terms"}
          linkStyle={{textDecorationColor: Theme.primary, textDecorationStyle: "solid", textDecorationLine: "underline"}}
        />
      </View>

      {loading ?
        (
          <View style={STYLES.childContentCentered}>
            <ActivityIndicator size="large" color={Theme.accent} />
          </View>
        ) : (
            <MembershipPlanOptionComponent
              title="Premium"
              detailedText="We will text you 2 times each day, at your appointed time and 1 hour later if you didn't reply. If after 2 hours and 2 texts, you have not texted &apos;YES&apos; back, we will call you. If you don't answer, we will text your 2 safety contacts to let them know. Premium Plan $2.99/mo billed annually $35.88, plus tax, after free trial."
              buttonText="Start your 7 day Free Trial"
              handler={() => handleCheckout("premium")}
              disabled={!isChecked}
            />
        )
      }
    </AuthScreenLayout>
  );
};

export default UpgradePlan;