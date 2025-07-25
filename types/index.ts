import { Feather } from "@expo/vector-icons"
import { Href } from "expo-router"
import { User } from "firebase/auth"
import { FieldValue, Timestamp } from "firebase/firestore"
import { ColorValue, InputModeOptions, KeyboardType, StyleProp, TextStyle, ViewStyle } from "react-native"

type WritableTimestamp = Timestamp | FieldValue;

type AutoCapitalizeType = 'none' | 'sentences' | 'words' | 'characters';

type Plan = "" | "basic" | "premium"; //  "free" | "monthly" | "yearly";

type DependentType = {
  cat: boolean,
  dog: boolean,
  children: boolean,
  otherPet: boolean,
  extra: string,
};

type Contact = {
  contactName?: string,
  phoneNumber: string,
  verified: boolean,
}

type MembershipPlan = {
  plan: Plan,
  status: "active" | "canceled" | "trialing" | "pending" | "paused",
  since: WritableTimestamp
}

type UserData = {
  name: string,
  zipCode: string,
  country: string,
  email: string,
  emailVerified?: boolean,
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
  }[],
  automation?: {
    startingDate: Timestamp | null,
    endingDate: Timestamp | null,
    startingTime: string | null, // Timestamp | null,
    responseTime?: number,
    lastInteraction: Timestamp | null,
    scheduleStatus: 'not_started' | 'text_sent' | 'followup_sent' | 'call_made' | 'pending' | 'done',
    lastChecked: Timestamp | null,
    advancedScheduler: boolean
  },
  dependents: DependentType
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
  autoCapitalize?: AutoCapitalizeType | undefined,
  placeholderTextColor?: ColorValue | undefined,
  isPassword?: boolean,
  contentContainerStyle?: StyleProp<ViewStyle>
}


// LINK Props
type LinkProps = {
  text: string,
  linkText: string,
  route: Href,
  bodyStyle?: StyleProp<ViewStyle>
  linkStyle?: StyleProp<TextStyle>
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

type FloatingArrowButtonProps = {
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  iconName: keyof typeof Feather.glyphMap; // ✅ Only valid Feather icon names
  iconSize?: number;
  iconColor?: ColorValue
};

type EmergencyFormValues = {
  children: boolean,
  dog: boolean,
  cat: boolean,
  otherPet: boolean,
  extra: string
};

type MailerFormValues = {
  name: string,
  email: string,
  message: string,
};

type LabelValueOption = {
  label: string,
  value: string
}

// type DropdownProps = {
//   options: LabelValueOption[];
// };

export { AuthUser, BannerProps, Contact, DependentType, EmergencyFormValues, EyeProps, FloatingArrowButtonProps, InputProps, LabelValueOption, LinkProps, MailerFormValues, MembershipPlan, Plan, SubmitButtonProps, TitleProps, UserData }

