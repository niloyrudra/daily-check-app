import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import OnboardingInfoComponent from "@/components/OnboardingInfoComponent";
import STYLES from "@/constants/styles";


const OnboardingScreenThree: React.FC = () => {
  const router = useRouter();
  const { initialEmail } = useLocalSearchParams();

  return (
    <AuthScreenLayout title="Why Daily Check-App?" isScrollable={true}>

      <View style={STYLES.infoContainer}>

        <OnboardingInfoComponent
          iconName="stethoscope"
          content="Have the peace of mind that if something happens to you, others will find out very soon and come to your aid."
        />

        <OnboardingInfoComponent
          iconName="shield-dog"
          content="Your pets and young children can be quickly tended to, should anything happen."
        />

        <OnboardingInfoComponent
          iconName="people-roof"
          content="Your safety contacts will be quickly notified to check-up on you and your dependent loved ones if we get no response from you"
        />

        {/* Submit Button */}
        <ActionPrimaryButton
          buttonTitle="Continue"
          onSubmit={() => router.push({pathname: "/(auth)/register/signup", params: { initialEmail: initialEmail }})}
          buttonStyle={{
            marginTop: 10
          }}
        />

      </View>

    </AuthScreenLayout>
  );
};

export default OnboardingScreenThree;