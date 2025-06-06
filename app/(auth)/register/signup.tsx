import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import PlainTextLink from "@/components/form-components/auth/PlainTextLink";
import TextInputComponent from "@/components/form-components/TextInputComponent";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { auth, db } from "@/config/firebase";
import SIZES from "@/constants/size";
import { MembershipPlan, UserData } from "@/types";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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
  plan: "",              // user starts on the free tier
  status: "pending",         // pending until they actively subscribe
  since: serverTimestamp()   // Firestore timestamp when this record is created
};

const SignUpScreen: React.FC = () => {
  const router = useRouter();
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
      await sendEmailVerification(userCredential.user);
      Alert.alert(
        "Check your email!",
        "Please verify your email before logging in."
      );
  
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
      };
  
      // 3️⃣ Write to Firestore using setDoc
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
  
      // 4️⃣ Navigate to the “verify email” screen
      router.push("/(auth)/register/verify-email");
    } catch (error: any) {
      Alert.alert("User Info Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthScreenLayout title="Sign Up" isScrollable={true}>

      <Formik
        initialValues={{ name: "", zipCode: "", country: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={SignUpScreenSchema}
        onSubmit={(values) => handleSignUpScreen(values.name, values.zipCode, values.country, values.email, values.password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View
            style={{
              gap: 20,
              width: SIZES.screenBodyWidth,
            }}
          >
            <TextInputComponent
              placeholder="Full Name"
              inputMode="text"
              value={values.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            {errors.name && touched.name && <Text>{errors.name}</Text>}
            
            <TextInputComponent
              placeholder="Email"
              inputMode="email"
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

            <TextInputComponent
              placeholder="Confirm Password"
              isPassword={true}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            {errors.confirmPassword && touched.confirmPassword && <Text>{errors.confirmPassword}</Text>}

            <TextInputComponent
              placeholder="Zip-code"
              inputMode="text"
              value={values.zipCode}
              onChange={handleChange("zipCode")}
              onBlur={handleBlur("zipCode")}
            />
            {errors.zipCode && touched.zipCode && <Text>{errors.zipCode}</Text>}

            <TextInputComponent
              placeholder="Country"
              inputMode="text"
              value={values.country}
              onChange={handleChange("country")}
              onBlur={handleBlur("country")}
            />
            {errors.country && touched.country && <Text>{errors.country}</Text>}

            {/* Submit Button */}
            <ActionPrimaryButton
              buttonTitle="Sign Up"
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          </View>
        )}
      </Formik>

      <PlainTextLink text="Already have an account?" route="/(auth)/login" linkText="Login here." />
      
    </AuthScreenLayout>
  );
};

export default SignUpScreen;