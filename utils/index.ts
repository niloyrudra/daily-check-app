// Twilio Error Map
const errorMap: Record<number, string> = {
  21408: "SMS/Text message is not allowed to this country.",
  21610: "User has opted out of messages. They must reply START to receive messages again.",
  21614: "Invalid phone number. Please use the E.164 format [e.g. +1(555)555-5555].",
  20429: "Too many OTP requests. Please wait a while.",
  60200: "Invalid phone number format.",
  60203: "Your phone number is blacklisted.",
  20404: "Verification SID not found or deleted.",
};

// Error message helper
const getErrorMessage = (error: any): string => {
  if (error?.code && errorMap[error.code]) return errorMap[error.code];
  if (error?.message) return error.message;
  return "An unexpected error occurred.";
};

// Time Format (24hr to 12hr)
const formatTimeTo12Hour = (time24: string): string => {
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // convert 0 to 12
  return `${hour}:${minute} ${ampm}`;
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";

export {
  BASE_URL, formatTimeTo12Hour, getErrorMessage
};

