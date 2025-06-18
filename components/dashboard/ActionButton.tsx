import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, StyleProp, Text, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'
import MotiAnimatedSection from './MotiAnimatedSection'

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

interface ActionButtonProps {
  title: string,
  onPress: () => void,
  mode?: ButtonMode,
  buttonColor?: string | null, // ColorValue | undefined,
  buttonStyle?: StyleProp<ViewStyle>, // ColorValue | undefined,
  loading?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({title, onPress, mode, buttonColor, buttonStyle, loading}) => {
  return (
    <MotiAnimatedSection>
      {loading
        ? 
          (<ActivityIndicator size="large" color={Theme.secondary} />)
        : (
          <Button
            mode={mode || "contained"}
            buttonColor={buttonColor ? buttonColor : Theme.primary}
            style={[{height: 50, borderRadius:30, alignItems: "center", justifyContent: "center" }, (buttonStyle && buttonStyle)]}
            onPress={onPress}
          >
            <Text style={{fontSize: SIZES.title, color: "#FFFFFF"}}>{title}</Text>
          </Button>
        )
      }
    </MotiAnimatedSection>
  )
}

export default ActionButton;