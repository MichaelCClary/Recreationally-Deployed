import * as yup from "yup";

const EditProfileSchema = {
    password: yup
        .string(),
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
};

export default EditProfileSchema;