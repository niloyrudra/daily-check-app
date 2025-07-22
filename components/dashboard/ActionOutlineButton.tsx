import { Theme } from '@/constants/theme'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import ActionButton from './ActionButton'

const ActionOutlineButton = ({title, onPress, buttonStyle}: {title: string, onPress: () => void, buttonStyle?: StyleProp<ViewStyle>}) => {

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