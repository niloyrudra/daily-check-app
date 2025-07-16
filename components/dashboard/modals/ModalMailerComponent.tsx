import ActionPrimaryButton from '@/components/form-components/ActionPrimaryButton';
import TextInputComponent from '@/components/form-components/TextInputComponent';
import { auth } from '@/config/firebase';
import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import { MailerFormValues, UserData } from '@/types';
import { BASE_URL } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as React from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import * as Yup from 'yup';

// Validation schema
const MailerSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().max(500, 'Too long'),
});

interface MailerModalProps {
  userData: UserData,
  visible: boolean,
  onRequestClose: (event?: boolean) => void
}

const ModalMailerComponent: React.FC<MailerModalProps> = ({userData, visible, onRequestClose}) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const initialValues: MailerFormValues = {
    name: userData.name || "",
    email: userData.email || "",
    message: ""
  };

  const containerStyle = {
    flex: 1,
    backgroundColor: Theme.background,
    paddingHorizontal: SIZES.bodyPaddingHorizontal,
    paddingVertical: SIZES.bodyPaddingVertical,
    borderRadius: 12,
    maxHeight: '80%' as `${number}%`,
  };

  return (
    <Portal>
        <Modal visible={visible} onDismiss={onRequestClose} contentContainerStyle={containerStyle}>
          <KeyboardAvoidingView
            style={{flex:1}}
            behavior={Platform.OS === "ios" ? "padding": undefined} // "height"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
            
            <View style={{gap: 20, position: "relative"}}>
              <Text style={{ fontSize: 28, lineHeight: 36, color: Theme.primary, fontWeight: "800", textAlign: "center", marginVertical: 30 }}>
                Write us what query you have!
              </Text>

              <TouchableOpacity
                onPress={() => onRequestClose()}
                style={{
                  position: "absolute",
                  right: 0,
                  top: -5
                }}
              >
                <Ionicons name='close' size={36} color={Theme.accent} />
              </TouchableOpacity>
              
              <Formik
                  initialValues={initialValues}
                  validationSchema={MailerSchema}
                  onSubmit={ async (values) => {
                    console.log('Form submitted:', values);
                    const {name, email, message} = values;

                    try {
                      setLoading(true);
                      const user = auth.currentUser;
                      if (!user) throw new Error("Not logged in");

                      const response = await fetch(`${BASE_URL}/api/send-support-email`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, message }),
                      });

                      const resData = await response.json();

                      if (resData?.success) {
                        Alert.alert("✅ Message sent. We'll get back to you soon.");
                      } else {
                        console.log(resData)
                        Alert.alert("❌ Failed to send: " + resData.message);
                      }

                      // Alert.alert("Successful!", "You have successfully added your dependency information.")

                      // onRequestClose();
                    }
                    catch( error: any ) {
                      console.error("Error", error?.message)
                      Alert.alert("Unfortunate!", "Something went wrong. Please try again later!")
                    }
                    finally {
                      setLoading(false);
                    }
                  }}
              >
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    handleBlur,
                    errors,
                    touched,
                  }) => (
                    <>
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
                        placeholder="Your Message"
                        multiline
                        value={values.message}
                        onChange={handleChange('message')}
                      />
                      {touched.message && errors.message && (<Text style={STYLES.errorMessage}>{errors.message}</Text>)}

                      <View style={{marginTop: 20, alignItems: "center"}}>

                        <ActionPrimaryButton
                          buttonTitle="Send"
                          onSubmit={() => handleSubmit()}
                          isLoading={loading}
                        />
                      </View>

                    </>
                  )}
              </Formik>

            </View>

          </KeyboardAvoidingView>
        </Modal>
      </Portal>
  );
};

export default ModalMailerComponent;