import Logo from '@/assets/images/daily-check-app.png';
import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import React from 'react';
import { Image, View } from 'react-native';

const AuthTopBannerComponent = () => {
  return (
    <View style={STYLES.childContentCentered}>
        <Image
          source={Logo}
          style={{
            width: SIZES.logo.width,
            height: SIZES.logo.height,
            objectFit: "contain"
          }}
        />
    </View>
  )
}

export default AuthTopBannerComponent