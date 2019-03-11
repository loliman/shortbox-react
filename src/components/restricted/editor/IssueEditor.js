import {IssueSchema} from "../../../util/yupSchema";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import Link from "react-router-dom/es/Link";
import React from "react";
import {Mutation} from "react-apollo";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@material-ui/core/CardHeader";
import {individuals, issue, issues, publishers, series} from "../../../graphql/queries";
import {decapitalize, stripItem} from "../../../util/util";
import AutoComplete from "../../generic/AutoComplete";
import {addToCache, removeFromCache, updateInCache} from "./Editor";
import CardMedia from "@material-ui/core/CardMedia";
import Lightbox from "react-images";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SimpleFileUpload from "../../generic/SimpleFileUpload";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import MenuItem from "@material-ui/core/MenuItem";

const formats = ['Heft', 'Mini Heft', 'Magazin', 'Prestige', 'Softcover', 'Hardcover', 'Taschenbuch', 'Album',
    'Album Hardcover'];
const currencies = ['EUR', 'DEM'];

class IssueEditor extends React.Component {
    constructor(props) {
        super(props);

        let defaultValues = props.defaultValues;
        if(!defaultValues)
            defaultValues = {
                title: '',
                series: {
                    title: '',
                    volume: 0,
                    publisher: {
                        name: ''
                    }
                },
                number: '',
                variant: '',
                cover: '',
                format: '',
                limitation: 0,
                pages: 0,
                releasedate: '1900-01-01',
                price: '',
                currency: 'EUR',
                addinfo: '',
                stories: [],
                features: [],
                covers: []
            };

        this.state = {
            defaultValues: defaultValues,
            header: props.edit ?
                generateLabel(defaultValues) + " bearbeiten" :
                "Ausgabe erstellen",
            submitLabel: props.edit ?
                "Speichern" :
                "Erstellen",
            successMessage: props.edit ?
                " erfolgreich gespeichert" :
                " erfolgreich erstellt",
            errorMessage: props.edit ?
                generateLabel(defaultValues) + " konnte nicht gespeichert werden" :
                "Ausgabe konnte nicht erstellt werden"
        }
    }

