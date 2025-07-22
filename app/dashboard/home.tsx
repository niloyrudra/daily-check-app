import ActivityIndicatorComponent from "@/components/ActivityIndicatorComponent";
import ActionButton from "@/components/dashboard/ActionButton";
import ActionOutlineButton from "@/components/dashboard/ActionOutlineButton";
import ContactsInformationComponent from "@/components/dashboard/ContactsInformation";
import ModalMailerComponent from "@/components/dashboard/modals/ModalMailerComponent";
import PausAndResumeServiceButton from "@/components/dashboard/PauseAndResumeServiceButton";
import SectionTitle from "@/components/dashboard/SectionTitle";
import UserInfoComponent from "@/components/dashboard/UserInfo";
import UserPhoneNumberComponent from "@/components/dashboard/UserPhoneNumberComponent";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import SafeAreaLayout from "@/components/layout/SafeAreaLayout";
import { auth, db } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { ScrollView, View } from "react-native";
import { Divider, Provider as PaperProvider } from "react-native-paper";

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const [modalMailerVisible, setModalMailerVisible] = React.useState<boolean>(false);

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
            <ActionOutlineButton
              title="Modify Phone Number"
              onPress={() => router.push({
                pathname: "/dashboard/modify-phone-number",
                params: {existingPhoneNumber: userData.phoneNumber}
              })}
              buttonStyle={{marginBottom: 20}}
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
  
              <ActionOutlineButton
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
              />

              <PausAndResumeServiceButton />

            </View>
  
            <Divider style={{marginVertical: 30, backgroundColor: Theme.primary }} />
  
            {/* Scheduler Section */}
            {/* <PlainTextLink
              text="if you need a more customized schedule,"
              linkText="Click here"
              route="/dashboard/schedule"
              bodyStyle={{marginBottom: 15}}
              linkStyle={{textDecorationStyle: "solid", textDecorationLine: "underline", textDecorationColor: Theme.accent, color: Theme.accent}}
            /> */}
            
            <ActionButton
              title="Custom Schedule"
              mode="elevated"
              onPress={() => router.push("/dashboard/schedule")}
              buttonStyle={{marginBottom: 20, width: 250}}
            />
  
            <Divider style={{marginBottom: 30, marginTop: 10, backgroundColor: Theme.primary }} />
  
            {/* Contact Us Actions */}
            <ActionOutlineButton
              title="Contact Us"
              onPress={() => setModalMailerVisible(true)}
            />
    
          </ScrollView>
  
        </SafeAreaLayout>
      </>
    </PaperProvider>
  );
};

export default DashboardScreen;