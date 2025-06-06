import CalendarComponent from "@/components/dashboard/Calendar";
import ContactsInformationComponent from "@/components/dashboard/ContactsInformation";
import SectionTitle from "@/components/dashboard/SectionTitle";
import UserInfoComponent from "@/components/dashboard/UserInfo";
import UserPhoneNumberComponent from "@/components/dashboard/UserPhoneNumberComponent";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import SafeAreaLayout from "@/components/layout/SafeAreaLayout";
import { auth, db } from "@/config/firebase";
import SIZES from "@/constants/size";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
// console.log(user)
  const membershipCancellationHandler = async () => {
    try {
      setLoading(true)

      if (!userData) throw new Error("Not logged in");

      console.log("userData >>", userData)

      const response = await fetch(`${BASE_URL}/api/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: userData?.stripeSubscriptionId }),
      });

      const data = await response.json();

      console.log(data)
      
      // await updateDoc(userData, {
      //   membershipPlan: {
      //       plan: "",
      //       status: "canceled",
      //       since: Timestamp.fromDate(new Date())
      //     },
      // });
    }
    catch( error: any ) {
      console.error(error)
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        console.log(userDoc.data())
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <SafeAreaLayout>
        <ActivityIndicator size="large" color={Theme.accent} />
      </SafeAreaLayout>
    );
  }

  return (
    <SafeAreaLayout>

      <ScrollView style={{ flex: 1 }}>

        {/* Welcome Section */}
        <WelcomeSection name={userData?.name} email={userData?.email} />

        {/* User Info Card */}
        <UserInfoComponent name={userData?.name} email={userData?.email} emailVerified={userData?.emailVerified || false} />

        {/* Phone Number Status */}
        <SectionTitle title="Phone Number" />
        <UserPhoneNumberComponent phoneNumber={userData?.phoneNumber} phoneNumberVerified={userData?.phoneNumberVerified || false} />

        {/* Actions */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", duration: 500 }}
        >
          <Button
            mode="elevated"
            buttonColor={Theme.primary} //"#1E88E5"
            style={[{ marginBottom: 20 }]}
            onPress={() => router.push("/dashboard/modify-phone-number")}
          >
            <Text style={{fontSize: SIZES.title, color: "#FFFFFF", paddingVertical: 6}}>Modify Phone Number</Text>
            
          </Button>
        </MotiView>

        {/* Contact Information Status */}
        <SectionTitle title="Contact Information" />

        <ContactsInformationComponent
          contact1={userData?.contactNumbers?.contact1}
          contact2={userData?.contactNumbers?.contact2}
        />

        {/* Actions */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", duration: 500 }}
        >
          <Button
            mode="elevated"
            buttonColor={Theme.primary} //"#1E88E5"
            style={[{ marginBottom: 10 }]}
            onPress={() => router.push("/dashboard/modify-contact-numbers")}
          >
            <Text style={{fontSize: SIZES.title, color: "#FFFFFF", paddingVertical: 6}}>Modify Contact Details</Text>
            
          </Button>
          <Button
            mode="elevated"
            buttonColor={Theme.accent}
            onPress={async () => {
              await auth.signOut();
              router.replace("/(auth)/login");
            }}
          >
            <Text style={{fontSize: SIZES.title, color: "#FFFFFF", paddingVertical: 6}}>Signout</Text>
          </Button>
        </MotiView>


        <Divider style={{marginVertical: 30, backgroundColor: "#333" }} />

        {/* Scheduler Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", duration: 500 }}
        >
          <SectionTitle title="Set Your Schedule" />
          <CalendarComponent />
        </MotiView>

        <Divider style={{marginBottom: 30, marginTop: 10, backgroundColor: "#333" }} />

        {/* Cancel Membership Actions */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", duration: 500 }}
        >
          {loading ? 
            (<ActivityIndicator size="large" color={Theme.secondary} />) : (
              <Button
                mode="elevated"
                buttonColor={Theme.primary} //"#1E88E5"
                style={[{ marginBottom: 10 }, STYLES.boxShadow]}
                onPress={membershipCancellationHandler}
              >
                <Text style={{fontSize: SIZES.title, color: "#FFFFFF", paddingVertical: 6}}>Cancel Membership</Text>
                
              </Button>
            )
          }
        </MotiView>

      </ScrollView>

    </SafeAreaLayout>
  );
};

export default DashboardScreen;