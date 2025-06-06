import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
// Types
import { InputProps } from '@/types';
// Constants
import SIZES from '@/constants/size';
// Components
import { Theme } from '@/constants/theme';
import ToggledEyeIcon from './auth/ToggledEyeIcon';

const TextInputComponent = ({
    value='',
    placeholder,
    onChange,
    onBlur,
    multiline=false,
    numberOfLines=1,
    maxLength=100,
    inputMode='text',
    keyboardType='default',
    placeholderTextColor,
    isPassword=false,
    contentContainerStyle={}
}: InputProps) => {
    const [ isSecureTextEntry, setIsSecureTextEntry ] = React.useState<boolean>(isPassword);
    const [ isFocused, setIsFocused ] = React.useState<boolean>(false);

  return (
    <View style={contentContainerStyle}>
        <TextInput
            placeholder={placeholder}
            value={value}
            keyboardType={keyboardType}

            style={[
                styles.input,
                ( isFocused && { borderColor: Theme.primary } ),
                ( multiline && {
                    fontSize: SIZES.fontSizeTextArea,
                    height: SIZES.textFieldHeight * numberOfLines,
                    textAlignVertical: 'top'
                })
            ]}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            placeholderTextColor={placeholderTextColor}
            enterKeyHint="done"
            inputMode={inputMode}
    
            secureTextEntry={ isSecureTextEntry ?? isPassword }

            onChangeText={onChange}
            onFocus={() => setIsFocused(prevValue => prevValue = ! prevValue)}
            onBlur={onBlur}
        />

        {
            isPassword && (<ToggledEyeIcon onChange={() => setIsSecureTextEntry( prevValue => prevValue = !prevValue )} isSecureTextEntry={isSecureTextEntry} />)
        }

    </View>
  )
}

export default TextInputComponent;

const styles = StyleSheet.create({
    container: {
        position:"relative",
        height: SIZES.textFieldHeight
    },
    input: {
        height: SIZES.textFieldHeight,
        paddingVertical: 8, //16,
        paddingHorizontal: 16, //16,
        borderRadius: 10, // 16,
        borderWidth: 1,
        borderColor: "#aaa",
        fontSize: SIZES.fontSizeTextInput,
        width: SIZES.screenBodyWidth
    }
});