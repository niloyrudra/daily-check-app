import ActionPrimaryButton from '@/components/form-components/ActionPrimaryButton';
import TextInputComponent from '@/components/form-components/TextInputComponent';
import { auth, db } from '@/config/firebase';
import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import { Checkbox } from 'expo-checkbox';
import { doc, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import * as React from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import * as Yup from 'yup';

type EmergencyFormValues = {
  children: boolean;
  dog: boolean;
  cat: boolean;
  otherPet: boolean;
  extra: string;
};

// Validation schema
const EmergencySchema = Yup.object().shape({
  children: Yup.boolean(),
  dog: Yup.boolean(),
  cat: Yup.boolean(),
  otherPet: Yup.boolean(),
  extra: Yup.string().max(250, 'Too long'),
});

interface EmergencyModalProps {
  visible: boolean;
  onRequestClose: (event?: boolean) => void;
}

const ModalComponent: React.FC<EmergencyModalProps> = ({visible, onRequestClose}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const initialValues: EmergencyFormValues = {
    children: false,
    dog: false,
    cat: false,
    otherPet: false,
    extra: '',
  };

  const containerStyle = {backgroundColor: 'white', paddingHorizontal: SIZES.bodyPaddingHorizontal, paddingVertical: SIZES.bodyPaddingVertical, borderRadius: 12};

  return (
    <Portal>
        <Modal visible={visible} onDismiss={onRequestClose} contentContainerStyle={containerStyle}>
          <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding": "height"}>
            
            <View
              style={{
                gap: 20
              }}
            >
              <Text style={{ fontSize: SIZES.title, color: Theme.primary, fontWeight: "800", textAlign: "center", marginBottom: 30 }}>
                In Case of Emergency, list your dependent loved ones at home:
              </Text>
              
              <Formik
                  initialValues={initialValues}
                  validationSchema={EmergencySchema}
                  onSubmit={ async (values) => {
                    console.log('Form submitted:', values);
                    try {
                      setLoading(true);
                      const user = auth.currentUser;
                      if (!user) throw new Error("Not logged in");

                      const userRef = doc(db, "users", user.uid);
                      await updateDoc(userRef, {
                        'dependents.cat': values.cat,
                        'dependents.dog': values.dog,
                        'dependents.children': values.children,
                        'dependents.otherPet': values.otherPet,
                        'dependents.extra': values.extra,
                      });

                      Alert.alert("Successful!", "You have successfully added your dependency information.")

                      onRequestClose();
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
                      setFieldValue,
                      errors,
                      touched,
                  }) => (
                    <>

                      {(Object.keys(initialValues) as (keyof EmergencyFormValues)[]).slice(0, 4).map((key) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 20,
                              alignItems: 'center',
                              paddingLeft: 50,
                              marginBottom: 10,
                            }}
                            key={key}
                          >

                            <Checkbox
                              value={values[key] as boolean}
                              onValueChange={(val: boolean) => setFieldValue(key, val)}
                              color={values[key] ? Theme.accent : undefined}
                            />

                            <Text style={STYLES.formLabel}>
                              { key === 'otherPet' ? 'Other Pet' : key.charAt(0).toUpperCase() + key.slice(1) }
                            </Text>

                          </View>
                      ))}


                      <TextInputComponent
                        placeholder="Tell us more"
                        multiline
                        value={values.extra}
                        onChange={handleChange('extra')}
                      />

                      {touched.extra && errors.extra && (<Text style={STYLES.errorMessage}>{errors.extra}</Text>)}

                      <ActionPrimaryButton
                        buttonTitle="Submit"
                        onSubmit={() => handleSubmit()}
                        isLoading={loading}
                      />

                    </>
                  )}
              </Formik>

            </View>

          </KeyboardAvoidingView>
        </Modal>
      </Portal>
  );
};

export default ModalComponent;