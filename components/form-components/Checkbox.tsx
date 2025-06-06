import { Theme } from '@/constants/theme';
import { useField } from 'formik';
import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native';

interface CheckboxFieldProps {
  name: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ name }) => {
  const [{ value }, meta, helpers] = useField<boolean>(name); // Destructure to get field value and helpers
  
  // Use Formik's value as the initial state for the switch
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(value);

  // Sync local state with Formik field value when it changes
  useEffect(() => {
    setIsSwitchOn(value);
  }, [value]);

  return (
    <Switch

      trackColor={{false: Theme.primary, true: Theme.accent}}
      thumbColor={isSwitchOn ? "#FFFFFF" : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"

      value={isSwitchOn}
      onValueChange={() => {
        const newValue = !value; // Flip the value
        setIsSwitchOn(newValue); // Update local state
        helpers.setValue(newValue); // Update Formik's value
      }}
    />
  );
};

export default CheckboxField;



// import { useField } from 'formik';
// import React, { useState } from 'react';
// import { Switch } from 'react-native-paper';

// interface CheckboxFieldProps {
//   name: string;
// }

// const CheckboxField: React.FC<CheckboxFieldProps> = ({ name }) => {
//   const [field, helpers] = useField<boolean>(name);

//   const [isSwitchOn, setIsSwitchOn] = useState<boolean>(field.value)

//   // TypeScript expects `status` to be either "checked" | "unchecked" | "indeterminate"
//   // const checkboxStatus: 'checked' | 'unchecked' = field.value ? 'checked' : 'unchecked';

//   return (
//     // <Checkbox
//     //   status={checkboxStatus}
//     //   onPress={() => helpers.setValue(!field.value)}
//     // />

//     <Switch value={isSwitchOn} onValueChange={() => {
//       setIsSwitchOn(prevVal => prevVal = !field.value)
//       helpers?.setValue(!field.value)
//     }} />
//   );
// };

// export default CheckboxField;