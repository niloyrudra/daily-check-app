import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SkipButton from "@/components/SkipButton";
import STYLES from "@/constants/styles";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from "yup";

const OnboardingTwoSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email"),
});

const OnboardingTwo: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnboardingTwo = async (
    email: string,
  ) => {
    setLoading(true);
    try {
      Alert.alert(
        "Congratulations!",
        "Your email address is stowed for future use case."
      );
  
      router.push({pathname: "/(auth)/register/onboarding-three", params: { initialEmail: email }});

    } catch (error: any) {
      Alert.alert("Unfortunately!", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthScreenLayout isScrollable={false}>

      <SkipButton onPress={() => router.push( "/(auth)/register/onboarding-three" )} />

      <Formik
        initialValues={{ email: "" }}
        validationSchema={OnboardingTwoSchema}
        onSubmit={(values) => handleOnboardingTwo(values.email)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={STYLES.formGroup}>

            <Text style={STYLES.formLabel}>Enter your email address to get started.</Text>

            <TextInputComponent
              placeholder="Email Address"
              inputMode="email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email && <Text style={STYLES.errorMessage}>{errors.email}</Text>}

            {/* Submit Button */}
            <ActionPrimaryButton
              buttonTitle="Next"
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          </View>
        )}
      </Formik>
      
    </AuthScreenLayout>
  );
};

export default OnboardingTwo;