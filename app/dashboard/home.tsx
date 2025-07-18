import ActivityIndicatorComponent from "@/components/ActivityIndicatorComponent";
import ActionButton from "@/components/dashboard/ActionButton";
import CalendarComponent from "@/components/dashboard/Calendar";
import ContactsInformationComponent from "@/components/dashboard/ContactsInformation";
import ModalComponent from "@/components/dashboard/modals/ModalComponent";
import ModalMailerComponent from "@/components/dashboard/modals/ModalMailerComponent";
import MotiAnimatedSection from "@/components/dashboard/MotiAnimatedSection";
import SectionTitle from "@/components/dashboard/SectionTitle";
import UserInfoComponent from "@/components/dashboard/UserInfo";
import UserPhoneNumberComponent from "@/components/dashboard/UserPhoneNumberComponent";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import SafeAreaLayout from "@/components/layout/SafeAreaLayout";
import { auth, db } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import { BASE_URL } from "@/utils";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { ScrollView, View } from "react-native";
import { Divider, Provider as PaperProvider } from "react-native-paper";

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMailerVisible, setModalMailerVisible] = React.useState<boolean>(false);

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

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        // console.log(userDoc.data())
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return (<ActivityIndicatorComponent />);
  }

  return (
    <PaperProvider>

      <>
        <ModalComponent
          // dependents={userData.dependents}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        />

        <ModalMailerComponent
          userData={userData}
          visible={modalMailerVisible}
          onRequestClose={() => setModalMailerVisible(false)}
        />
        
        <SafeAreaLayout>
  
          <ScrollView style={{ flex: 1 }}>
  
            {/* Welcome Section */}
            <WelcomeSection name={userData?.name} email={userData?.email} />
  
            {/* User Info Card */}
            <UserInfoComponent name={userData?.name} email={userData?.email} emailVerified={userData?.emailVerified || false} />
  
            {/* Phone Number Status */}
            <SectionTitle title="Phone Number" />
            <UserPhoneNumberComponent phoneNumber={userData?.phoneNumber} isVerified={userData?.phoneNumberVerified || false} />
  
            {/* Actions */}
            <ActionButton
              title="Modify Phone Number"
              onPress={() => router.push({
                pathname: "/dashboard/modify-phone-number",
                params: {existingPhoneNumber: userData.phoneNumber}
              })}
              mode="elevated"

              loading={loading}
              buttonStyle={{marginBottom: 20, backgroundColor: Theme.accent}}
            />
  
            {/* Contact Information Status */}
            <SectionTitle title="Contact Information" />
  
            <ContactsInformationComponent
              contact1={userData?.contactNumbers?.contact1}
              contact2={userData?.contactNumbers?.contact2}
              membershipPlan={userData.membershipPlan.plan || ""}
            />
  
            {/* Actions */}
            <View style={{gap:20}}>
  
              <ActionButton
                title="Modify Contact Details"
                onPress={() => router.push({
                  pathname: "/dashboard/modify-contact-numbers",
                  params: {
                    c1Name: userData.contactNumbers.contact1.contactName,
                    c1PhnNum: userData.contactNumbers.contact1.phoneNumber,
                    c2Name: userData.contactNumbers.contact2.contactName,
                    c2PhnNum: userData.contactNumbers.contact2.phoneNumber,
                    membershipPlan: userData.membershipPlan.plan,
                  }
                })}
                mode="elevated"
                buttonColor={Theme.accent}
                loading={loading}
              />
  
              <ActionButton
                title="Sign out"
                onPress={async () => {
                  await auth.signOut();
                  router.replace("/(auth)/login");
                }}
                mode="elevated"
                buttonColor={Theme.accent}
                loading={loading}
              />
            </View>
  
            <Divider style={{marginVertical: 30, backgroundColor: Theme.primary }} />
  
            {/* Scheduler Section */}
            <MotiAnimatedSection>
              <SectionTitle title="Set Your Schedule" />
              <CalendarComponent onModalHandler={() => setModalVisible(true)} userData={userData} />
            </MotiAnimatedSection>
  
            <Divider style={{marginBottom: 30, marginTop: 10, backgroundColor: Theme.primary }} />
  
            {/* Contact Us Actions */}
            <ActionButton
              title="Contact Us"
              onPress={() => setModalMailerVisible(true)}
              mode="outlined"
              buttonColor={"Transparent"}
              buttonStyle={{borderWidth: 1, borderColor: Theme.accent, marginBottom: 20}}
              textStyle={{color: Theme.accent}}
              loading={loading}
            />

            {/* Cancel Membership Actions */}
            <ActionButton
              title="Cancel Membership"
              onPress={membershipCancellationHandler}
              mode="elevated"
              buttonColor={Theme.accent}
              loading={loading}
            />
  
            <View style={{height:30}} />
  
          </ScrollView>
  
        </SafeAreaLayout>
      </>
    </PaperProvider>
    );
};

export default DashboardScreen;