import { Theme } from '@/constants/theme'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import ActivityIndicatorComponent from '../ActivityIndicatorComponent'
import ActionButton from './ActionButton'

interface ButtonProps {
  title: string,
  onPress: () => void,
  buttonStyle?: StyleProp<ViewStyle>,
  isLoading?: boolean
}

const ActionOutlineButton: React.FC<ButtonProps> = ({title, onPress, buttonStyle, isLoading}) => {

  if (isLoading) return (<ActivityIndicatorComponent />)

  return (
    <ActionButton
      title={title}
      onPress={onPress}
      mode="outlined"
      buttonColor={"Transparent"}
      buttonStyle={[{borderWidth: 2, borderColor: Theme.accent}, (buttonStyle && buttonStyle)]}
      textStyle={{color: Theme.accent}}
    />
  )
}

export default ActionOutlineButton;