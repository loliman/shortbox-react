import Layout from "./Layout";
import React from "react";
import {withContext} from "./generic";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {FastField, Form, Formik} from "formik";
import AutoComplete from "./generic/AutoComplete";
import Button from "@material-ui/core/Button";
import {individuals, publishers, series} from "../graphql/queries";
import {stripItem} from "../util/util";
import {generateLabel} from "../util/hierarchy";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {TextField} from "formik-material-ui";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

function Filter(props) {
    const {lastLocation, us} = props;

    let defaultValues;
    if(props.query && props.query.filter) {
        try {
            defaultValues = JSON.parse(props.query.filter);
        } catch (e) {
           //
        }
    }

    if(!defaultValues)
        defaultValues = {
            formats: [],
            withVariants: false,
            releasedates: [{date: '1900-01-01', compare: ">"}],
            publishers: [],
            series: [],
            numbers: [{number: "", compare: ">"}],
            writers: [],
            artists: [],
            inkers: [],
            colourists: [],
            letteres: [],
            editors: [],
            translators: [],
            firstPrint: false,
            onlyPrint: false,
            otherTb: false,
            exclusive: false,
            onlyTb: false,
            noPrint: false
        };
    else {
        if(!defaultValues.formats)
            defaultValues.formats = [];
        else {
            let formats = [];
            defaultValues.formats.forEach(f => {
               formats.push({name: f});
            });
            defaultValues.formats = formats;
        }
        if(!defaultValues.withVariants)
            defaultValues.withVariants = false;
        if(!defaultValues.releasedates)
            defaultValues.releasedates = [{date: '1900-01-01', compare: ">"}];
        if(!defaultValues.publishers)
            defaultValues.publishers = [];
        if(!defaultValues.series)
            defaultValues.series = [];
        if(!defaultValues.numbers)
            defaultValues.numbers = [{number: "", compare: ">"}];
        if(!defaultValues.writers)
            defaultValues.writers = [];
        if(!defaultValues.artists)
            defaultValues.artists = [];
        if(!defaultValues.inkers)
            defaultValues.inkers = [];
        if(!defaultValues.colourists)
            defaultValues.colourists = [];
        if(!defaultValues.letteres)
            defaultValues.letteres = [];
        if(!defaultValues.editors)
            defaultValues.editors = [];
        if(!defaultValues.translators)
            defaultValues.translators = [];
        if(!defaultValues.firstPrint)
            defaultValues.firstPrint = false;
        if(!defaultValues.onlyPrint)
            defaultValues.onlyPrint = false;
        if(!defaultValues.otherTb)
            defaultValues.otherTb = false;
        if(!defaultValues.exclusive)
            defaultValues.exclusive = false;
        if(!defaultValues.onlyTb)
            defaultValues.onlyTb = false;
        if(!defaultValues.noPrint)
            defaultValues.noPrint = false;
    }

    return (
        <Layout>
            <Formik
                initialValues={defaultValues}
                onSubmit={async (values, actions) => {
                    actions.setSubmitting(true);

                    let v = {};
                    if (values.formats.length > 0) {
                        v.formats = [];
                        values.formats.forEach((o) => v.formats.push(o.name));
                    }
                    if(values.withVariants)
                        v.withVariants = true;
                    if(values.releasedates.length > 0) {
                        v.releasedates = [];
                        values.releasedates.forEach((o) => {
                            if(o.date.trim() !== '1900-01-01')
                                v.releasedates.push(o)
                        });
                        if(v.releasedates.length === 0)
                            v.releasedates = undefined;
                    }
                    if (values.publishers.length > 0) {
                        v.publishers = [];
                        values.publishers.forEach((o) => {
                            let p = stripItem(o);
                            p.us = undefined;
                            v.publishers.push(p)
                        });
                    }
                    if (values.series.length > 0) {
                        v.series = [];
                        values.series.forEach((o) => v.series.push(stripItem(o)));
                    }
                    if(values.numbers.length > 0) {
                        v.numbers = [];
                        values.numbers.forEach((o) => {
                            if(o.number.trim() !== "")
                                v.numbers.push(o)
                        });
                        if(v.numbers.length === 0)
                            v.numbers = undefined;
                    }
                    if (values.writers.length > 0) {
                        v.writers = [];
                        values.writers.forEach((o) => v.writers.push(stripItem(o)));
                    }
                    if (values.artists.length > 0) {
                        v.artists = [];
                        values.artists.forEach((o) => v.artists.push(stripItem(o)));
                    }
                    if (values.inkers.length > 0) {
                        v.inkers = [];
                        values.inkers.forEach((o) => v.inkers.push(stripItem(o)));
                    }
                    if (values.colourists.length > 0) {
                        v.colourists = [];
                        values.colourists.forEach((o) => v.colourists.push(stripItem(o)));
                    }
                    if (values.letteres.length > 0) {
                        v.letteres = [];
                        values.letteres.forEach((o) => v.letteres.push(stripItem(o)));
                    }
                    if (values.editors.length > 0) {
                        v.editors = [];
                        values.editors.forEach((o) => v.editors.push(stripItem(o)));
                    }
                    if (values.translators.length > 0) {
                        v.translators = [];
                        values.translators.forEach((o) => v.translators.push(stripItem(o)));
                    }
                    if (values.firstPrint)
                        v.firstPrint = true;
                    if (values.onlyPrint)
                        v.onlyPrint = true;
                    if (values.otherTb)
                        v.otherTb = true;
                    if (values.exclusive)
                        v.exclusive = true;
                    if (values.onlyTb)
                        v.onlyTb = true;
                    if (values.noPrint)
                        v.noPrint = true;

                    let url = lastLocation ? lastLocation.pathname : "/";
                    props.navigate(url, {filter: JSON.stringify(v) !== "{}" ? JSON.stringify(v) : null});

                    actions.setSubmitting(false);
                }}>
                {({values, resetForm, submitForm, isSubmitting, setFieldValue}) => {
                    return (
                        <Form>
                            <CardHeader title="Filter"/>

                            <CardContent className="cardContent">
                                <Typography variant="h6">Details</Typography>

                                <AutoComplete
                                    values={[{name: 'Heft'}, {name: 'Mini Heft'}, {name: 'Magazin'},
                                        {name: 'Prestige'}, {name: 'Softcover'}, {name: 'Hardcover'},
                                        {name: 'Taschenbuch'}, {name: 'Album'}, {name: 'Album Hardcover'}]}
                                    nameField="name"
                                    name={"formats"}
                                    label="Format"
                                    isMulti
                                    onChange={(option) => setFieldValue("formats", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e}
                                />

                                <FormControlLabel
                                    className="switchEditor withVariants"
                                    control={
                                        <Switch
                                            checked={values.withVariants}
                                            onChange={() => {
                                                setFieldValue("withVariants", !values.withVariants);
                                            }}
                                            color="secondary"/>
                                    }
                                    label="Mit Varianten"
                                />

                                <br />

                                {
                                    values.releasedates.map((n, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <FastField
                                                    className={props.desktop ? "field field40" : "field field90"}
                                                    name={"releasedates[" + i + "].date"}
                                                    label="Erscheinungsdatum"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    component={TextField}
                                                />

                                                <FastField
                                                    type="text"
                                                    name={"releasedates[" + i + "].compare"}
                                                    label="ist"
                                                    select
                                                    component={TextField}
                                                    className={"field field10"}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                >
                                                    {[">", "<", "=", ">=", "<="].map(e => (
                                                        <MenuItem key={e} value={e}>{e}</MenuItem>
                                                    ))}
                                                </FastField>

                                                {
                                                    i === values.releasedates.length-1 ?
                                                        <IconButton className="addBtnFilter" aria-label="Hinzufügen"
                                                                    onClick={() => {
                                                                        let o = JSON.parse(JSON.stringify(values.releasedates));
                                                                        o.push({date: "1900-01-01", compare: ">"});
                                                                        setFieldValue("releasedates", o);
                                                                    }}>
                                                            <AddIcon/>
                                                        </IconButton> : null
                                                }

                                                <br/>
                                            </React.Fragment>
                                        )
                                    })
                                }

                                <br/>
                                <br/>
                                <br/>

                                <Typography variant="h6">Enthält</Typography>

                                { !us ?
                                    <React.Fragment>
                                        <FormControlLabel
                                            className="switchEditor"
                                            control={
                                                <Switch
                                                    checked={values.firstPrint}
                                                    onChange={() => {
                                                        setFieldValue("firstPrint", !values.firstPrint);
                                                        setFieldValue("onlyPrint", false);
                                                        setFieldValue("otherTb", false);
                                                        setFieldValue("exclusive", false);
                                                    }}
                                                    color="secondary"/>
                                            }
                                            label="Erstausgabe"
                                        />

                                        <FormControlLabel
                                            className="switchEditor"
                                            control={
                                                <Switch
                                                    checked={values.onlyPrint}
                                                    onChange={() => {
                                                        setFieldValue("firstPrint", false);
                                                        setFieldValue("onlyPrint", !values.onlyPrint);
                                                        setFieldValue("otherTb", false);
                                                        setFieldValue("exclusive", false);
                                                    }}
                                                    color="secondary"/>
                                            }
                                            label="Einzige Ausgabe"
                                        />

                                        <FormControlLabel
                                            className="switchEditor"
                                            control={
                                                <Switch
                                                    checked={values.otherTb}
                                                    onChange={() => {
                                                        setFieldValue("firstPrint", false);
                                                        setFieldValue("onlyPrint", false);
                                                        setFieldValue("otherTb", !values.otherTb);
                                                        setFieldValue("exclusive", false);
                                                    }}
                                                    color="secondary"/>
                                            }
                                            label="Sonst nur in TB"
                                        />

                                        <FormControlLabel
                                            className="switchEditor"
                                            control={
                                                <Switch
                                                    checked={values.exclusive}
                                                    onChange={() => {
                                                        setFieldValue("firstPrint", false);
                                                        setFieldValue("onlyPrint", false);
                                                        setFieldValue("otherTb", false);
                                                        setFieldValue("exclusive", !values.exclusive);
                                                    }}
                                                    color="secondary"/>
                                            }
                                            label="Exklusiv"
                                        />
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <FormControlLabel
                                            className="switchEditor"
                                            control={
                                                <Switch
                                                    checked={values.onlyTb}
                                                    onChange={() => {
                                                        setFieldValue("onlyTb", !values.onlyTb);
                                                        setFieldValue("noPrint", false);
                                                    }}
                                                    color="secondary"/>
                                            }
                                            label="Nur in TB"
                                        />

                                        <FormControlLabel
                                            className="switchEditor"
                                            control={
                                                <Switch
                                                    checked={values.noPrint}
                                                    onChange={() => {
                                                        setFieldValue("onlyTb", false);
                                                        setFieldValue("noPrint", !values.noPrint);
                                                    }}
                                                    color="secondary"/>
                                            }
                                            label="Nicht auf deutsch erschienen"
                                        />
                                    </React.Fragment>
                                }

                                <br />

                                <AutoComplete
                                    query={publishers}
                                    variables={{us: !us}}
                                    name={"publishers"}
                                    nameField="name"
                                    label="Verlag"
                                    isMulti
                                    onChange={(option) => setFieldValue("publishers", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                <AutoComplete
                                    query={series}
                                    variables={{publisher: {name: "*", us: !us}}}
                                    name={"series"}
                                    nameField="title"
                                    label="Serie"
                                    isMulti
                                    onChange={(option) => setFieldValue("series", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={generateLabel}
                                />

                                <br />

                                {
                                    values.numbers.map((n, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <FastField
                                                    className={props.desktop ? "field field40" : "field field90"}
                                                    name={"numbers[" + i + "].number"}
                                                    label="Nummer"
                                                    component={TextField}
                                                />

                                                <FastField
                                                    type="text"
                                                    name={"numbers[" + i + "].compare"}
                                                    label="ist"
                                                    select
                                                    component={TextField}
                                                    className={"field field10"}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                >
                                                    {[">", "<", "=", ">=", "<="].map(e => (
                                                        <MenuItem key={e} value={e}>{e}</MenuItem>
                                                    ))}
                                                </FastField>

                                                {
                                                    i === values.numbers.length-1 ?
                                                        <IconButton className="addBtnFilter" aria-label="Hinzufügen"
                                                                    onClick={() => {
                                                                        let o = JSON.parse(JSON.stringify(values.numbers));
                                                                        o.push({number: "", compare: ">"});
                                                                        setFieldValue("numbers", o);
                                                                    }}>
                                                            <AddIcon/>
                                                        </IconButton> : null
                                                }

                                                <br/>
                                            </React.Fragment>
                                        )
                                    })
                                }

                                <br/>
                                <br/>
                                <br/>

                                <Typography variant="h6">Mitwirkende</Typography>

                                <AutoComplete
                                    query={individuals}
                                    name={"writers"}
                                    nameField="name"
                                    label="Autor"
                                    isMulti
                                    onChange={(option) => setFieldValue("writers", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                <AutoComplete
                                    query={individuals}
                                    name={"artists"}
                                    nameField="name"
                                    label="Zeichner"
                                    isMulti
                                    onChange={(option) => setFieldValue("artists", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                <br/>

                                <AutoComplete
                                    query={individuals}
                                    name={"inkers"}
                                    nameField="name"
                                    label="Inker"
                                    isMulti
                                    onChange={(option) => setFieldValue("inkers", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                <AutoComplete
                                    query={individuals}
                                    name={"colourists"}
                                    nameField="name"
                                    label="Kolorist"
                                    isMulti
                                    onChange={(option) => setFieldValue("colourists", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                <br />

                                <AutoComplete
                                    query={individuals}
                                    name={"letterers"}
                                    nameField="name"
                                    label="Letterer"
                                    isMulti
                                    onChange={(option) => setFieldValue("letterers", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                <AutoComplete
                                    query={individuals}
                                    name={"editors"}
                                    nameField="name"
                                    label="Editor"
                                    isMulti
                                    onChange={(option) => setFieldValue("editors", option)}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => e.name}
                                />

                                { !us ?
                                    <React.Fragment>
                                        <br />

                                        <AutoComplete
                                            query={individuals}
                                            name={"translators"}
                                            nameField="name"
                                            label="Übersetzer"
                                            isMulti
                                            onChange={(option) => setFieldValue("translators", option)}
                                            style={{
                                                width: props.desktop ? "40%" : "99%"
                                            }}
                                            generateLabel={(e) => e.name}
                                        />
                                    </React.Fragment> : null
                                }

                                <br/>
                                <br/>
                                <br/>
                                <br/>

                                <div className="formButtons">
                                    <Button disabled={isSubmitting}
                                            onClick={() => {
                                                resetForm({
                                                    formats: [],
                                                    releasedates: [{date: '1900-01-01', compare: ">"}],
                                                    publishers: [],
                                                    series: [],
                                                    numbers: [{number: "", compare: ">"}],
                                                    writers: [],
                                                    artists: [],
                                                    inkers: [],
                                                    colourists: [],
                                                    letteres: [],
                                                    editors: [],
                                                    translators: [],
                                                    firstApp: false,
                                                    onlyApp: false,
                                                    otherTb: false,
                                                    exclusive: false,
                                                    onlyTb: false,
                                                    noPrint: false
                                                });
                                            }}
                                            color="secondary">
                                        Zurücksetzen
                                    </Button>

                                    <Button disabled={isSubmitting}
                                            onClick={() => submitForm()}
                                            color="primary">
                                        Abbrechen
                                    </Button>

                                    <Button
                                        className="createButton"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        color="primary">
                                        Filtern
                                    </Button>
                                </div>
                            </CardContent>
                        </Form>
                    )
                }}
            </Formik>
        </Layout>
    );
}

export default withContext(Filter);