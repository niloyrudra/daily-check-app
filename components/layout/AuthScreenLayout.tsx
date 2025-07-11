import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import React, { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import AuthTopBannerComponent from '../AuthTopBannerComponent';
import TitleComponent from '../TitleComponent';
import KeyboardAvoidingViewLayout from './KeyboardAvoidingViewLayout';
import SafeAreaLayout from './SafeAreaLayout';

const AuthScreenLayout = ({title, children, isScrollable=false}: {title?: string, children: ReactNode, isScrollable?: boolean}) => {
    return (
    <SafeAreaLayout>
        <KeyboardAvoidingViewLayout>
            
            {isScrollable
                ? (<ScrollView
                style={{flex:1}}
                keyboardShouldPersistTaps="handled"  
            >

                <View style={[STYLES.container]}>
                    {/* Banner */}
                    <AuthTopBannerComponent />

                    {/* Screen Title */}
                    {title && (
                        <TitleComponent
                            title={title}
                            titleStyle={{
                                fontSize: 32,
                                color: Theme.primary    
                            }}
                            style={{
                                marginBottom: 20
                            }}
                        />
                    )}

                    {children && children}

                </View>

            </ScrollView>)
            
            :   (<View style={[STYLES.container]}>
                    {/* Banner */}
                    <AuthTopBannerComponent />

                    {/* Screen Title */}
                    {title && (
                        <TitleComponent
                            title={title}
                            titleStyle={{
                                fontSize: 32
                            }}
                            style={{
                                marginBottom: 20
                            }}
                        />
                    )}

                    {children && children}

                </View>
            )
        
        }
            

        </KeyboardAvoidingViewLayout>
    </SafeAreaLayout>
  )
}

export default AuthScreenLayout;