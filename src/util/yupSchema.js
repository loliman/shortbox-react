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
        .max(255, 'Maximal 255 Zeichen')
});

export const SeriesSchema = Yup.object().shape({
    title: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    publisher: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    volume: Yup.number("Bitte geben Sie eine Zahl ein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    startyear: Yup.number("Bitte geben Sie eine Zahl ein")
        .min(1900, "Das Jahr muss größer als 1900 sein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    endyear: Yup.number("Bitte geben Sie eine Zahl ein")
        .min(Yup.ref('startyear'), "Das Jahr muss mindest dem Startjahr entsprechen")
        .integer("Bitte geben Sie eine Zahl ein")
});

export const IssueSchema = Yup.object().shape({
    title: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    publisher: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    seriestitle: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    seriesvolume: Yup.number("Bitte geben Sie eine Zahl ein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    number: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    limitation: Yup.number("Bitte geben Sie eine Zahl ein")
        .integer("Bitte geben Sie eine Zahl ein"),
    pages: Yup.number("Bitte geben Sie eine Zahl ein")
        .integer("Bitte geben Sie eine Zahl ein"),
    releasedate: Yup.date(),
    price: Yup.number("Bitte geben Sie eine Zahl ein")
        .integer("Bitte geben Sie eine Zahl ein"),
    currency: Yup.string()
        .max(3, 'Maximal 3 Zeichen')
});