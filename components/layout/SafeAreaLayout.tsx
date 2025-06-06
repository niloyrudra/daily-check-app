import STYLES from '@/constants/styles';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaLayout = ({children}: {children: ReactNode}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <View style={[STYLES.defaultContainer]}>
          {children && children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default SafeAreaLayout;