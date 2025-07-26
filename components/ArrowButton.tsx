import { Theme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { Route, router } from 'expo-router';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface ArrowButtonProps {
  iconName?: FeatherIconName,
  size?: number,
  route?: Route,
  buttonStyle?: StyleProp<ViewStyle>
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ iconName="arrow-left", size=24, route, buttonStyle }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if(route) router.push(route)
        else router.back()
      }}
      style={[styles.arrowLeftButton, (buttonStyle && buttonStyle)]}
    >
      <Feather name={iconName} size={size} color={Theme.primary} />
    </TouchableOpacity>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  arrowLeftButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 3
  }
});
