import FloatingArrowButton from "@/components/FloatingArrowButton";
import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { auth } from "@/config/firebase";
import { Theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReset = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
      router.push("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout title="Forgot Password">

      <FloatingArrowButton
        onPress={() => router.back()}
        iconName="chevron-left"
        iconSize={30}
        iconColor={Theme.secondary}
      />

      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => handleReset(values.email)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View
            style={{
              gap: 20
            }}
          >
            <TextInputComponent
              placeholder="Email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email && <Text>{errors.email}</Text>}

            {/* Submit Button */}
            <ActionPrimaryButton
              buttonTitle="Login"
              onSubmit={handleSubmit}
              isLoading={loading}
            />
            
          </View>
        )}
      </Formik>

    </AuthScreenLayout>
  );
};

export default ForgotPassword;