import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import { View } from 'moti'
import React from 'react'
import { ActivityIndicator, StyleProp, Text, TextStyle, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'
import MotiAnimatedSection from './MotiAnimatedSection'

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

interface ActionButtonProps {
  title: string,
  onPress: () => void,
  mode?: ButtonMode,
  buttonColor?: string | null, // ColorValue | undefined,
  buttonStyle?: StyleProp<ViewStyle>, // ColorValue | undefined,
  textStyle?: StyleProp<TextStyle>, // ColorValue | undefined,
  loading?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({title, onPress, mode, buttonColor, buttonStyle, textStyle, loading}) => {
  return (
    <MotiAnimatedSection>
      {loading
        ? 
          (<ActivityIndicator size="large" color={Theme.secondary} />)
        : (
          <View
            style={{width:"auto", alignItems: "center", justifyContent: "center" }}
          >

            <Button
              mode={mode || "contained"}
              buttonColor={buttonColor ? buttonColor : Theme.primary}
              style={[{height: 55, borderRadius:30, alignItems: "center", justifyContent: "center" }, (buttonStyle && buttonStyle)]}
              onPress={onPress}
            >
              <Text style={[{fontSize: SIZES.title, color: "#FFFFFF"}, (textStyle && textStyle)]}>{title}</Text>
            </Button>
          </View>
        )
      }
    </MotiAnimatedSection>
  )
}

export default ActionButton;