import * as yup from "yup";

const LoginSchema = {
    username: yup.string().required("Required"),
    password: yup
        .string()
        .min(6, "Password must contain at least 6 characters")
        .required("Enter your password"),
};

export default LoginSchema;