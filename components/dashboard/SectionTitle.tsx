import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import React from 'react';
import { Text } from "react-native-paper";

const SectionTitle = ({title}: {title:string}) => {
  return (
    <Text variant="titleLarge" style={{ color: Theme.primary, fontSize: SIZES.title, marginBottom: 10, fontWeight: 800 }}>
      {title}
    </Text>
  )
}

export default SectionTitle;
