import { MotiView } from 'moti';
import React, { ReactNode } from 'react';

const MotiAnimatedSection = ({children}: {children: ReactNode}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", duration: 500 }}
    >
      {children}
    </MotiView>
  )
}

export default MotiAnimatedSection;