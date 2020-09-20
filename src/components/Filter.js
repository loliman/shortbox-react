import Layout from "./Layout";
import React from "react";
import {withContext} from "./generic";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {FastField, Form, Formik} from "formik";
import AutoComplete from "./generic/AutoComplete";
import Button from "@material-ui/core/Button";
import {apps, arcs, individuals, publishers, series} from "../graphql/queries";
import {stripItem} from "../util/util";
import {generateLabel} from "../util/hierarchy";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {TextField} from "formik-material-ui";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {getPattern, updateField} from "./restricted/editor/IssueEditor";

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
            story: true,
            cover: false,
            feature: false,
            formats: [],
            withVariants: false,
            releasedates: [{date: '1900-01-01', compare: ">"}],
            publishers: [],
            series: [],
            numbers: [{number: "", compare: ">", variant: ""}],
            arcs: [],
            individuals: [],
            appearances: [],
            firstPrint: false,
            onlyPrint: false,
            otherTb: false,
            exclusive: false,
            reprint: false,
            onlyTb: false,
            onlyOnePrint: false,
            noPrint: false
        };
    else {
        if(!defaultValues.story)
            defaultValues.story = false;
        if(!defaultValues.cover)
            defaultValues.cover = false;
        if(!defaultValues.feature)
            defaultValues.feature = false;

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
        else {
            defaultValues.series.forEach(s => {
                s.__typename = "Series";
            });
        }
        if(!defaultValues.numbers)
            defaultValues.numbers = [{number: "", compare: ">", variant: ""}];
        if(!defaultValues.arcs)
            defaultValues.arcs = [];
        if(!defaultValues.individuals)
            defaultValues.individuals = [];
        if(!defaultValues.appearances)
            defaultValues.appearances = [];
        if(!defaultValues.firstPrint)
            defaultValues.firstPrint = false;
        if(!defaultValues.onlyPrint)
            defaultValues.onlyPrint = false;
        if(!defaultValues.otherTb)
            defaultValues.otherTb = false;
        if(!defaultValues.exclusive)
            defaultValues.exclusive = false;
        if(!defaultValues.reprint)
            defaultValues.reprint = false;
        if(!defaultValues.onlyTb)
            defaultValues.onlyTb = false;
        if(!defaultValues.noPrint)
            defaultValues.noPrint = false;
        if(!defaultValues.onlyOnePrint)
            defaultValues.onlyOnePrint = false;
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
                        values.series.forEach((o) => {
                            v.series.push(stripItem(o))
                        });
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
                    if (values.arcs.length > 0) {
                        v.arcs = [];
                        values.arcs.forEach((o) => {
                            let item = stripItem(o);
                            item.role = undefined;
                            v.arcs.push(item);
                        });
                    }
                    if (values.individuals.length > 0) {
                        v.individuals = [];
                        values.individuals.forEach((o) => {
                            let item = stripItem(o);
                            item.role = undefined;
                            v.individuals.push(item);
                        });
                    }
                    if (values.appearances.length > 0) {
                        v.appearances = [];
                        values.appearances.forEach((o) => {
                            v.appearances.push(stripItem(o))
                        });
                    }
                    if (values.firstPrint)
                        v.firstPrint = true;
                    if (values.onlyPrint)
                        v.onlyPrint = true;
                    if (values.otherTb)
                        v.otherTb = true;
                    if (values.exclusive)
                        v.exclusive = true;
                    if (values.reprint)
                        v.reprint = true;
                    if (values.onlyTb)
                        v.onlyTb = true;
                    if (values.noPrint)
                        v.noPrint = true;
                    if (values.onlyOnePrint)
                        v.onlyOnePrint = true;

                    if(JSON.stringify(v) !== "{}") {
                        if (values.story)
                            v.story = true;
                        if (values.cover)
                            v.cover = true;
                        if (values.feature)
                            v.feature = true;

                        v.us = us;
                    }

                    let url = lastLocation ? lastLocation.pathname : "/" + (props.us ? 'us' : 'de');
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

                                <Typography variant="h6">Filter nach</Typography>

                                <FormControlLabel
                                    className="switchEditor"
                                    control={
                                        <Switch
                                            checked={values.story}
                                            onChange={() => {
                                                setFieldValue("story", !values.story);
                                                setFieldValue("cover", false);
                                                setFieldValue("feature", false);
                                            }}
                                            color="secondary"/>
                                    }
                                    label="Geschichten"
                                />

                                <FormControlLabel
                                    className="switchEditor"
                                    control={
                                        <Switch
                                            checked={values.cover}
                                            onChange={() => {
                                                setFieldValue("cover", !values.cover);
                                                setFieldValue("story", false);
                                                setFieldValue("feature", false);
                                            }}
                                            color="secondary"/>
                                    }
                                    label="Cover"
                                />

                                {!us ?
                                <FormControlLabel
                                    className="switchEditor"
                                    control={
                                        <Switch
                                            checked={values.feature}
                                            onChange={() => {
                                                setFieldValue("feature", !values.feature);
                                                setFieldValue("cover", false);
                                                setFieldValue("story", false);
                                            }}
                                            color="secondary"/>
                                    }
                                    label="Sonstige Inhalte"
                                /> : null}

                                <br />
                                <br />
                                <br />

                                {
                                    !values.feature ?
                                    <React.Fragment>
                                        <Typography variant="h6">{us ? "Enthalten in" : "Enthält"}</Typography>

                                        { !us ?
                                            <React.Fragment>
                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Switch
                                                            checked={values.firstPrint}
                                                            onChange={() => {
                                                                setFieldValue("firstPrint", !values.firstPrint);
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Erstveröffentlichung"
                                                />

                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Switch
                                                            checked={values.onlyPrint}
                                                            onChange={() => {
                                                                setFieldValue("onlyPrint", !values.onlyPrint);
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Einzige Veröffentlichung"
                                                />

                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Switch
                                                            checked={values.otherTb}
                                                            onChange={() => {
                                                                setFieldValue("otherTb", !values.otherTb);
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
                                                                setFieldValue("exclusive", !values.exclusive);
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Exklusiv"
                                                />

                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Switch
                                                            checked={values.reprint}
                                                            onChange={() => {
                                                                setFieldValue("reprint", !values.reprint);
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Reiner Nachdruck"
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
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Nur in TB"
                                                />

                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Switch
                                                            checked={values.onlyOnePrint}
                                                            onChange={() => {
                                                                setFieldValue("onlyOnePrint", !values.onlyOnePrint);
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Nur einfach auf deutsch erschienen"
                                                />

                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Switch
                                                            checked={values.noPrint}
                                                            onChange={() => {
                                                                setFieldValue("noPrint", !values.noPrint);
                                                            }}
                                                            color="secondary"/>
                                                    }
                                                    label="Nicht auf deutsch erschienen"
                                                />
                                            </React.Fragment>
                                        }

                                        {
                                            <React.Fragment>
                                                <br />

                                                <AutoComplete
                                                    query={publishers}
                                                    name={"publishers"}
                                                    nameField="name"
                                                    label="Verlag"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.publishers, "name"), us: !us}}
                                                    onChange={(option, live) => updateField(option, live, values.publishers, setFieldValue, "publishers", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                />

                                                <AutoComplete
                                                    query={series}
                                                    name={"series"}
                                                    nameField="title"
                                                    label="Serie"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.series, "title"), publisher: {name: "*", us: !us}}}
                                                    onChange={(option, live) => updateField(option, live, values.series, setFieldValue, "series", "title")}
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
                                                                    !us && values.cover ?
                                                                    <FastField
                                                                        className={props.desktop ? "field field25" : "field field90"}
                                                                        name={"numbers[" + i + "].variant"}
                                                                        label="Variante"
                                                                        component={TextField}
                                                                    /> : null
                                                                }

                                                                {
                                                                    i === values.numbers.length-1 ?
                                                                        <IconButton className="addBtnFilter" aria-label="Hinzufügen"
                                                                                    onClick={() => {
                                                                                        let o = JSON.parse(JSON.stringify(values.numbers));
                                                                                        o.push({number: "", compare: ">", variant: ""});
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
                                            </React.Fragment>
                                        }
                                    </React.Fragment> : null
                                }

                                <AutoComplete
                                    query={arcs}
                                    name={"arcs"}
                                    nameField="title"
                                    label="Teil von"
                                    isMulti
                                    variables={{pattern: getPattern(values.arcs, "title")}}
                                    onChange={(option, live) => updateField(option, live, values.arcs, setFieldValue, "arcs", "title")}
                                    style={{
                                        width: props.desktop ? "40%" : "99%"
                                    }}
                                    generateLabel={(e) => {
                                        let type;
                                        switch (e.type) {
                                            case 'EVENT':
                                                type = 'Event';
                                                break;
                                            case 'STORYLINE':
                                                type = 'Story Line';
                                                break;
                                            default:
                                                type = 'Story Arc';

                                        }

                                       return e.title + " (" + type + ")";
                                    }}
                                />

                                <br/>
                                <br/>
                                <br/>

                                {
                                    <React.Fragment>
                                        <Typography variant="h6">Mitwirkende</Typography>

                                        {
                                            !values.cover ?
                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    nameField="name"
                                                    type="WRITER"
                                                    label="Autor"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                /> : null
                                        }

                                        {
                                            values.story ?
                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    nameField="name"
                                                    type={"PENCILER"}
                                                    label="Zeichner"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                /> : null
                                        }

                                        {
                                            values.cover ?
                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    type={"ARTIST"}
                                                    nameField="name"
                                                    label="Zeichner"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                /> : null
                                        }

                                        <br/>

                                        { values.story ?
                                            <React.Fragment>
                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    type={"INKER"}
                                                    nameField="name"
                                                    label="Inker"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                />

                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    type={"COLOURIST"}
                                                    nameField="name"
                                                    label="Kolorist"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                />

                                                <br />

                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    type={"LETTERER"}
                                                    nameField="name"
                                                    label="Letterer"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                />

                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    type={"EDITOR"}
                                                    nameField="name"
                                                    label="Editor"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
                                                    style={{
                                                        width: props.desktop ? "40%" : "99%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                />
                                            </React.Fragment> : null }

                                        { !us && values.story ?
                                            <React.Fragment>
                                                <br />

                                                <AutoComplete
                                                    query={individuals}
                                                    name={"individuals"}
                                                    type={"TRANSLATOR"}
                                                    nameField="name"
                                                    label="Übersetzer"
                                                    isMulti
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option, live) => updateField(option, live, values.individuals, setFieldValue, "individuals", "name")}
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
                                    </React.Fragment>}

                                {values.story ?
                                    <React.Fragment>
                                        <Typography variant="h6">Auftritte</Typography>

                                        <AutoComplete
                                            query={apps}
                                            name={"appearances"}
                                            nameField="name"
                                            label="Auftritte"
                                            isMulti
                                            variables={{pattern: getPattern(values.appearances, "name")}}
                                            onChange={(option, live) => updateField(option, live, values.appearances, setFieldValue, "appearances", "name")}
                                            style={{
                                                width: props.desktop ? "80%" : "99%"
                                            }}
                                            generateLabel={(e) => getType(e) + e.name}
                                        />

                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                    </React.Fragment> : null
                                }

                                <div className="formButtons">
                                    <Button disabled={isSubmitting}
                                            onClick={() => {
                                                resetForm({
                                                    story: true,
                                                    cover: false,
                                                    feature: false,
                                                    formats: [],
                                                    withVariants: false,
                                                    releasedates: [{date: '1900-01-01', compare: ">"}],
                                                    publishers: [],
                                                    series: [],
                                                    numbers: [{number: "", compare: ">", variant: ""}],
                                                    arcs: [],
                                                    individuals: [],
                                                    appearances: [],
                                                    firstPrint: false,
                                                    onlyPrint: false,
                                                    otherTb: false,
                                                    exclusive: false,
                                                    reprint: false,
                                                    onlyTb: false,
                                                    noPrint: false,
                                                    onlyOnePrint: false,
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

function getType(app) {
    switch (app.type) {
        case "CHARACTER":
            return "!!Charakter!!";
        case "ITEM":
            return "!!Gegenstand!!";
        case "TEAM":
            return "!!Team!!";
        case "RACE":
            return "!!Rasse!!";
        case "ANIMAL":
            return "!!Tier!!";
        case "LOCATION":
            return "!!Ort!!";
        case "VEHICLE":
            return "!!Fahrzeug!!";
        default:
            return "";
    }
}

export default withContext(Filter);
