import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

import ArrowButton from "@/components/ArrowButton";
import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import CheckboxField from "@/components/form-components/Checkbox";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import SIZES from "@/constants/size";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { doc, updateDoc } from "firebase/firestore";


interface FormValues {
  optIn: boolean;
}

const OptInScreen: React.FC = () => {
  const router = useRouter();
  const initialValues: FormValues = { optIn: false };
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      setLoading(true)

      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        optInStatus: values.optIn,
      });

      if (values.optIn) {
        Alert.alert("Congratulations!", "You are successfully signed in for our Texting and Calling services.");
      } else {
        Alert.alert("Cancellation Successful!", "You have successfully cancelled our Texting and Calling services.");
      }

      // ✅ Navigate after success
      router.push("/(auth)/register/membership");
    } catch (error: any) {
      console.log("Error:", error.message);
      Alert.alert("Sorry!", "Something went wrong. Please try again or later!");
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  };


  return (
    <AuthScreenLayout>

      <ArrowButton />

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <View style={[STYLES.childContentCentered, {marginTop: 20}]}>

            <View style={[ STYLES.childContentCentered, { gap:30 } ]}>

              <Text style={{color:Theme.primary, textAlign: "center", fontSize: SIZES.contentText, fontWeight: "800"}}>Please, confirm receiving texts and answering calls from Daily Check App by switching the following button ON.</Text>

              <View
                style={{
                  padding: SIZES.bodyPaddingHorizontal,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Theme.borderColor,
                  alignItems: "center",
                  justifyContent: "center",
                  gap:15
                }}
              >

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: Theme.borderColor,
                    borderRadius: 40,
                    height: 40,
                    width: 60
                  }}
                >
                  <CheckboxField name="optIn" />
                </View>

                <Text style={{color:Theme.primary, textAlign:"center", fontSize: SIZES.contentText}}>I would like to receive SMS (text messages) and/or calls as safety checks and acknowledge I can opt out at any time by replying STOP.</Text>

              </View>

              <ActionPrimaryButton
                buttonTitle="Continue"
                onSubmit={handleSubmit}
                isLoading={loading}
              />
            </View>

          </View>
        )}
      </Formik>
    </AuthScreenLayout>
  );
};

export default OptInScreen;