import STYLES from "@/constants/styles";
import { phoneSchema } from "@/schemas";
import React from "react";
import { Alert, Text, View } from "react-native";
import ActionPrimaryButton from "../form-components/ActionPrimaryButton";
import TextInputComponent from "../form-components/TextInputComponent";

interface Props {
  values: any;
  handleChange: any;
  errors: any;
  touched: any;
  handleSendCode: (phone: string) => Promise<void>;
  loading: boolean;
}

const RenderPhoneInput: React.FC<Props> = ({
  values,
  handleChange,
  errors,
  touched,
  handleSendCode,
  loading,
}) => {
  return (
    <View style={[STYLES.formGroup, { alignItems: "center" }]}>
      <Text style={STYLES.formLabel}>Your Phone Number:</Text>
      <TextInputComponent
        placeholder="+1(555)555-5555"
        value={values.phone}
        onChange={handleChange("phone")}
        keyboardType="phone-pad"
        inputMode="tel"
        isPassword={false}
      />
      {touched.phone && errors.phone && (<Text style={STYLES.errorMessage}>{errors.phone}</Text>)}

      <ActionPrimaryButton
        buttonTitle="Send Code"
        isLoading={loading}
        onSubmit={async () => {
          try {
            await phoneSchema.validateAt("phone", values);
            handleSendCode(values.phone);
          } catch (validationError: any) {
            Alert.alert("Validation Error", validationError.message);
          }
        }}
      />
    </View>
  );
};

export default RenderPhoneInput;