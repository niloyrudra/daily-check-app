import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const SkipButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.skipButton}>
      <Text style={{fontSize: SIZES.title, color: Theme.primary}}>SKIP</Text>
    </TouchableOpacity>
  )
}

export default SkipButton;

const styles = StyleSheet.create({
  skipButton: {
    position: "absolute",
    right: 20,
    top: 30,
  },
});