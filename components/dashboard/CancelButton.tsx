import { Theme } from '@/constants/theme'
import { UserData } from '@/types'
import { BASE_URL } from '@/utils'
import React from 'react'
import ActionButton from './ActionButton'

const CancelButton = ( {userData}: {userData: UserData} ) => {
    const [loading, setLoading] = React.useState<boolean>(false);

    const membershipCancellationHandler = async () => {
        try {
            setLoading(true)

            if (!userData) throw new Error("Not logged in");

            console.log("userData >>", userData)

            const response = await fetch(`${BASE_URL}/api/cancel-subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: userData?.stripeSubscriptionId }),
            });

            const data = await response.json();

            console.log(data)
            
            // await updateDoc(userData, {
            //   membershipPlan: {
            //       plan: "",
            //       status: "canceled",
            //       since: Timestamp.fromDate(new Date())
            //     },
            // });
        }
        catch( error: any ) {
            console.error(error)
            setLoading(false)
        }
        finally {
            setLoading(false)
        }
    }

  return (
    <ActionButton
        title="Cancel Membership"
        onPress={membershipCancellationHandler}
        mode="elevated"
        buttonColor={Theme.accent}
        loading={loading}
    />
  )
}

export default CancelButton