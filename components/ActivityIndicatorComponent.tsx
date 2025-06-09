import STYLES from '@/constants/styles'
import { Theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import SafeAreaLayout from './layout/SafeAreaLayout'

const ActivityIndicatorComponent = () => {
  return (
    <SafeAreaLayout>
        <View style={STYLES.childContentCentered}>
            <ActivityIndicator size="large" color={Theme.accent} />
        </View>
    </SafeAreaLayout>
  )
}

export default ActivityIndicatorComponent