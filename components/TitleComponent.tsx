import { Theme } from '@/constants/theme';
import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

const TitleComponent = ({title, style, titleStyle}: {title: string, style?: StyleProp<ViewStyle>, titleStyle?: StyleProp<TextStyle>}) => {
  return (
    <View
      style={[
        {alignItems:"center"},
        style && style
      ]}
    >
      <Text style={[{color: Theme.primary, fontSize:24, fontWeight: "800" }, (titleStyle && titleStyle)]}>
        {title}
      </Text>
    </View>
  )
}

export default TitleComponent;