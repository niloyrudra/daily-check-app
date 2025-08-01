import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import ActionPrimaryButton from "@/components/form-components/ActionPrimaryButton";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import TitleComponent from "@/components/TitleComponent";
import SIZES from "@/constants/size";
import STYLES from "@/constants/styles";
import { Theme } from "@/constants/theme";
import { Text } from "react-native-paper";


const TermsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <AuthScreenLayout title="Terms And Conditions" isScrollable={true}>

      <View style={STYLES.infoContainer}>

        <View style={{alignItems:"center"}}>
          <Text style={[styles.textHeader]} variant="bodyLarge">Daily Check-App Subscription Service</Text>
          <Text style={[styles.textHeader]} variant="bodyLarge">Zero Point 963 Inc.</Text>
          <Text style={[styles.textHeader]} variant="bodyLarge">Effective Date: 8/8/2025</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="1. ACCEPTANCE OF TERMS"
          />
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">By subscribing to and using the Daily Check-App service ("Service") provided by Zero Point 963 Inc. ("Company," "we," "us," or "our"), you ("Subscriber," "you," or "your") agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, do not use the Service.</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="2. SUBSCRIPTION AND CANCELLATION"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">2.1 Subscription Plans and Pricing</Text>
          <Text style={[styles.textBodyMedium, {marginTop:10, fontWeight:"800"}]} variant="bodyMedium">Basic Plan: $0.99 per month plus tax</Text>
          <Text style={[styles.textBodyMedium, {fontWeight:"800"}]} variant="bodyMedium">Premium Plan: $2.99 per month plus tax</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">2.2 Billing Terms</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">All subscriptions include a free 7-day trial period</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">After the trial period expires, you will be charged annually based on your selected plan:</Text>
          
          <Text style={[styles.textBodyMedium, {marginTop:10, fontWeight:"800"}]} variant="bodyMedium">Basic Plan: $11.88 per year (equivalent to $0.99/month) plus tax</Text>
          <Text style={[styles.textBodyMedium, {fontWeight:"800"}]} variant="bodyMedium">Premium Plan: $35.88 per year (equivalent to $2.99/month) plus tax</Text>
          
          <Text style={[styles.textBodyMedium, {marginTop:10}]} variant="bodyMedium">All subscription fees are non-refundable under any circumstances