    render() {
        const {lastLocation, history, enqueueSnackbar, edit, mutation, us} = this.props;
        const {defaultValues, header, submitLabel, successMessage, errorMessage} = this.state;

        let mutationName = decapitalize(mutation.definitions[0].name.value);

        return (
            <Mutation mutation={mutation}
                      update={(cache, result) => {
                          let res = result.data[mutationName];

                          try {
                              addToCache(cache, issues, res.series, res);
                          } catch (e) {
                              //ignore cache exception;
                          }

                          if(edit) {
                              try {
                                  updateInCache(cache, issue, res, res, res);
                              } catch (e) {
                                  //ignore cache exception;
                              }
                              try {
                                  removeFromCache(cache, issues, defaultValues.series, defaultValues);
                              } catch (e) {
                                  //ignore cache exception;
                              }
                          }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {variant: 'success'});
                          history.push(generateUrl(data[mutationName]));
                      }}
                      onError={() => {
                          enqueueSnackbar(errorMessage, {variant: 'error'});
                      }}>
                {(mutation, {error}) => (
                    <Formik
                        initialValues={defaultValues}
                        validationSchema={IssueSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            let stories = values.stories.map(e => {
                                if(e.exclusive) {
                                    e.parent = undefined;
                                } else {
                                    e.writer = undefined;
                                    e.penciler = undefined;
                                    e.inker = undefined;
                                    e.colourist = undefined;
                                    e.letter = undefined;
                                    e.editor = undefined;
                                }

                                return e;
                            });

                            let covers = values.covers.map(e => {
                                if(e.exclusive) {
                                    e.parent = undefined;
                                } else {
                                    e.artist = undefined;
                                }

                                return e;
                            });

                            let variables = {};
                            variables.item = stripItem(values);
                            variables.item.stories = stories;
                            variables.item.covers = covers;
                            if(edit)
                                variables.old = stripItem(defaultValues);

                            await mutation({
                                variables: variables
                            });

                            actions.setSubmitting(false);
                            if(error)
                                actions.resetForm();
                        }}>
                        {({values, resetForm, submitForm, isSubmitting, setFieldValue}) => (
                            <Form>
                                <CardHeader title={header} />

                                <CardContent className="cardContent">
                                    {
                                        this.props.desktop ? <Cover {...this.props} cover={values.cover} onDelete={() => setFieldValue('cover', '', true)}/> : null
                                    }

                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="title"
                                        label="Titel"
                                        component={TextField}
                                    />
                                    <br/>

                                    <AutoComplete
                                        id="publisher"
                                        query={publishers}
                                        variables={{us: us}}
                                        name="series.publisher.name"
                                        label="Verlag"
                                        onChange={(value) => {
                                            setFieldValue("series.publisher", value, true);
                                        }}
                                        style={{
                                            "width": this.props.desktop ? "35%" : "100%"
                                        }}
                                        generateLabel={generateLabel}
                                    />

                                    <br/>

                                    <AutoComplete
                                        disabled={!values.series.publisher.name ||
                                        values.series.publisher.name.trim().length === 0}
                                        id="series"
                                        query={series}
                                        variables={{publisher: {name: values.series.publisher.name}}}
                                        name="series.title"
                                        label="Serie"
                                        onChange={(value) => {
                                            setFieldValue("series", value, true);
                                        }}
                                        style={{
                                            "width": this.props.desktop ? "25%" : "71%"
                                        }}
                                        generateLabel={generateLabel}
                                    />

                                    <Field
                                        disabled={!values.series.publisher.name ||
                                        values.series.publisher.name.trim().length === 0}
                                        className={this.props.desktop ? "field field10" : "field field25"}
                                        name="series.volume"
                                        label="Volume"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="number"
                                        label="Nummer"
                                        component={TextField}
                                    />
                                    <br/>

                                    <div className={this.props.desktop ? "field field35 fieldFileUpload addBtn" :
                                        "field field100 fieldFileUpload addBtn"}>
                                        <Field
                                            name="cover"
                                            label="Cover"
                                            component={SimpleFileUpload}
                                            onChange={() => false}
                                        />
                                    </div>

                                    {
                                        !this.props.desktop ?
                                            <React.Fragment>
                                                <br/>
                                                <Cover {...this.props} cover={values.cover} onDelete={() => setFieldValue('cover', '', true)}/>
                                            </React.Fragment> : null
                                    }

                                    <Field
                                        type="text"
                                        name="format"
                                        label="Format"
                                        select
                                        component={TextField}
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        {formats.map(e => (
                                            <MenuItem key={e} value={e}>{e}</MenuItem>
                                        ))}
                                    </Field>
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="variant"
                                        label="Variante"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="limitation"
                                        label="Limitierung"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="pages"
                                        label="Seiten"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="releasedate"
                                        label="Erscheinungsdatum"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        component={TextField}
                                    />
                                    <br/>
                                    <Field
                                        className={this.props.desktop ? "field field25" : "field field75"}
                                        name="price"
                                        label="Preis"
                                        component={TextField}
                                    />

                                    <Field
                                        type="text"
                                        name="currency"
                                        label="Währung"
                                        select
                                        component={TextField}
                                        className={this.props.desktop ? "field field10" : "field field25"}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    >
                                        {currencies.map(e => (
                                            <MenuItem key={e} value={e}>{e}</MenuItem>
                                        ))}
                                    </Field>
                                    <br/>

                                    <Field
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="addinfo"
                                        label="Weitere Informationen"
                                        multiline
                                        rows={10}
                                        component={TextField}
                                    />

                                    <br/>
                                    <br/>

                                    <Stories setFieldValue={setFieldValue} items={values.stories} {...this.props}/>

                                    <br/>

                                    <Features setFieldValue={setFieldValue} items={values.features} {...this.props}/>

                                    <br/>

                                    <Covers setFieldValue={setFieldValue} items={values.covers} {...this.props}/>

                                    <br/>

                                    <div className="formButtons">
                                        <Button disabled={isSubmitting}
                                                onClick={() => {
                                                    values = defaultValues;
                                                    resetForm();
                                                }}
                                                color="secondary">
                                            Zurücksetzen
                                        </Button>

                                        <Button disabled={isSubmitting}
                                                component={Link}
                                                to={lastLocation ? lastLocation : "/"}
                                                color="primary">
                                            Abbrechen
                                        </Button>

                                        <Button
                                            className="createButton"
                                            disabled={isSubmitting}
                                            onClick={submitForm}
                                            color="primary">
                                            {submitLabel}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Form>
                        )}
                    </Formik>
                )}
            </Mutation>
        );
    }
}

