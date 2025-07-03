import SIZES from '@/constants/size'
import { Theme } from '@/constants/theme'
import React from 'react'
import { Text, View } from 'react-native'
import ActionPrimaryButton from './form-components/ActionPrimaryButton'
import TitleComponent from './TitleComponent'

interface PlanProps {
  title: string,
  handler: () => void,
  detailedText: string,
  buttonText: string,
  disabled: boolean
}

const MembershipPlanOptionComponent: React.FC<PlanProps> = ({title, handler, detailedText, buttonText, disabled}) => {
  return (
    <View style={{ gap: 20, borderWidth: 1, borderColor: Theme.primary, borderRadius: 8, padding: 15}}>
      <TitleComponent title={title} titleStyle={{textAlign:"center", textTransform: "uppercase"}} />
      <Text style={{fontSize: SIZES.contentText, color: Theme.primary}}>
        {detailedText}
      </Text>
      <ActionPrimaryButton buttonTitle={buttonText} onSubmit={handler} disabled={disabled} />
    </View>
  )
}

export default MembershipPlanOptionComponent