No pro-rated refunds will be provided for partial subscription periods</Text>

          <Text style={[styles.textBodyLarge]} variant="bodyLarge">2.3 Subscription Cancellation</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">To cancel your subscription, you must send an email to: dailycheckapp9@gmail.com</Text>
          
          <Text style={[styles.textBodyMedium, {marginTop:10}]} variant="bodyMedium">Your cancellation email must include:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The phrase "cancel my subscription"</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Your full name</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Your phone number associated with the subscription</Text>

          <Text style={[styles.textBodyMedium, {marginTop:10}]} variant="bodyMedium">No other method of cancellation will be accepted. Cancellation requests submitted through any other means (including but not limited to phone calls, text messages, or third-party platforms) will not be processed.</Text>
          <Text style={[styles.textBodyMedium, {fontWeight: "700"}]} variant="bodyMedium">Important: Cancellation will prevent future billing cycles but will not result in any refund of previously paid subscription fees.</Text>

          <Text style={[styles.textBodyLarge]} variant="bodyLarge">2.4 Service Pause Option</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You may temporarily pause your service by using the "Pause Service" button within the Daily Check-App. During a service pause:</Text>

          <Text style={[styles.textBodyMedium, {marginTop:10}]} variant="bodyMedium">Daily check-in messages will be temporarily suspended</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Your subscription will remain active and billing will continue</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You may resume service at any time by using the "Resume Service" option within the app</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Paused time does not extend your subscription period or entitle you to refunds</Text>

        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="3. SERVICE DESCRIPTION"
          />
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The Daily Check-App is a subscription-based service that sends daily text messages/calls to subscribers asking if they are okay. The Service operates as follows:</Text>
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">Basic Subscription:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Daily text messages will be sent to your registered phone number</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You are expected to respond within a predetermined timeframe (1, 2, or 3 hours)</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">If you do not respond within the appointed time, your designated Safety Contact will be notified via one (1) text message only.</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You may designate one (1) Safety Contact who will receive notifications</Text>
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">Premium Subscription:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Daily text messages will be sent to your registered phone number</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">If you do not respond within 1 hour, a second text message will be sent</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">If you do not respond within 1 hour after the second text message, the system will call you</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">If the phone call goes unanswered, your designated Safety Contact(s) will be notified via one (1) text message only</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You may designate up to two (2) Safety Contacts who will receive notifications</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="4. IMPORTANT SERVICE LIMITATIONS"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">4.1 NOT AN EMERGENCY SERVICE</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">THE SERVICE IS NOT AN AMBULANCE SERVICE, EMERGENCY RESPONSE SERVICE, OR MEDICAL MONITORING SERVICE. We will not call an ambulance, emergency services, or medical personnel under any circumstances, regardless of whether you respond to our messages or calls or not.</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">4.2 Emergency Response Responsibility</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">In case of a medical emergency or any emergency situation:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">It is entirely the responsibility of the Subscriber and/or the Safety Contact(s) to call 911 or emergency services</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">It is entirely the responsibility of the Subscriber and/or the Safety Contact(s) to seek appropriate medical attention at the nearest hospital or medical facility</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The Company bears no responsibility for emergency response of any kind</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="5. SAFETY CONTACTS"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">5.1 Designation and Responsibilities</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Basic Subscription: You must provide the contact information for one (1) Safety Contact</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Premium Subscription: You may provide the contact information for up to two (2) Safety Contacts</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Safety Contacts will receive only one (1) text notification if you fail to respond within the appointed timeframe</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">It is entirely up to the Safety Contact(s) to check on the Subscriber and any dependents promptly</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The Company has no control over or responsibility for the actions or inactions of Safety Contacts</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">5.2 Access and Trust Requirements</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You must ensure that your Safety Contact(s) either have access to your dwelling or will arrange for appropriate assistance to enter if necessary</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You must fully trust the integrity of your Safety Contact(s) as they may have access to your dwelling, your person, and your dependents</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You are solely responsible for making arrangements with your Safety Contact(s) regarding how they may enter your dwelling</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You must provide clear instructions to your Safety Contact(s) regarding their responsibilities</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="6. LIMITATION OF LIABILITY AND SERVICE FAILURES"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">6.1 No Liability for Service Failures</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">THE COMPANY IS NOT RESPONSIBLE OR LIABLE FOR ANY DAMAGES RESULTING FROM SERVICE FAILURES. Service failures may include, but are not limited to:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">System downtime or technical malfunctions</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Subscriber's texting plan being full or unable to receive messages</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Subscriber being out of cellular service range</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Lack of service from the Subscriber's cellular provider</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Dead or malfunctioned phone battery</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Network outages or connectivity issues</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Software or hardware malfunctions</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Third-party service interruptions</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">6.2 Complete Limitation of Liability</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">THE COMPANY IS IN NO WAY LIABLE FOR ANY OUTCOMES IN WHICH IT MAY BE IMPLICATED, DIRECTLY OR INDIRECTLY. This includes but is not limited to:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Personal injury or death</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Property damage of any kind</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Psychological or emotional harm</Text>
        
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Financial losses</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Damages caused by Safety Contacts entering your dwelling</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Actions or inactions of Safety Contacts</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Delayed or failed emergency response</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Medical complications or emergencies</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Any consequences resulting from the use or failure of the Service</Text>

          <Text style={[styles.textBodyLarge]} variant="bodyLarge">6.3 Property and Dwelling Access</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">THE COMPANY IS NOT LIABLE FOR ANY PROPERTY OR PSYCHOLOGICAL DAMAGE CAUSED BY THE ENTRY INTO YOUR DWELLING BY YOUR APPOINTED SAFETY CONTACT(S). This includes but is not limited to:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Damage to doors, windows, locks, or other property during entry</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Theft or damage to personal belongings</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Privacy violations</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Emotional distress caused by unexpected entry</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Any other consequences of dwelling access by Safety Contacts</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="7. SUBSCRIBER RESPONSIBILITIES"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">7.1 General Responsibilities</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Maintain an active cellular phone service capable of receiving text messages</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Respond to daily check-in messages within the specified timeframe</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Keep your contact information and Safety Contact information current and accurate</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Ensure your Safety Contacts are aware of their responsibilities and have appropriate access arrangements</Text>

          <Text style={[styles.textBodyLarge]} variant="bodyLarge">7.2 Safety Contact Arrangements</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You are solely responsible for vetting and selecting trustworthy Safety Contacts</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You must make clear arrangements with Safety Contacts regarding dwelling access</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You must inform Safety Contacts of their responsibilities under this Service</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You must ensure Safety Contacts have the means and authority to check on your wellbeing</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="8. DISCLAIMERS"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">8.1 No Medical or Emergency Services</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The Service is not a substitute for:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Professional medical monitoring</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Emergency alert systems</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Healthcare services</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Security services</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Emergency response services</Text>

          <Text style={[styles.textBodyLarge]} variant="bodyLarge">8.2 Technology Limitations</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The Service relies on cellular networks, internet connectivity, and electronic systems that may fail or malfunction. The Company makes no guarantees regarding the reliability, availability, or functionality of these systems.</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="9. THIRD-PARTY LIABILITY"
          />
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">THE COMPANY IS NOT LIABLE FOR ANY PERSONAL OR PROPERTY DAMAGES CAUSED BY:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The use of the app</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The cellular phone housing the app</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Any third party related or unrelated to the Service</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Cellular service providers</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Internet service providers</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Safety Contacts</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Emergency responders</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Healthcare providers</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Any other individuals or entities</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="10. INDEMNIFICATION"
          />
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">You agree to indemnify, defend, and hold harmless the Company, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Your use of the Service</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Your breach of these Terms</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Actions of your Safety Contacts</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Any emergency situations or lack of emergency response</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Any property damage or personal injury related to the Service</Text>
        </View>

        <View style={[styles.section]}>
          <TitleComponent
            title="11. GENERAL PROVISIONS"
          />
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">11.1 Entire Agreement</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">These Terms constitute the entire agreement between you and the Company regarding the Service and supersede all prior agreements and understandings.</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">11.2 Modification</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">The Company reserves the right to modify these Terms at any time. Changes will be effective upon posting to our website or app. Continued use of the Service constitutes acceptance of modified Terms.</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">11.3 Governing Law</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">These Terms shall be governed by and construed in accordance with the laws of [INSERT JURISDICTION], without regard to conflict of law principles.</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">11.4 Severability</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</Text>
          
          <Text style={[styles.textBodyLarge]} variant="bodyLarge">11.5 Contact Information</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">For questions regarding these Terms or the Service, contact:</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Email: dailycheckapp9@gmail.com</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">Company: Zero Point 963 Inc.</Text>
          <Text style={[styles.textBodyMedium]} variant="bodyMedium">BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.</Text>
        </View>


        {/* Submit Button */}
        <ActionPrimaryButton
          buttonTitle="Continue"
          onSubmit={() => router.back()}
        />

      </View>

    </AuthScreenLayout>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  textHeader: {
    color: Theme.primary,
    fontSize: SIZES.contentText,
    fontWeight:"800",
    marginBottom: 5
  },
  section: {
    alignItems:"flex-start",
    marginBottom: 20
  },
  textBodyLarge: {
    color: Theme.primary,
    fontSize: SIZES.contentText,
    fontWeight:"800",
    marginTop: 10,
    marginBottom: 5
  },
  textBodyMedium: {
    color: Theme.primary,
    fontSize: SIZES.contentText,
    marginTop: 5,
    marginLeft:0
  }
});