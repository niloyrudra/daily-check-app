import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import OnboardingInfoComponent from "@/components/OnboardingInfoComponent";
import SIZES from "@/constants/size";
import STYLES from "@/constants/styles";


const OnboardingScreen: React.FC = () => {
  const router = useRouter();

  return (
    <AuthScreenLayout isScrollable={true}>

      <View style={STYLES.infoContainer}>

        <OnboardingInfoComponent
          iconName="person-circle-check"
          content="Do you wish you had the security of someone checking-up on you promptly every morning after you wake up to make sure you're ok?"
        />

        <OnboardingInfoComponent
          iconName="heart-crack"
          content="What would happen to you or your baby and/or pet if one day you don&apos;t wake up?"
        />

        <OnboardingInfoComponent
          iconName="handshake-angle"
          content="We will text you daily at your specified time. If you don&apos;t text us back a quick Y or YES within your appointed time window, we will alert your safety contacts."
        />

        <View style={{flex:1, flexDirection: "row", justifyContent:"space-around", alignItems: "flex-end", marginTop: 10, width: SIZES.screenBodyWidth }}>
          {/* Login Button */}
          <ActionPrimaryButton
            buttonTitle="Log In"
            onSubmit={() => router.push("/(auth)/login")}
            buttonStyle={{
              paddingHorizontal: 24
            }}
          />

          {/* Submit Button */}
          <ActionPrimaryButton
            buttonTitle="Next"
            onSubmit={() => router.push("/(auth)/register/onboarding-two")}
          />
        </View>


      </View>

    </AuthScreenLayout>
  );
};

export default OnboardingScreen;