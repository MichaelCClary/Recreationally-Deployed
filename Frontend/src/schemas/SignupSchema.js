import * as yup from "yup";

const SignupSchema = {
    username: yup.string().required("Required"),
    password: yup
        .string()
        .min(6, "Password must contain at least 6 characters")
        .required("Enter your password"),
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
};

export default SignupSchema;