import ActionPrimaryButton from '@/components/form-components/ActionPrimaryButton';
import TextInputComponent from '@/components/form-components/TextInputComponent';
import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import Checkbox from "expo-checkbox";
import { Formik } from 'formik';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import * as Yup from 'yup';

type EmergencyFormValues = {
  children: boolean,
  dog: boolean,
  cat: boolean,
  otherPet: boolean,
  extra: string
};

interface EmergencyModalProps {
  visible: boolean;
  onRequestClose: (event?: boolean) => void;
}

const EmergencySchema = Yup.object().shape({
  children: Yup.boolean(),
  dog: Yup.boolean(),
  cat: Yup.boolean(),
  otherPet: Yup.boolean(),
  extra: Yup.string().max(250, 'Too long'),
});

const PopupFormComponent: React.FC<EmergencyModalProps> = ({ visible, onRequestClose }) => {
  const initialValues: EmergencyFormValues = {
    children: false,
    dog: false,
    cat: false,
    otherPet: false,
    extra: '',
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => onRequestClose(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <SafeAreaView
              style={{
                backgroundColor: Theme.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: SIZES.bodyPaddingHorizontal,
                paddingVertical: SIZES.bodyPaddingVertical,
                maxHeight: '90%',
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontSize: SIZES.title,
                    color: Theme.primary,
                    fontWeight: '800',
                    textAlign: 'center',
                    marginBottom: 20,
                  }}
                >
                  In Case of Emergency, list your dependent loved ones at home:
                </Text>

                <Formik
                  initialValues={initialValues}
                  validationSchema={EmergencySchema}
                  onSubmit={(values) => {
                    console.log('Form submitted:', values);
                    onRequestClose(false);
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
                    <View style={{ gap: 15 }}>
                      {(Object.keys(initialValues) as (keyof EmergencyFormValues)[]).slice(0, 4).map((key) => (
                        <View
                          key={key}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        >
                          <Checkbox
                            value={!values[key]}
                            onValueChange={(val) => setFieldValue(key, val)}
                            color={values[key] ? '#4caf50' : undefined}
                          />
                          <Text style={STYLES.formLabel}>
                            {key === 'otherPet' ? 'Other Pet' : key.charAt(0).toUpperCase() + key.slice(1)}
                          </Text>
                        </View>
                      ))}

                      <TextInputComponent
                        placeholder="Tell us more"
                        multiline
                        value={values.extra}
                        onChange={handleChange('extra')}
                      />

                      {touched.extra && errors.extra && (
                        <Text style={STYLES.errorMessage}>{errors.extra}</Text>
                      )}

                      <ActionPrimaryButton
                        buttonTitle="Submit"
                        onSubmit={() => handleSubmit()}
                      />

                      <ActionPrimaryButton
                        buttonTitle="Close"
                        onSubmit={() => onRequestClose(false)}
                        buttonStyle={{ backgroundColor: Theme.primary }}
                      />
                    </View>
                  )}
                </Formik>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PopupFormComponent;
