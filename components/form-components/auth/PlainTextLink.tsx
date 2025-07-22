import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import { LinkProps } from '@/types';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const PlainTextLink = ({text, linkText, route, bodyStyle, linkStyle}: LinkProps) => {
    return (
      <View
        style={[{
          justifyContent: "center",
          alignItems:"center",
          flexDirection: "row",
          gap: 4
        }, (bodyStyle && bodyStyle)]}
      >
        <Text style={{color: Theme.text, fontSize: SIZES.contentText}}>{text}</Text>
        <Link
          href={route}
          style={[{color: Theme.text, fontSize: SIZES.contentText, fontWeight: "700"}, (linkStyle && linkStyle)]}
        >
          {linkText}
        </Link>
      </View>
    );
}
export default PlainTextLink;