import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
    name: Yup.string()
        .required('Pflichtfeld'),
    password: Yup.string()
        .required('Pflichtfeld')
});

export const PublisherSchema = Yup.object().shape({
    name: Yup.string()
        .required('Pflichtfeld')
});