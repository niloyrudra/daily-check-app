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
import SignOutComponent from "@/components/dashboard/SignOutComponent";
// import StartingTimeComponent from "@/components/dashboard/StartingTimeComponent";
import UserInfoComponent from "@/components/dashboard/UserInfo";
import UserPhoneNumberComponent from "@/components/dashboard/UserPhoneNumberComponent";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import SafeAreaLayout from "@/components/layout/SafeAreaLayout";
import TitleComponent from "@/components/TitleComponent";
import { auth, db } from "@/config/firebase";
import SIZES from "@/constants/size";
import { Theme } from "@/constants/theme";
import { UserData } from "@/types";
import { formatTimeTo12Hour } from "@/utils";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { Divider, Provider as PaperProvider, Text } from "react-native-paper";

const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMailerVisible, setModalMailerVisible] = React.useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = React.useState<boolean>(false);
  const [loadingSaveSchedule, setLoadingSaveSchedule] = React.useState<boolean>(false);
  const [startingTime, setStartingTime] = React.useState<string | undefined>("");
  const [responseTime, setResponseTime] = React.useState<string | undefined>('1');

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          setStartingTime( userDoc.data()?.automation?.startingTime || "" )
        }
      }
    };
    fetchUserData();
  }, []);

  // Hanlders
  const dailyTimeSlotHandler = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowTimePicker(false);

    // const time = dayjs(selectedDate).format("hh:mm A");
    // const time = dayjs(selectedDate).utc().format(); // or `.toISOString()`
    const time = dayjs(selectedDate).format("HH:mm");

    // console.log("Selected Time event:", event)
    // console.log("Selected Time:", time)

    setStartingTime(time)

  };

  const basicScheduleHandler =  async () => {       
    if (typeof startingTime !== "string" || startingTime === "") {
      Alert.alert("Please! Select a time slot from the drop-down above.");
      return;
    }

    try {
      setLoadingSaveSchedule(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const userRef = doc(db, "users", user.uid);

      const userDoc = await getDoc(userRef);
      const userFreshData = userDoc?.data();

      if (userFreshData && userFreshData?.automation?.startingTime && userFreshData?.automation.scheduleStatus !== 'not_started') {
        const confirm = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Overwrite Schedule?',
            'You already have a schedule running. Do you want to replace it?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Yes', onPress: () => resolve(true) },
            ]
          );
        });
        if (!confirm) return;
      }

      const selectedTime = startingTime || ""; // "07:30 PM"; // from dropdown

      // const responseTimeNum = responseTime ? parseInt(responseTime, 10) : 1;
      const responseTimeNum = Number.isNaN(parseInt(responseTime || '', 10)) ? 1 : parseInt(responseTime!, 10);
      const selectedResponseTime = responseTimeNum;  // e.g., 1, 2, or 3 (hours) from dropdown

      // const timeParsed = dayjs(`${selectedTime}`, "hh:mm A");
      // const timeParsed = dayjs(selectedTime, "HH:mm", true);

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!timeRegex.test(startingTime)) {
        throw new Error("Time format must be HH:mm");
      }

      const timeParsed = dayjs(startingTime, "HH:mm");

      // console.log("timeParsed", timeParsed)

      // if (!timeParsed?.isValid()) {
      //   throw new Error("Invalid selected time format");
      // }

      // const time24hr = timeParsed.format("HH:mm"); // e.g., "19:30"

      await updateDoc(userRef, {
        "automation.startingTime": selectedTime, // timeParsed, // time24hr,
        "automation.responseTime": selectedResponseTime,
        "automation.advancedScheduler": false,      // Ensure it's in basic mode
        "automation.scheduleStatus": "not_started", // Reset for the scheduler to begin
      });


      if( userFreshData ) {
        const {cat, dog, children, otherPet, extra} = userFreshData.dependents
        if (!cat && !dog && !children && !otherPet && !extra) setModalVisible(true);
      }
      
      Alert.alert("Your schedule has been recorded. You're all set!");

    } catch (error: any) {
      setLoadingSaveSchedule(false);
      Alert.alert("Error", error.message);
    } finally {
      setLoadingSaveSchedule(false);
    }
    
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
  
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
  
            <SignOutComponent />

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
            <MotiAnimatedSection>

              {/* <StartingTimeComponent handler={setStartingTime} existingData={userData?.automation?.startingTime || ""} /> */}

              <MotiAnimatedSection>
                <View style={{gap:20, marginBottom: 20}}>

                  <TitleComponent
                    title={"At what time would you like us to text you daily:"}
                    titleStyle={{textAlign:"center"}}
                  />
                
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: Theme.primary,
                      borderRadius: 4,
                      height: SIZES.textFieldHeight,
                      alignItems:"flex-start",
                      justifyContent:"center",
                      paddingHorizontal: SIZES.bodyPaddingHorizontal
                    }}
                  >
                    <Text variant="bodyMedium" style={{color: Theme.primary, textAlignVertical:"center", fontSize: SIZES.contentText}}>{startingTime ? `Daily at ${formatTimeTo12Hour(startingTime)}` : "Select Your Time Slot"}</Text>
                  </TouchableOpacity>
                </View>

              </MotiAnimatedSection>
              
              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  onChange={dailyTimeSlotHandler}
                />
              )}

              <ResponseTimeComponent handler={setResponseTime} existingData={userData?.automation?.responseTime?.toString() || "1"} />

              <ActionButton
                title="Save Schedule" // "Save Text/Response Time"
                mode="elevated"
                onPress={basicScheduleHandler}
                loading={loadingSaveSchedule}
                disabled={!startingTime || !responseTime}
              />

              <ActionButton
                title="Custom Schedule"
                mode="elevated"
                onPress={() => {

                  if( userData?.membershipPlan?.plan === "basic" ) {
                      Alert.alert("Please upgrade to Premium Plan to access custom schedule")
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