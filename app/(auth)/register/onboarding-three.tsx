import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import OnboardingInfoComponent from "@/components/OnboardingInfoComponent";


const OnboardingScreenThree: React.FC = () => {
  const router = useRouter();

  return (
    <AuthScreenLayout title="Why Daily Check-App?" isScrollable={true}>

      <View
        style={{
          flex: 1,
          gap: 40,
          justifyContent: "flex-start",
          alignItems:"center",
          paddingVertical: 20
        }}
      >

        <OnboardingInfoComponent
          iconName="stethoscope"
          content="Have the peace of mind that if something happens to you, others will find out very soon and come to you."
        />

        <OnboardingInfoComponent
          iconName="shield-dog"
          content="Your pets and young children can be quickly tended to, should anything happen to you."
        />

        <OnboardingInfoComponent
          iconName="people-roof"
          content="Your two safety contacts will be quickly notified to check-up on you and your dependent loved ones if we get no response from you"
        />

        {/* Submit Button */}
        <ActionPrimaryButton
          buttonTitle="Continue"
          onSubmit={() => router.push("/(auth)/register/verify-phone")}
        />

      </View>

    </AuthScreenLayout>
  );
};

export default OnboardingScreenThree;