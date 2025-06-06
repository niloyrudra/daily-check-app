import { Theme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface ArrowButtonProps {
  iconName?: FeatherIconName,
  size?: number
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ iconName="arrow-left", size=24 }) => {
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.arrowLeftButton}>
      <Feather name={iconName} size={size} color={Theme.primary} />
    </TouchableOpacity>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  arrowLeftButton: {
    position: 'absolute',
    left: 0,
    top: 20,
  }
});
