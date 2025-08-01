import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
// Types
import { InputProps } from '@/types';
// Constants
import SIZES from '@/constants/size';
// Components
import { Theme } from '@/constants/theme';
import ToggledEyeIcon from './auth/ToggledEyeIcon';

const COUNTRY_CODE = '+1';

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
    autoCapitalize="sentences",
    placeholderTextColor,
    isPassword=false,
    contentContainerStyle={}
}: InputProps) => {
    const [ isSecureTextEntry, setIsSecureTextEntry ] = React.useState<boolean>(isPassword);
    const [ isFocused, setIsFocused ] = React.useState<boolean>(false);

    const handleFocus = () => {
        setIsFocused(prevValue => prevValue = !prevValue)

        if (inputMode === "tel" && value.trim() === '') {
            onChange(COUNTRY_CODE);
        }
    };

    const handleTextChange = (text: string) => {
        if (inputMode !== "tel") {
            onChange(text);
            return;
        }

        // Prevent removing or altering the +1 prefix
        if (!text.startsWith(COUNTRY_CODE)) {
            text = COUNTRY_CODE + text.replace(/^\+?1?/, '');
        }

        onChange(text);
    };

    return (
        <View style={contentContainerStyle}>
            <TextInput
                placeholder={placeholder}
                value={value}
                keyboardType={keyboardType}
                autoFocus={false}
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
                placeholderTextColor={placeholderTextColor ?? Theme.primary}
                enterKeyHint="done"
                inputMode={inputMode}
                autoCapitalize={autoCapitalize}
                secureTextEntry={ isSecureTextEntry ?? isPassword }

                onChangeText={handleTextChange}
                // onChangeText={onChange}
                onFocus={handleFocus}
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
        color: Theme.primary,
        height: SIZES.textFieldHeight,
        textAlignVertical: "center",
        // paddingVertical: 8, //16,
        paddingHorizontal: 16, //16,
        borderRadius: 10, // 16,
        borderWidth: 1,
        borderColor: Theme.borderColor,
        fontSize: SIZES.fontSizeTextInput,
        width: SIZES.screenBodyWidth
    }
});