class Cover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isCoverOpen: false};
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.cover !== nextProps.cover || this.state.isCoverOpen !== nextState.isCoverOpen;
    }

    render() {
        return (
            <div className={this.props.desktop ? "right field50" : "mobileCover"}>
                <CardMedia
                    image={this.createPreview(this.props.cover)}
                    title="Cover Vorschau"
                    className="media field100"
                    onClick={() => this.triggerCoverIsOpen()}/>

                <Lightbox
                    showImageCount={false}
                    images={[{src: this.createPreview(this.props.cover)}]}
                    isOpen={this.state.isCoverOpen}
                    onClose={() => this.triggerCoverIsOpen()}/>

                <IconButton className="removeBtnCover" aria-label="Entfernen"
                    onClick={() => {
                    this.setState({cover: null});
                    this.props.onDelete();
                }}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        )
    }

    triggerCoverIsOpen() {
        this.setState({isCoverOpen: !this.state.isCoverOpen});
    }

    createPreview(file) {
        if(!file || file === '')
            return '/nocover.jpg';
        else if(file.__typename === 'Cover')
            return file.url;
        else
            return URL.createObjectURL(file);
    }
}

function Stories(props) {
    return (
        <React.Fragment>
            <div>
                <CardHeader className="left" title="Geschichten"/>
                <AddContainsButton type="stories" default={storyDefault} {...props} />
            </div>

            <br />

            <Contains {...props} type="stories" default={storyDefault} fields={<StoryFields />} />
        </React.Fragment>
    );
}

function StoryFields(props) {
    let extended = props.items[props.index].exclusive ? <StoryFieldsExclusive {...props} /> : <StoryFieldsNonExclusive {...props} />;

    return (
        <React.Fragment>
            <Field
                className="field field3"
                name={"stories[" + props.index + "].number"}
                label="#"
                component={TextField}
            />

            {extended}

            <Field
                className={props.desktop ? "field field25" : "field field100"}
                name={"stories[" + props.index + "].title"}
                label="Titel"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field fiel25" : "field field100"}
                name={"stories[" + props.index + "].addinfo"}
                label="Weitere Informationen"
                component={TextField}
            />

            <ExclusiveToggle {...props}/>
        </React.Fragment>
    );
}

function StoryFieldsNonExclusive(props) {
    const {items, index, setFieldValue} = props;

    return (
        <React.Fragment>
            <AutoComplete
                query={series}
                variables={{
                    publisher: items[index].parent.issue.series.publisher.name === '' ?
                        {name: "*", us: true} :
                        {name: items[index].parent.issue.series.publisher.name}
                }}
                name={"stories[" + index + "].parent.issue.series.title"}
                label="Serie"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].parent.issue.series", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "25%" : "93%"
                }}
                generateLabel={generateLabel}
            />

            <Field
                className={props.desktop ? "field field5" : "field field25"}
                name={"stories[" + index + "].parent.issue.series.volume"}
                label="Volume"
                type="number"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field field5" : "field field60"}
                name={"stories[" + index + "].parent.issue.number"}
                label="Nummer"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field field5" : "field field10"}
                name={"stories[" + index + "].parent.number"}
                label="#"
                type="number"
                component={TextField}
            />

            <AutoComplete
                id="translator"
                query={individuals}
                name={"stories[" + index + "].translator.name"}
                label="Übersetzer"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].translator", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
        </React.Fragment>
    );
}

