import SIZES from '@/constants/size'
import STYLES from '@/constants/styles'
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5'
import React from 'react'
import { View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import MotiAnimatedSection from './dashboard/MotiAnimatedSection'

const GreetingCard = ({greet}: {greet:string}) => {
  return (
    <MotiAnimatedSection>
        <Card style={STYLES.card} mode='contained' >
          <View style={{justifyContent: "center", alignItems: "center", gap: 10}}>
            
            <FontAwesome5 name="check-circle" size={32} color="green" />
            <Text variant="bodyMedium" style={{ color: "green", fontSize: SIZES.contentText, textAlign: "center" }}>
              {greet}
            </Text>
          </View>
        </Card>
    </MotiAnimatedSection>
  )
}

export default GreetingCard;