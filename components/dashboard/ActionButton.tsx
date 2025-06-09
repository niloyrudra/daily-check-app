import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import { MotiView } from 'moti'
import React from 'react'
import { ActivityIndicator, StyleProp, Text, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

interface ActionButtonProps {
    title: string,
    onPress: () => void,
    mode?: ButtonMode,
    buttonColor?: string | null, // ColorValue | undefined,
    buttonStyle?: StyleProp<ViewStyle>, // ColorValue | undefined,
    loading: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({title, onPress, mode, buttonColor, buttonStyle, loading}) => {
  return (
    <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", duration: 500 }}
    >
          {loading ? 
            (<ActivityIndicator size="large" color={Theme.secondary} />) : (
              <Button
                mode={mode || "contained"}
                buttonColor={buttonColor ? buttonColor : Theme.primary}
                style={[{paddingVertical:6, borderRadius:30 }, (buttonStyle && buttonStyle)]}
                onPress={onPress}
              >
                <Text style={{fontSize: SIZES.title, color: "#FFFFFF", paddingVertical: 6}}>{title}</Text>
                
              </Button>
            )
          }
    </MotiView>
  )
}

export default ActionButton;