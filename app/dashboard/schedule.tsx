import ActivityIndicatorComponent from '@/components/ActivityIndicatorComponent'
import ArrowButton from '@/components/ArrowButton'
import CalendarComponent from '@/components/dashboard/Calendar'
import ModalComponent from '@/components/dashboard/modals/ModalComponent'
import SectionTitle from '@/components/dashboard/SectionTitle'
import SafeAreaLayout from '@/components/layout/SafeAreaLayout'
import { auth, db } from '@/config/firebase'
import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import { UserData } from '@/types'
import { doc, getDoc } from 'firebase/firestore'
import { ScrollView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'

const CustomSchedule = () => {
    const [userData, setUserData] = React.useState<UserData | null>(null);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);

    React.useEffect(() => {

        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) setUserData(userDoc.data() as UserData);
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
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            />

            <SafeAreaLayout>

                <ScrollView style={{flex:1}}>

                    <ArrowButton />

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <View
                            style={{
                                alignItems:"center",
                                marginVertical: 30
                            }}
                        >
                            <Text style={{color: Theme.primary, fontSize: SIZES.header, fontWeight: "800"}}>Custom Schedule</Text>
                        </View>

                        <SectionTitle title="Set Your Schedule" />
                        <CalendarComponent onModalHandler={() => setModalVisible(true)} userData={userData} />
                    </View>

                </ScrollView>


            </SafeAreaLayout>

        </>
    </PaperProvider>
  )
}

export default CustomSchedule