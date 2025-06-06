import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import { SubmitButtonProps } from '@/types';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ActionPrimaryButton = ( {
        buttonTitle="Submit",
        onSubmit,
        buttonStyle,
        buttonTextStyle,
        isLoading,
        disabled=false
    }: SubmitButtonProps ) => {

    if(isLoading) return (<ActivityIndicator size="large" color={Theme.accent} />)
                
    return (
        <TouchableOpacity
            style={[ STYLES.childContentCentered, STYLES.boxShadow, styles.content, {backgroundColor: Theme.accent/*"#2f7d32"*/}, (buttonStyle && buttonStyle)]} // "#0a7ea4"
            onPress={onSubmit}
            disabled={disabled}
        >
            <Text style={[STYLES.actionButtonTextStyle, (buttonTextStyle && buttonTextStyle)]}>{buttonTitle}</Text>
        </TouchableOpacity>
    );
}
export default ActionPrimaryButton;

const styles = StyleSheet.create({
    content: {
        borderRadius: 40,
        height: SIZES.buttonHeight,
        marginBottom: SIZES.marginBottom,
        paddingHorizontal: 30
    }
})