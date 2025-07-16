import STYLES from "@/constants/styles";
import { contactSchema } from "@/schemas";
import { Formik } from "formik";
import React from "react";
import { Alert, Text, View } from "react-native";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";
import TextInputComponent from "../form-components/TextInputComponent";

interface Props {
  contactKey: "contact1" | "contact2",
  step: "enterPhone" | "enterCode",
  storedName: string,
  setStoredName: (v: string) => void,
  storedPhone: string,
  setStoredPhone: (v: string) => void,
  stepSetter: (v: "enterPhone" | "enterCode") => void,
  loading: boolean,
  handleSendCode: (phone: string, name: string, contactKey: "contact1" | "contact2") => Promise<void>,
  handleVerifyCode: (code: string, contactKey: "contact1" | "contact2", phone: string) => Promise<void>,
  cName?: string | "",
  cPhoneNumber?: string | "",
  isModifiying?: boolean
}

const RenderContactInput: React.FC<Props> = ({
  contactKey,
  step,
  storedName,
  setStoredName,
  storedPhone,
  setStoredPhone,
  stepSetter,
  loading,
  handleSendCode,
  handleVerifyCode,
  cName,
  cPhoneNumber,
  isModifiying=false
}) => {
    const [loadingResend, setLoadingResend] = React.useState<boolean>(false);

    const handleResendCode = async () => {
      setLoadingResend(true);
      try {
        if (!storedPhone || !storedName) {
          Alert.alert("Missing Info", "Please go back and re-enter the phone and name.");
          return;
        }

        await handleSendCode(storedPhone, storedName, contactKey);

        Alert.alert("New OTP Sent", "Previous code is invalid. Please use the new one.");
      } catch (error) {
        console.error("Resend OTP failed:", error);
        Alert.alert("Error", "Failed to resend the code.");
      } finally {
        setLoadingResend(false);
      }
    };

  return (
    <Formik
      initialValues={{ name: cName || "", phone: cPhoneNumber || "", code: "" }}
      validationSchema={contactSchema}
      onSubmit={() => {}}
    >
      {({ handleChange, values, errors, touched }) => (
        <View style={[STYLES.formGroup, { alignItems: "center" }]}>
          <Text style={STYLES.formLabel}>
            {contactKey === "contact1" ? "Primary Contact" : "Secondary Contact"}
          </Text>

          {step === "enterPhone" ? (
            <>
              <TextInputComponent
                placeholder="Name"
                inputMode="text"
                autoCapitalize="words"
                value={values.name}
                onChange={handleChange("name")}
                isPassword={false}
              />
              {touched.name && errors.name && (
                <Text style={STYLES.errorMessage}>{errors.name}</Text>
              )}

              <TextInputComponent
                placeholder="e.g. +1(555)555-5555"
                keyboardType="phone-pad"
                inputMode="tel"
                value={values.phone}
                onChange={handleChange("phone")}
                isPassword={false}
              />
              {touched.phone && errors.phone && (
                <Text style={STYLES.errorMessage}>{errors.phone}</Text>
              )}

              <ActionPrimaryButton
                buttonTitle="Send Code"
                onSubmit={() => {
                  setStoredName(values.name);
                  setStoredPhone(values.phone);
                  handleSendCode(values.phone, values.name, contactKey);
                }}
                isLoading={loading}
              />
            </>
          ) : (
            <>
              <TextInputComponent
                placeholder="123456"
                keyboardType="number-pad"
                inputMode="numeric"
                value={values.code}
                onChange={handleChange("code")}
              />
              {touched.code && errors.code && (
                <Text style={STYLES.errorMessage}>{errors.code}</Text>
              )}

              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 10 }}>
                <ActionPrimaryButton
                  buttonTitle="Verify Code"
                  onSubmit={() =>
                    handleVerifyCode(values.code, contactKey, storedPhone)
                  }
                  isLoading={loading}
                />

                <ActionPrimaryButton
                  buttonTitle="Resend Code"
                  onSubmit={handleResendCode}
                  isLoading={loadingResend}
                />
              </View>

            </>
          )}
        </View>
      )}
    </Formik>
  );
};

export default RenderContactInput;