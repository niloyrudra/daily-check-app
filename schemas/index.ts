import * as Yup from "yup";

const phoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+[1-9]\d{1,14}$/, "Phone number must be in E.164 format (e.g. +1234567890)")
    .required("Phone number is required"),
  code: Yup.string()
    .min(4, "Code too short")
    .max(8, "Code too long"),
});

const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name requires two characters minimum.")
    .required("Name is required"),
  phone: Yup.string()
    .matches(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format (e.g. +1234567890)")
    .required("Phone is required"),
  code: Yup.string()
    .min(4, "Code too short")
    .max(8, "Code too long"),
});

export {
  contactSchema, phoneSchema
};

