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
        .max(255, 'Maximal 255 Zeichen'),
    addinfo: Yup.string()
        .max(2500, 'Maximal 2500 Zeichen')
});

export const SeriesSchema = Yup.object().shape({
    title: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    publisher: Yup.object().shape({
        name: Yup.string()
            .required('Pflichtfeld')
            .max(255, 'Maximal 255 Zeichen'),
    }),
    volume: Yup.number("Bitte geben Sie eine Zahl ein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    startyear: Yup.number("Bitte geben Sie eine Zahl ein")
        .min(1900, "Das Jahr muss größer als 1900 sein")
        .required("Pflichtfeld")
        .integer("Bitte geben Sie eine Zahl ein"),
    endyear: Yup.number("Bitte geben Sie eine Zahl ein")
        .min(Yup.ref('startyear'), "Das Jahr muss mindest dem Startjahr entsprechen")
        .integer("Bitte geben Sie eine Zahl ein"),
    addinfo: Yup.string()
        .max(2500, 'Maximal 2500 Zeichen')
});

export const IssueSchema = Yup.object().shape({
    title: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    series: Yup.object().shape({
        title: Yup.string()
            .required('Pflichtfeld')
            .max(255, 'Maximal 255 Zeichen'),
        volume: Yup.number("Bitte geben Sie eine Zahl ein")
            .required("Pflichtfeld")
            .integer("Bitte geben Sie eine Zahl ein"),
        publisher: Yup.object().shape({
            name: Yup.string()
                .required('Pflichtfeld')
                .max(255, 'Maximal 255 Zeichen')
        }),
    }),
    number: Yup.string()
        .required('Pflichtfeld')
        .max(255, 'Maximal 255 Zeichen'),
    format: Yup.string()
        .max(255, 'Maximal 255 Zeichen'),
    variant: Yup.string()
        .max(255, 'Maximal 255 Zeichen'),
    limitation: Yup.number("Bitte geben Sie eine Zahl ein")
        .integer("Bitte geben Sie eine Zahl ein"),
    pages: Yup.number("Bitte geben Sie eine Zahl ein")
        .integer("Bitte geben Sie eine Zahl ein"),
    releasedate: Yup.date(),
    price: Yup.number("Bitte geben Sie eine Zahl ein")
        .integer("Bitte geben Sie eine Zahl ein"),
    currency: Yup.string()
        .max(3, 'Maximal 3 Zeichen'),
    addinfo: Yup.string()
        .max(2500, 'Maximal 2500 Zeichen'),
    stories: Yup.array().of(Yup.object().shape({
        number: Yup.number("Bitte geben Sie eine Zahl ein")
            .required('Pflichtfeld')
            .integer("Bitte geben Sie eine Zahl ein"),
        parent: Yup.object().shape({
            issue: Yup.object()
                .shape({
                series: Yup.object().shape({
                    title: Yup.string()
                        .max(255, 'Maximal 255 Zeichen'),
                    volume: Yup.number("Bitte geben Sie eine Zahl ein")
                        .integer("Bitte geben Sie eine Zahl ein")
                }),
                number: Yup.string()
                    .max(255, 'Maximal 255 Zeichen')
            }),
            number: Yup.number("Bitte geben Sie eine Zahl ein")
                .integer("Bitte geben Sie eine Zahl ein")
        }),
        translator: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        writer: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        penciler: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        inker: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        colourist: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        letterer: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        editor: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        title: Yup.string()
            .max(255, 'Maximal 255 Zeichen'),
        addinfo: Yup.string()
            .max(2500, 'Maximal 2500 Zeichen'),
        exclusive: Yup.boolean()
    })),
    features: Yup.array().of(Yup.object().shape({
        number: Yup.number("Bitte geben Sie eine Zahl ein")
            .required('Pflichtfeld')
            .integer("Bitte geben Sie eine Zahl ein"),
        writer: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        title: Yup.string()
            .max(255, 'Maximal 255 Zeichen'),
        addinfo: Yup.string()
            .max(2500, 'Maximal 2500 Zeichen'),
    })),
    covers: Yup.array().of(Yup.object().shape({
        number: Yup.number("Bitte geben Sie eine Zahl ein")
            .required('Pflichtfeld')
            .integer("Bitte geben Sie eine Zahl ein"),
        parent: Yup.object().shape({
            issue: Yup.object().shape({
                series: Yup.object().shape({
                    title: Yup.string()
                        .max(255, 'Maximal 255 Zeichen'),
                    volume: Yup.number("Bitte geben Sie eine Zahl ein")
                        .integer("Bitte geben Sie eine Zahl ein")
                }),
                number: Yup.string()
                    .max(255, 'Maximal 255 Zeichen'),
                variant: Yup.string()
                    .max(255, 'Maximal 255 Zeichen')
            }),
        }),
        artist: Yup.object().shape({
            name: Yup.string()
                .max(255, 'Maximal 255 Zeichen')
        }),
        addinfo: Yup.string()
            .max(2500, 'Maximal 2500 Zeichen'),
    }))
});