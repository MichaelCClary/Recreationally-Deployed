import * as yup from "yup";

const NewCollectionSchema = {
    name: yup.string().required("Required").min(3, "Collection must contain at least 3 characters"),
};

export default NewCollectionSchema;