import SIZES from '@/constants/size';
import { Theme } from '@/constants/theme';
import { Contact } from '@/types';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Divider, Text } from "react-native-paper";

interface ContactsInformationData {
    contact1: Contact | undefined,
    contact2: Contact | undefined 
}

const ContactsInformationComponent = ({ contact1, contact2 }: ContactsInformationData) => {

    if (!contact1 && !contact2) {
        return (
            <Card style={styles.card}>
                <Text variant="bodyMedium" style={{ color: Theme.borderColor, fontSize: SIZES.contentText }}>
                No contact(s) verified yet.
                </Text>
            </Card>
        );
    }

    const contactNumbers = { contact1, contact2 };

    return (
        <Card style={styles.card}>
            {contactNumbers?.contact1?.phoneNumber || contactNumbers?.contact2?.phoneNumber
            ?
                (            
                    Object.entries(contactNumbers).map(([key, value]) => {
                        // const {contactName, phoneNumber, verified } = value;
                        if( !value?.phoneNumber ) return (
                            <React.Fragment key={key}>
                                <Text variant="bodyMedium" style={{ color: Theme.borderColor, fontSize: SIZES.contentText }}>
                                    {key === 'contact1' ? "Primary" : "Secondary"} contact&apos;s not verified yet.
                                </Text>
                            </React.Fragment>
                        );

                        return (
                            <React.Fragment key={key}>
                                <Card.Content style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 }}>
                                    <Text style={{ color: Theme.text, fontSize: SIZES.contentText }}>{value?.contactName || "Contact"}: {value?.phoneNumber}</Text>
                                    {value?.verified ? (
                                    <FontAwesome5 name="check-circle" size={20} color="green" />
                                    ) : (
                                    <MaterialIcons name="pending-actions" size={24} color="orange" />
                                    )}
                                </Card.Content>
                            {key === 'contact1' && (<Divider style={{ backgroundColor: "#333" }} />)}
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

const styles = StyleSheet.create({
    card: {
        backgroundColor: "transparent",
        marginBottom: 20,
        padding: 10,
        // borderWidth: 1,
        // borderColor: Theme.borderColor
        // elevation: 0,
        // boxShadow: "none"
    }
});