function StoryFieldsExclusive(props) {
    const {index, setFieldValue} = props;

    return (
        <React.Fragment>
            <AutoComplete
                id="writer"
                query={individuals}
                name={"stories[" + index + "].writer.name"}
                label="Autor"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].writer", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "93%"
                }}
                generateLabel={(e) => e.name}
            />
            <AutoComplete
                id="penciler"
                query={individuals}
                name={"stories[" + index + "].penciler.name"}
                label="Zeichner"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].penciler", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
            <AutoComplete
                id="inker"
                query={individuals}
                name={"stories[" + index + "].inker.name"}
                label="Inker"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].inker", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
            <AutoComplete
                id="colourist"
                query={individuals}
                name={"stories[" + index + "].colourist.name"}
                label="Kolorist"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].colourist", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
            <AutoComplete
                id="letterer"
                query={individuals}
                name={"stories[" + index + "].letterer.name"}
                label="Letterer"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].letterer", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
            <AutoComplete
                id="editor"
                query={individuals}
                name={"stories[" + index + "].editor.name"}
                label="Editor"
                onChange={(value) => {
                    setFieldValue("stories[" + index + "].editor", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
        </React.Fragment>
    );
}

function Features(props) {
    return (
        <React.Fragment>
            <div>
                <CardHeader className="left" title="Weitere Inhalte"/>
                <AddContainsButton type="features" default={featureDefault} {...props} />
            </div>

            <br />

            <Contains {...props} type="features" default={featureDefault} fields={<FeatureFields />} />
        </React.Fragment>
    );
}

function FeatureFields(props) {
    return (
        <React.Fragment>
            <Field
                className="field field3"
                name={"features[" + props.index + "].number"}
                label="#"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field field35" : "field field95"}
                name={"features[" + props.index + "].title"}
                label="Titel"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field field35" : "field field100"}
                name={"features[" + props.index + "].addinfo"}
                label="Weitere Informationen"
                component={TextField}
            />

            <AutoComplete
                id="writer"
                query={individuals}
                name={"features[" + props.index + "].writer.name"}
                label="Autor"
                onChange={(value) => {
                    props.setFieldValue("features[" + props.index + "].writer", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "110%"
                }}
                generateLabel={(e) => e.name}
            />
        </React.Fragment>
    );
}

function Covers(props) {
    return (
        <React.Fragment>
            <div>
                <CardHeader className="left" title="Covergalerie"/>
                <AddContainsButton type="covers" default={coverDefault} {...props} />
            </div>

            <br />

            <Contains {...props} type="covers" default={coverDefault} fields={<CoverFields />} />
        </React.Fragment>
    );
}

function CoverFields(props) {
    let extended = props.items[props.index].exclusive ? <CoverFieldsExclusive {...props} /> : <CoverFieldsNonExclusive {...props} />;

    return (
        <React.Fragment>
            {props.items[props.index].number === 0 ?
                <Field
                    className="field field3"
                    name={"covers[" + props.index + "].number"}
                    label="#"
                    disabled
                    component={TextField}
                /> :
                <Field
                    className="field field3"
                    name={"covers[" + props.index + "].number"}
                    label="#"
                    component={TextField}
                />
            }

            {extended}

            <Field
                className={props.desktop ? "field field25" : "field field100"}
                name={"covers[" + props.index + "].addinfo"}
                label="Weitere Informationen"
                component={TextField}
            />

            <ExclusiveToggle {...props}/>
        </React.Fragment>
    );
}

function CoverFieldsNonExclusive(props) {
    const {items, index, setFieldValue} = props;

    return (
        <React.Fragment>
            <AutoComplete
                query={series}
                variables={{
                    publisher: items[index].parent.issue.series.publisher.name === '' ?
                        {name: "*", us: true} :
                        {name: items[index].parent.issue.series.publisher.name}
                }}
                name={"covers[" + index + "].parent.issue.series.title"}
                label="Serie"
                onChange={(value) => {
                    setFieldValue("covers[" + index + "].parent.issue.series", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "25%" : "93%"
                }}
                generateLabel={generateLabel}
            />

            <Field
                className={props.desktop ? "field field5" : "field field25"}
                name={"covers[" + index + "].parent.issue.series.volume"}
                label="Volume"
                type="number"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field field5" : "field field73"}
                name={"covers[" + index + "].parent.issue.number"}
                label="Nummer"
                component={TextField}
            />

            <Field
                className={props.desktop ? "field field5" : "field field100"}
                name={"covers[" + index + "].parent.issue.variant"}
                label="Variante"
                component={TextField}
            />
        </React.Fragment>
    );
}

function CoverFieldsExclusive(props) {
    const {index, setFieldValue} = props;

    return (
        <React.Fragment>

            <AutoComplete
                query={individuals}
                name={"covers[" + index + "].artist.name"}
                label="Artist"
                onChange={(value) => {
                    setFieldValue("covers[" + index + "].artist", stripItem(value), true);
                }}
                style={{
                    "width": props.desktop ? "20%" : "93%"
                }}
                generateLabel={(e) => e.name}
            />
        </React.Fragment>
    );
}

function Contains(props) {
    if(!props.items || props.items.length === 0)
        return <Typography className="noRelationsWarning">Hinzufügen mit '+'</Typography>;

    return props.items.map((item, index) => (
        <div key={index} className="storyAddContainer">
            <RemoveContainsButton index={index} {...props}/>

            <ExpansionPanel className="storyAddPanel" key={index} expanded={true}>
                <ExpansionPanelSummary className="storyAdd">
                    {React.cloneElement(props.fields, {
                        index: index,
                        ...props
                    })}
                </ExpansionPanelSummary>
            </ExpansionPanel>
        </div>
    ));
}

function AddContainsButton(props) {
    return (
        <IconButton className="addBtn" aria-label="Hinzufügen"
                    onClick={() => {
                        let items = props.items;
                        let def = JSON.parse(JSON.stringify(props.default));
                        def.number = props.items.length+1;
                        items.push(def);
                        props.setFieldValue(props.type, items, true);
                    }}>
            <AddIcon/>
        </IconButton>
    );
}

function RemoveContainsButton(props) {
    return (
        <IconButton className="removeBtn" aria-label="Entfernen"
                    onClick={() => {
                        let items = props.items.filter((e, i) => i !== props.index);
                        props.setFieldValue(props.type, items, true);
                    }}>
            <DeleteIcon/>
        </IconButton>
    );
}

function ExclusiveToggle(props) {
    const {type, index, items, setFieldValue} = props;

    return (
        <FormControlLabel
            className="exclusiveToggle"
            control={
                <Switch
                    checked={items[index].exclusive}
                    onChange={() => {
                        setFieldValue(type + "[" + index + "].exclusive", !items[index].exclusive)
                    }}
                    value="exclusive"
                />
            }
            label="exklusiv"
        />
    );
}

const storyDefault = {
    parent: {
        issue: {
            series: {
                title: '',
                volume: 0,
                publisher: {
                    name: ''
                },
                number: ''
            }
        },
        number: 0
    },
    translator: {
        name: ''
    },
    writer: {
        name: ''
    },
    penciler: {
        name: ''
    },
    inker: {
        name: ''
    },
    colourist: {
        name: ''
    },
    letterer: {
        name: ''
    },
    editor: {
        name: ''
    },
    addinfo: '',
    exclusive: false,
};

const featureDefault = {
    title: '',
    addinfo: '',
    writer: {
        name: ''
    },
    exclusive: false,
};

const coverDefault = {
    parent: {
        issue: {
            series: {
                title: '',
                volume: 0,
                publisher: {
                    name: ''
                },
                number: ''
            }
        },
        number: 0
    },
    artist: {
        name: ''
    },
    addinfo: '',
    exclusive: false,
};
export default withContext(IssueEditor);