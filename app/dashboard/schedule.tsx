import ActivityIndicatorComponent from '@/components/ActivityIndicatorComponent'
import ArrowButton from '@/components/ArrowButton'
import VideoPlayerComponent from '@/components/auth/VideoPlayerComponent'
import CalendarComponent from '@/components/dashboard/Calendar'
import ModalComponent from '@/components/dashboard/modals/ModalComponent'
import MotiAnimatedSection from '@/components/dashboard/MotiAnimatedSection'
import SafeAreaLayout from '@/components/layout/SafeAreaLayout'
import TitleComponent from '@/components/TitleComponent'
import { auth, db } from '@/config/firebase'
import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import { UserData } from '@/types'
import { doc, getDoc } from 'firebase/firestore'
import { ScrollView } from 'moti'
import React from 'react'
import { View } from 'react-native'
import { Divider, PaperProvider } from 'react-native-paper'

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

                    {/* <ArrowButton route='/dashboard/home' buttonStyle={{ left: SIZES.bodyPaddingHorizontal, top: SIZES.bodyPaddingVertical }} /> */}
                    <ScrollView style={{flex:1}}>

                    <ArrowButton route='/dashboard/home' buttonStyle={{zIndex:3}} />

                        <MotiAnimatedSection>
                            <TitleComponent title="Custom Schedule Help Guide" titleStyle={{width: "60%", fontSize: SIZES.header, textAlign: "center", marginTop: 40}} />
                            <VideoPlayerComponent linkType="instruction" />
                        </MotiAnimatedSection>

                        <Divider style={{backgroundColor: Theme.primary}} />
                        
                        <MotiAnimatedSection>

                            <View style={{flex: 1}}>
                                <TitleComponent title="Custom Schedule" titleStyle={{fontSize: SIZES.header, textAlign: "center", marginVertical: 20}} />
                                {/* <SectionTitle title="Set Your Schedule" /> */}
                                <CalendarComponent onModalHandler={() => setModalVisible(true)} userData={userData} />
                            </View>

                        </MotiAnimatedSection>


                        <View style={{height: 30}} />
                        

                    </ScrollView>


                </SafeAreaLayout>

            </>
        </PaperProvider>
    )
}

export default CustomSchedule