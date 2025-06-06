import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import PlainTextLink from "@/components/form-components/auth/PlainTextLink";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { auth, signInWithEmailAndPassword } from "@/config/firebase";
import SIZES from "@/constants/size";
import { Theme } from "@/constants/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));
      router.push("/dashboard/home");
    } catch (error: any) {
      console.error( "Login Failed Error:", error.message )

      if( error.message && error.message?.includes("(auth/invalid-credential)") ) Alert.alert("Login Failed", "Your Credentials are invalid!");
      else Alert.alert("Login Failed", "Something went wrong! Please try again or later.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout title="Login">

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => handleLogin(values.email, values.password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View
            style={{
              gap: 20,
              width: SIZES.screenBodyWidth
            }}
          >
            <TextInputComponent
              placeholder="Email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email && <Text>{errors.email}</Text>}

            <TextInputComponent
              placeholder="Password"
              isPassword={true}
              value={values.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {errors.password && touched.password && <Text>{errors.password}</Text>}

            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Link href="/(auth)/forgot-password" style={{color: Theme.text, fontSize: 16, fontWeight: "600"}}>Forgot Password?</Link>
            </View>

            {/* Submit Button */}
            <ActionPrimaryButton
              buttonTitle="Login"
              onSubmit={handleSubmit}
              isLoading={loading}
            />

          </View>
        )}
      </Formik>

      <PlainTextLink  text="Don't have an account?" route="/(auth)/register" linkText="Create Account." />

    </AuthScreenLayout>
  );
};

export default Login;