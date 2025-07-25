import ActivityIndicatorComponent from "@/components/ActivityIndicatorComponent";
import ActionButton from "@/components/dashboard/ActionButton";
import ActionOutlineButton from "@/components/dashboard/ActionOutlineButton";
import ContactsInformationComponent from "@/components/dashboard/ContactsInformation";
import ModalComponent from "@/components/dashboard/modals/ModalComponent";
import ModalMailerComponent from "@/components/dashboard/modals/ModalMailerComponent";
import MotiAnimatedSection from "@/components/dashboard/MotiAnimatedSection";
import PausAndResumeServiceButton from "@/components/dashboard/PauseAndResumeServiceButton";
import ResponseTimeComponent from "@/components/dashboard/ResponseTimeComponent";
import SectionTitle from "@/components/dashboard/SectionTitle";
import StartingTimeComponent from "@/components/dashboard/StartingTimeComponent";
import UserInfoComponent from "@/components/dashboard/UserInfo";
import UserPhoneNumberComponent from "@/components/dashboard/UserPhoneNumberComponent";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import SafeAreaLayout from "@/components/layout/SafeAreaLayout";
import { auth, db } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Divider, Provider as PaperProvider } from "react-native-paper";

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMailerVisible, setModalMailerVisible] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [startingTime, setStartingTime] = React.useState<string | undefined>("");
  const [responseTime, setResponseTime] = React.useState<string | undefined>('1');

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

  // Hanlders
  const basicScheduleHandler =  async () => {       
    if (typeof startingTime !== "string" || startingTime === "") {
      Alert.alert("Please! Select a time slot from the drop-down above.");
      return;
    }
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const userRef = doc(db, "users", user.uid);

      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc?.data();

      const selectedTime = startingTime || ""; // "07:30 PM"; // from dropdown
      // const selectedTime =
      //   typeof startingTime === "string"
      //     ? startingTime
      //     : (startingTime?.toDate?.() instanceof Date
      //         ? dayjs(startingTime.toDate()).format("hh:mm A")
      //         : "");
      const responseTimeNum = responseTime ? parseInt(responseTime, 10) : 1;
      const selectedResponseTime = responseTimeNum;  // e.g., 1, 2, or 3 (hours) from dropdown

      const timeParsed = dayjs(selectedTime, "hh:mm A");

      if (!timeParsed.isValid()) {
        throw new Error("Invalid selected time format");
      }

      const time24hr = timeParsed.format("HH:mm"); // e.g., "19:30"

      await updateDoc(userRef, {
        "automation.startingTime": time24hr,
        "automation.responseTime": selectedResponseTime,
        "automation.advancedScheduler": false,      // Ensure it's in basic mode
        "automation.scheduleStatus": "not_started", // Reset for the scheduler to begin
      });


      if( userData ) {
        const {cat, dog, children, otherPet, extra} = userData?.dependents
        if (!cat && !dog && !children && !otherPet && !extra) {
          setModalVisible(true);
        }
        // else Alert.alert("Value added!")
      }
      
      Alert.alert("Your schedule has been recorded. You will be receiving texts as requested");



    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }

    setModalVisible(true)
    
  }

  if (!userData) {
    return (<ActivityIndicatorComponent />);
  }

  return (
    <PaperProvider>
      <>

        <ModalComponent
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

            <MotiAnimatedSection>

              <StartingTimeComponent handler={setStartingTime} existingData={userData?.automation?.startingTime || ""} />

              <ResponseTimeComponent handler={setResponseTime} existingData={userData?.automation?.responseTime?.toString() || "1"} />

              <ActionButton
                title="Save Schedule" // "Save Text/Response Time"
                mode="elevated"
                onPress={basicScheduleHandler}
                // buttonStyle={{width: SIZES.screenBodyWidth}}
              />

              <ActionButton
                title="Custom Schedule"
                mode="elevated"
                onPress={() => {

                  if( userData?.membershipPlan?.plan === "basic" ) {
                      Alert.alert("Please upgrade your plan to Premium in order to access the custom schedule")
                      router.push({
                        pathname: "/dashboard/upgrade-plan",
                        params: {subscriptionId: userData.stripeSubscriptionId}
                      })
                      return;
                  }
                  
                  router.push("/dashboard/schedule")
                }}
                buttonStyle={{marginVertical: 20, width: 250}}
              />

            </MotiAnimatedSection>
            
  
            {/* <Divider style={{marginBottom: 30, marginTop: 10, backgroundColor: Theme.primary }} /> */}
  
            {/* Contact Us Actions */}
            <MotiAnimatedSection>
              <ActionOutlineButton
                title="Contact Us"
                onPress={() => setModalMailerVisible(true)}
              />
            </MotiAnimatedSection>
    
          </ScrollView>
  
        </SafeAreaLayout>
      </>
    </PaperProvider>
  );
};

export default DashboardScreen;