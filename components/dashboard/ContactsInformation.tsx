import SIZES from '@/constants/size';
import STYLES from '@/constants/styles';
import { Theme } from '@/constants/theme';
import { Contact } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import React from 'react';
import { Card, Divider, Text } from "react-native-paper";

interface ContactsInformationData {
    contact1: Contact | undefined,
    contact2: Contact | undefined,
    membershipPlan: string | undefined
}

const ContactsInformationComponent = ({ contact1, contact2, membershipPlan }: ContactsInformationData) => {

    if (!contact1 && !contact2) {
        return (
            <Card style={STYLES.card}>
                <Text variant="bodyMedium" style={{ color: Theme.borderColor, fontSize: SIZES.contentText }}>
                    No contact(s) verified yet.
                </Text>
            </Card>
        );
    }

    const contactNumbers = { contact1, contact2 };

    return (
        <Card style={STYLES.card} mode='contained'>
            {contactNumbers?.contact1?.phoneNumber || contactNumbers?.contact2?.phoneNumber
            ?
                (            
                    Object.entries(contactNumbers).map(([key, value]) => {
                        // const {contactName, phoneNumber, verified } = value;
                        if( !value?.phoneNumber ) return (
                            <React.Fragment key={key}>
                                <Text variant="bodyMedium" style={{ color: Theme.borderColor, fontSize: SIZES.contentText }}>
                                    {key === 'contact1' ? "Primary" : "Secondary"} contact&apos;s not added yet.
                                </Text>
                                {key === 'contact1' && (<Divider style={{ backgroundColor: "#333", marginTop: 10 }} />)}
                            </React.Fragment>
                        );

                        return (
                            <React.Fragment key={key}>
                                <Card.Content style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 }, (membershipPlan && membershipPlan === "basic" && key === 'contact2' && {opacity: 0.25})]}>
                                    <Text style={{ color: Theme.text, fontSize: SIZES.contentText }}>  
                                        {value?.contactName || "Contact"}: {value?.phoneNumber}
                                    </Text>

                                    {value?.verified
                                        ? (<FontAwesome5 name="check-circle" size={24} color="green" />)
                                        : (<MaterialCommunityIcons name="timer-sand-complete" size={24} color="orange" />) // (<MaterialIcons name="pending-actions" size={24} color="orange" />)
                                    }

                                </Card.Content>

                                {key === 'contact1' && (<Divider style={{ backgroundColor: "#333", marginVertical: 5 }} />)}

                            </React.Fragment>
                        )
                    })
                )
            :
                (<Text variant="bodyMedium" style={{ color: Theme.borderColor, fontSize: SIZES.contentText }}>No contact(s) verified yet.</Text>)}
        </Card>
    )
}

export default ContactsInformationComponent;