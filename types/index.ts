import { Feather } from "@expo/vector-icons"
import { Href } from "expo-router"
import { User } from "firebase/auth"
import { FieldValue, Timestamp } from "firebase/firestore"
import { ReactNode } from "react"
import { ColorValue, InputModeOptions, KeyboardType, StyleProp, TextStyle, ViewStyle } from "react-native"

type WritableTimestamp = Timestamp | FieldValue;

type Plan = "" | "basic" | "premium"; //  "free" | "monthly" | "yearly";

type Contact = {
  contactName?: string,
  phoneNumber: string,
  verified: boolean,
}

type MembershipPlan = {
  plan: Plan,
  status: "active" | "canceled" | "trialing" | "pending",
  since: WritableTimestamp
}

type UserData = {
  name: string,
  zipCode: string,
  country: string,
  email: string,
  emailVerified: boolean,
  phoneNumber: string,
  phoneNumberVerified: boolean,
  optInStatus?: boolean,
  // Two distinct contacts
  contactNumbers: {
    contact1: Contact,
    contact2: Contact,
  },
  // any schedule flags by id
  schedules: Record<string, boolean>,

  membershipPlan: MembershipPlan,
  createdAt: WritableTimestamp,
  state?: null | undefined | boolean,
  
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  paymentHistory?: {
    type: 'paid' | 'failed',
    at: WritableTimestamp
  }[]
}

type AuthUser =  User | null;


type InputProps = { // extends TextInputProps -> better approach
  value: string,
  placeholder?: string,
  onChange: (text: string) => void,
  onBlur?: (e?: any) => void,
  // onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void,
  multiline?: boolean,
  numberOfLines?: number,
  maxLength?: number,
  inputMode?: InputModeOptions | undefined,
  keyboardType?: KeyboardType | undefined,
  placeholderTextColor?: ColorValue | undefined,
  isPassword?: boolean,
  contentContainerStyle?: StyleProp<ViewStyle>
}


// LINK Props
type LinkProps = {
  text: string,
  linkText: string,
  route: Href
}

// BANNER Props
type BannerProps = {
  width?: number,
  height?: number
}
// TITLE Props
type TitleProps = {
  title: string,
  wrapperStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
}
// ACTION BUTTON Props
type SubmitButtonProps = {
  buttonTitle?: string,
  onSubmit: () => void,
  buttonStyle?: StyleProp<ViewStyle>,
  buttonTextStyle?: StyleProp<TextStyle>,
  isLoading?: boolean,
  disabled?: boolean
}
// TEXT_INPUT Props
type EyeProps = {
  onChange: () => void,
  isSecureTextEntry: boolean,
  style?: StyleProp<ViewStyle>
}

type LessonProps = {
    language: string,
    iconComponent: ReactNode,
    children?: ReactNode | undefined,
    style?: StyleProp<ViewStyle>
    buttonStyle?: StyleProp<ViewStyle>
}

type FloatingArrowButtonProps = {
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  iconName: keyof typeof Feather.glyphMap; // ✅ Only valid Feather icon names
  iconSize?: number;
  iconColor?: ColorValue
};

export {
  AuthUser, BannerProps, Contact, EyeProps, FloatingArrowButtonProps, InputProps, LessonProps, LinkProps, MembershipPlan, Plan, SubmitButtonProps, TitleProps, UserData
}

