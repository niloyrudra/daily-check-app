import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import OnboardingInfoComponent from "@/components/OnboardingInfoComponent";


const OnboardingScreen: React.FC = () => {
  const router = useRouter();

  return (
    <AuthScreenLayout isScrollable={true}>

      <View
        style={{
          flex: 1,
          gap: 40,
          justifyContent: "flex-start",
          paddingVertical: 20
        }}
      >

        <OnboardingInfoComponent
          iconName="person-circle-check"
          content="Do you wish to have the security of someone checking-up on you promptly each every morning after you wake up to make sure you're ok?"
        />

        <OnboardingInfoComponent
          iconName="heart-crack"
          content="What would happen to you or your baby and/or pet if one day you don&apos;t wake up?"
        />

        <OnboardingInfoComponent
          iconName="handshake-angle"
          content="We will text you daily at your specified time. If you don&apos;t text us back a quick Y or YES within your appointed time window, we will alert your safety contacts."
        />

        {/* Submit Button */}
        <ActionPrimaryButton
          buttonTitle="Continue"
          onSubmit={() => router.push("/(auth)/register/signup")}
        />

      </View>

    </AuthScreenLayout>
  );
};

export default OnboardingScreen;