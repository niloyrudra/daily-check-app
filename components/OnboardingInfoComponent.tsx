import SIZES from '@/constants/size'
import STYLES from '@/constants/styles'
import { Theme } from '@/constants/theme'
import { FontAwesome6 } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

type FontAwesome6IconName = keyof typeof FontAwesome6.glyphMap;

interface InfoProps {
  iconName: FontAwesome6IconName,
  content: string
}

const OnboardingInfoComponent: React.FC<InfoProps> = ({iconName, content}) => {
  return (
    <View style={[STYLES.childContentCentered, {gap: 10}]}>
        <FontAwesome6 name={iconName} size={36} color={Theme.link} />
        <Text
            style={{
                color: Theme.primary,
                fontSize: SIZES.contentText,
                textAlign: "center"
            }}
        >
            {content && content}
        </Text>
    </View>
  )
}

export default OnboardingInfoComponent