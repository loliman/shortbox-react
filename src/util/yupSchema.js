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

export const SeriesSchema = Yup.object().shape({
    title: Yup.string()
        .required('Pflichtfeld'),
    publisher: Yup.string()
        .required('Pflichtfeld'),
    volume: Yup.number("Bitte geben Sie eine Zahl ein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    startyear: Yup.number("Bitte geben Sie eine Zahl ein")
        .min(1900, "Das Jahr muss größer als 1900 sein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    endyear: Yup.number("Bitte geben Sie eine Zahl ein")
        .min(1900, "Das Jahr muss größer als 1900 sein")
        .integer("Bitte geben Sie eine Zahl ein")
});