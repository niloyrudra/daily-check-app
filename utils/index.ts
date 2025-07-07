// Twilio Error Map
const errorMap: Record<number, string> = {
  21408: "SMS/Text message is not allowed to this country.",
  21610: "User has opted out of messages. They must reply START to receive messages again.",
  21614: "Invalid phone number. Please use the E.164 format.",
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

export {
  getErrorMessage
};

