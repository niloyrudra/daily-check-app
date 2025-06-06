import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import React from 'react';
import { Text } from "react-native-paper";

const SectionTitle = ({title}: {title:string}) => {
  return (<Text variant="titleLarge" style={{ color: Theme.text, fontSize: SIZES.title, marginBottom: 10 }}>
        {title}
    </Text>
  )
}

export default SectionTitle;
