import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { auth, db } from "@/config/firebase";
import STYLES from "@/constants/styles";
import { MembershipPlan, UserData } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from "yup";

const SignUpScreenSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    zipCode: Yup.string().min(2, "Name must be at least 2 characters").required("Zip Code is required"),
    country: Yup.string().required("Country is required"),
});

const defaultMembershipPlan: MembershipPlan = {
  plan: "",
  status: "pending",
  since: serverTimestamp()
};

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const { initialEmail } = useLocalSearchParams();
  const safeInitialEmail = typeof initialEmail === 'string' ? initialEmail : '';
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUpScreen = async (
    name: string,
    zipCode: string,
    country: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      // 1️⃣ Create user + send email verification
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // await sendEmailVerification(userCredential.user);
      // Alert.alert(
      //   "Check your email!",
      //   "Please verify your email before logging in."
      // );
  
      // 2️⃣ Build UserData with Firestore serverTimestamp
      const userData: UserData = {
        name,
        zipCode,
        country,
        email,
        emailVerified: false,
        optInStatus: false,
        phoneNumber: "",
        phoneNumberVerified: false,
        contactNumbers: {
          contact1: { contactName: "", phoneNumber: "", verified: false },
          contact2: { contactName: "", phoneNumber: "", verified: false }
        },
        schedules: {},
        createdAt: serverTimestamp(),       // ← server timestamp :contentReference[oaicite:9]{index=9}
        membershipPlan: defaultMembershipPlan,
        stripeCustomerId: '',
        stripeSubscriptionId: '',
        automation: {
          startingDate: null,
          endingDate: null,
          startingTime: null,
          responseTime: 1,
          lastInteraction: null,
          scheduleStatus: "not_started",
          lastChecked: null
        }
      };
  
      // 3️⃣ Write to Firestore using setDoc
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
  
      // 4️⃣ Navigate to the “verify email” screen
      // router.push("/(auth)/register/verify-email");
      router.push("/(auth)/register/verify-phone");

    } catch (error: any) {
      Alert.alert("User Info Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthScreenLayout title="Sign Up" isScrollable={true}>

      <Formik
        initialValues={{ name: "", zipCode: "", country: "", email: safeInitialEmail, password: "", confirmPassword: "" }}
        validationSchema={SignUpScreenSchema}
        onSubmit={(values) => handleSignUpScreen(values.name, values.zipCode, values.country, values.email, values.password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={STYLES.formGroup}>
            
            <TextInputComponent
              placeholder="Full Name"
              inputMode="text"
              autoCapitalize="words"
              value={values.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            {errors.name && touched.name && <Text style={STYLES.errorMessage}>{errors.name}</Text>}
            
            <TextInputComponent
              placeholder="Email Address"
              inputMode="email"
              autoCapitalize="none"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email && <Text style={STYLES.errorMessage}>{errors.email}</Text>}

            <TextInputComponent
              placeholder="Password"
              isPassword={true}
              value={values.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {errors.password && touched.password && <Text style={STYLES.errorMessage}>{errors.password}</Text>}

            <TextInputComponent
              placeholder="Confirm Password"
              isPassword={true}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            {errors.confirmPassword && touched.confirmPassword && <Text style={STYLES.errorMessage}>{errors.confirmPassword}</Text>}

            <TextInputComponent
              placeholder="Zip-code"
              inputMode="text"
              autoCapitalize="characters"
              value={values.zipCode}
              onChange={handleChange("zipCode")}
              onBlur={handleBlur("zipCode")}
            />
            {errors.zipCode && touched.zipCode && <Text style={STYLES.errorMessage}>{errors.zipCode}</Text>}

            <TextInputComponent
              placeholder="Country"
              inputMode="text"
              value={values.country}
              onChange={handleChange("country")}
              onBlur={handleBlur("country")}
            />
            {errors.country && touched.country && <Text style={STYLES.errorMessage}>{errors.country}</Text>}

            {/* Submit Button */}
            <ActionPrimaryButton
              buttonTitle="Sign Up"
              onSubmit={handleSubmit}
              isLoading={loading}
              buttonStyle={{
                marginTop: 10
              }}
            />
          </View>
        )}
      </Formik>

      {/* <PlainTextLink text="Already have an account?" route="/(auth)/login" linkText="Login here." /> */}

      <View style={{height:20}} />
      
    </AuthScreenLayout>
  );
};

export default SignUpScreen;