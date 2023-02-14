import {IssueSchema} from "../../../util/yupSchema";
import {FastField, Form, Formik} from "formik";
import {TextField} from "formik-material-ui";
import React from "react";
import {Mutation} from "react-apollo";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@material-ui/core/CardHeader";
import {apps, arcs, individuals, issue, issues, publishers, series} from "../../../graphql/queries";
import {decapitalize, stripItem, wrapItem} from "../../../util/util";
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
import Tooltip from "@material-ui/core/Tooltip";


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
                        name: '',
                        us: false
                    }
                },
                number: '',
                variant: '',
                cover: '',
                format: formats[0],
                limitation: 0,
                pages: 0,
                releasedate: '1900-01-01',
                price: '0',
                currency: currencies[0],
                individuals: [],
                addinfo: '',
                comicguideid: 0,
                stories: [],
                features: [],
                covers: []
            };

        this.state = {
            defaultValues: defaultValues,
            header: props.edit ?
                generateLabel(defaultValues) + " bearbeiten" : props.copy ? generateLabel(defaultValues) + " kopieren" :
                "Ausgabe erstellen",
            submitLabel: props.edit ?
                "Speichern" : props.copy ? "Kopieren" :
                "Erstellen",
            successMessage: props.edit ?
                " erfolgreich gespeichert" : props.copy ? " erfolgreich kopiert" :
                " erfolgreich erstellt",
            errorMessage: props.edit ?
                generateLabel(defaultValues) + " konnte nicht gespeichert werden" : props.copy ? " konnte nicht kopiert werden" :
                "Ausgabe konnte nicht erstellt werden"
        }
    }

    toogleUs = () => {
        let newDefaultValues = this.state.defaultValues;
        newDefaultValues.series.publisher.us = !newDefaultValues.series.publisher.us;
        this.setState({defaultValues: newDefaultValues});
    };

    render() {
        const {lastLocation, navigate, enqueueSnackbar, edit, mutation} = this.props;
        const {defaultValues, header, submitLabel, successMessage, errorMessage} = this.state;

        let mutationName = decapitalize(mutation.definitions[0].name.value);

        return (
            <Mutation mutation={mutation}
                      update={(cache, result) => {
                          let res = JSON.parse(JSON.stringify(result.data[mutationName]));

                          if(edit) {
                              let defVariables = {issue: {}};
                              defVariables.issue.series = stripItem(defaultValues.series);
                              defVariables.issue.series.publisher.us = undefined;
                              defVariables.issue.number = defaultValues.number;
                              if(defaultValues.format !== '')
                                  defVariables.issue.format = defaultValues.format;
                              if(defaultValues.variant !== '')
                                  defVariables.issue.variant = defaultValues.variant;

                              res.series.publisher.us = false;

                              try {
                                  updateInCache(cache, issue, defVariables, defVariables, wrapItem(res));
                              } catch (e) {
                                  //ignore cache exception;
                              }

                              try {
                                  let variables = JSON.parse(JSON.stringify(defVariables.issue));
                                  variables.__typename = "Issue";
                                  removeFromCache(cache, issues, {series: defVariables.issue.series}, variables);
                              } catch (e) {
                                  //ignore cache exception;
                              }

                              try {
                                  let variables = JSON.parse(JSON.stringify(defVariables));
                                  variables.edit = true;
                                  updateInCache(cache, issue, variables, variables, wrapItem(res));
                              } catch (e) {
                                  //ignore cache exception;
                              }
                          }

                          try {
                              let item = {};
                              item.title = res.title;
                              item.number = res.number;
                              item.series = res.series;
                              item.series.publisher.us = undefined;
                              item.format = res.format;
                              item.variant = res.variant;
                              item.__typename = 'Issue';
                              addToCache(cache, issues, stripItem(wrapItem(res.series)), item);
                          } catch (e) {
                              //ignore cache exception;
                          }
                      }}
                      onCompleted={(data) => {
                          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {variant: 'success'});
                          navigate(null, generateUrl(data[mutationName], data[mutationName].series.publisher.us));
                      }}
                      onError={(errors) => {
                          let message = (errors.graphQLErrors && errors.graphQLErrors.length > 0) ? ' [' + errors.graphQLErrors[0].message + ']' : '';
                          enqueueSnackbar(errorMessage + message, {variant: 'error'});
                      }}>
                {(mutation, {error}) => (
                    <Formik
                        initialValues={defaultValues}
                        validationSchema={IssueSchema}
                        onSubmit={async (values, actions) => {
                            actions.setSubmitting(true);

                            let stories = values.stories.map(e => {
                                if(e.exclusive || values.series.publisher.us)
                                    e.parent = undefined;
                                e.children = undefined;

                                return e;
                            });

                            let covers = values.covers.map(e => {
                                if(e.exclusive || values.series.publisher.us)
                                    e.parent = undefined;
                                e.children = undefined;

                                return e;
                            });

                            let variables = {};
                            variables.item = stripItem(values);
                            variables.item.cover = values.cover;
                            variables.item.stories = stories;
                            variables.item.covers = covers;

                            if(variables.item.series.publisher.us) {
                                variables.item.format = undefined;
                                variables.item.limitation = undefined;
                                variables.item.pages = undefined;
                                variables.item.comicguideid = undefined;
                                variables.item.price = undefined;
                                variables.item.currency = undefined;
                            }

                            if(edit) {
                                variables.old = {};
                                variables.old.series = stripItem(defaultValues.series);
                                variables.old.number = defaultValues.number;
                                variables.old.format = defaultValues.format;
                                variables.old.variant = defaultValues.variant;
                            }

                            if(variables.item.publisher)
                                variables.item.publisher = stripItem(variables.item.publisher);
                            if(variables.item.series)
                                variables.item.series = stripItem(variables.item.series);
                            if(variables.item.individuals) {
                                let i = [];

                                variables.item.individuals.forEach(item => {
                                    if (!i[item.name]) {
                                        i[item.name] = {name: item.name, type: []};
                                    }

                                    i[item.name].type = item.type;
                                });

                                variables.item.individuals = i.map(x => x);
                            }
                            if(variables.item.arcs)
                                variables.item.arcs = variables.item.arcs.map(item => stripItem(item));

                            if(variables.item.stories)
                                variables.item.stories = variables.item.stories.map(story => {
                                    if(story.series)
                                        story.series = stripItem(story.series);
                                    if(story.individuals) {
                                        let i = [];

                                        story.individuals.forEach(item => {
                                            if (!i[item.name]) {
                                                i[item.name] = {name: item.name, type: []};
                                            }

                                            i[item.name].type = item.type;
                                        });

                                        story.individuals = [];
                                        for (let k in i)
                                            story.individuals.push(i[k]);
                                    }

                                    if(story.appearances) {
                                        story.appearances = story.appearances.map(item => stripItem(item));
                                        story.appearances.forEach(a => {
                                            if (a.type === "FEATURED" || a.type === "ANTAGONIST" || a.type === "SUPPORTING" || a.type === "OTHER")
                                                a.type = "CHARACTER";
                                        })

                                    }

                                    if(story.parent && story.parent.issue && story.parent.issue.series)
                                        story.parent.issue.series = stripItem(story.parent.issue.series);
                                    return story;
                                });

                            if(variables.item.features)
                                variables.item.features = variables.item.features.map(feature => {
                                    if(feature.individuals) {
                                        let i = [];

                                        feature.individuals.forEach(item => {
                                            if (!i[item.name]) {
                                                i[item.name] = {name: item.name, type: []};
                                            }

                                            i[item.name].type = item.type;
                                        });
                                        feature.individuals = i.map(x => x);
                                    }

                                    return feature;
                                });

                            if(variables.item.covers)
                                variables.item.covers = variables.item.covers.map(cover => {
                                    if(cover.series)
                                        cover.series = stripItem(cover.series);

                                    if(cover.individuals) {
                                        let i = [];

                                        cover.individuals.forEach(item => {
                                            if (!i[item.name]) {
                                                i[item.name] = {name: item.name, type: []};
                                            }

                                            i[item.name].type = item.type;
                                        });
                                        cover.individuals = i.map(x => x);
                                    }

                                    if(cover.parent && cover.parent.issue && cover.parent.issue.series)
                                        cover.parent.issue.series = stripItem(cover.parent.issue.series);
                                    return cover;
                                });

                            await mutation({
                                variables: variables
                            });

                            actions.setSubmitting(false);
                        }}>
                        {({values, resetForm, submitForm, isSubmitting, setFieldValue}) => (
                            <Form>
                                <CardHeader title={header}
                                            action={
                                                <FormControlLabel
                                                    className="switchEditor"
                                                    control={
                                                        <Tooltip title={(values.series.publisher.us ? "Deutsche" : "US") + " Ausgabe"}>
                                                            <Switch
                                                                disabled={edit}
                                                                checked={values.series.publisher.us}
                                                                onChange={() => {
                                                                    this.toogleUs();
                                                                    resetForm();
                                                                }}
                                                                color="secondary"/>
                                                        </Tooltip>
                                                    }
                                                    label="US"
                                                />
                                            }/>

                                <CardContent className="cardContent">
                                    {
                                        this.props.desktop ? <Cover {...this.props} cover={values.cover} onDelete={() => setFieldValue('cover', '', true)}/> : null
                                    }

                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="title"
                                        label="Titel"
                                        component={TextField}
                                    />
                                    <br/>

                                    <AutoComplete
                                        query={publishers}
                                        name="series.publisher.name"
                                        label="Verlag"
                                        variables={{pattern: values.series.publisher.name, us: defaultValues.series.publisher.us ? defaultValues.series.publisher.us : false}}
                                        onChange={(option, live) => {
                                            if(typeof option !== "string" || option.trim() !== "") {
                                                if (live) {
                                                    setFieldValue("series.publisher.name", option);
                                                }
                                                else {
                                                    setFieldValue("series", {title: '', volume: '', publisher: {name : '', us: defaultValues.series.publisher.us}});

                                                    if(option)
                                                        setFieldValue("series.publisher", option);
                                                }
                                            }
                                        }}
                                        style={{
                                            width: this.props.desktop ? "40.8%" : "100%"
                                        }}
                                        generateLabel={generateLabel}
                                    />

                                    <br/>

                                    <AutoComplete
                                        disabled={!values.series.publisher.name || values.series.publisher.name.trim().length === 0}
                                        query={series}
                                        variables={{pattern: values.series.title, publisher: {name: values.series.publisher.name}}}
                                        name="series.title"
                                        label="Serie"
                                        onChange={(option, live) => {
                                            if(typeof option !== "string" || option.trim() !== "") {
                                                if (live) {
                                                    setFieldValue("series.title", option);
                                                }
                                                else {
                                                    setFieldValue("series", option ?
                                                        {title: option.title, volume: option.volume, publisher: {name : values.series.publisher.name, us: values.series.publisher.us}} :
                                                        {title: '', volume: '', publisher: {name : values.series.publisher.name, us: values.series.publisher.us}})
                                                }
                                            }
                                        }}
                                        style={{
                                            width: this.props.desktop ? "30.6%" : "73.3%"
                                        }}
                                        generateLabel={generateLabel}
                                    />

                                    <FastField
                                        disabled={!values.series.publisher.name ||
                                            values.series.publisher.name.trim().length === 0}
                                        className={this.props.desktop ? "field field10" : "field field25"}
                                        name="series.volume"
                                        label="Volume"
                                        type="number"
                                        component={TextField}
                                    />
                                    <br/>
                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="number"
                                        label="Nummer"
                                        component={TextField}
                                    />
                                    <br/>

                                    <div className={this.props.desktop ? "field field35 fieldFileUpload addBtn" :
                                        "field field100 fieldFileUpload addBtn"}>
                                        <FastField
                                            name="cover"
                                            label="Cover"
                                            component={SimpleFileUpload}
                                            onChange={(cover) => {
                                                setFieldValue("cover", cover, true);
                                            }}
                                        />
                                    </div>

                                    {
                                        !this.props.desktop ?
                                            <React.Fragment>
                                                <br/>
                                                <Cover {...this.props} cover={values.cover} onDelete={() => setFieldValue('cover', '', true)}/>
                                            </React.Fragment> : null
                                    }

                                    {
                                        !values.series.publisher.us ?
                                            <React.Fragment>
                                                <FastField
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
                                                </FastField>
                                                <br/>
                                            </React.Fragment> : null
                                    }

                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="variant"
                                        label="Variante"
                                        component={TextField}
                                    />
                                    <br/>

                                    {
                                        !values.series.publisher.us ?
                                            <React.Fragment>
                                                <FastField
                                                    className={this.props.desktop ? "field field35" : "field field100"}
                                                    name="limitation"
                                                    label="Limitierung"
                                                    type="number"
                                                    component={TextField}
                                                />
                                                <br/>
                                                <FastField
                                                    className={this.props.desktop ? "field field35" : "field field100"}
                                                    name="pages"
                                                    label="Seiten"
                                                    type="number"
                                                    component={TextField}
                                                />
                                                <br/>
                                            </React.Fragment> : null
                                    }

                                    {
                                        !values.series.publisher.us ?
                                            <React.Fragment>
                                                <FastField
                                                    className={this.props.desktop ? "field field30" : "field field75"}
                                                    name="price"
                                                    label="Preis"
                                                    component={TextField}
                                                />

                                                <FastField
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
                                                </FastField>
                                                <br/>

                                                <FastField
                                                    className={this.props.desktop ? "field field35" : "field field100"}
                                                    name="releasedate"
                                                    label="Erscheinungsdatum"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    component={TextField}
                                                />
                                                <br/>
                                            </React.Fragment> :

                                            <React.Fragment>
                                                <FastField
                                                    className={this.props.desktop ? "field field35" : "field field100"}
                                                    name="releasedate"
                                                    label="Erscheinungsdatum"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    component={TextField}
                                                />
                                                <br/>

                                                <AutoComplete
                                                    query={individuals}
                                                    name="individuals"
                                                    type="EDITOR"
                                                    nameField="name"
                                                    label="Verleger"
                                                    isMulti
                                                    creatable
                                                    variables={{pattern: getPattern(values.individuals, "name")}}
                                                    onChange={(option) => setFieldValue("individuals", option)}
                                                    style={{
                                                        width: this.props.desktop ? "40.8%" : "100%"
                                                    }}
                                                    generateLabel={(e) => e.name}
                                                />

                                                <AutoComplete
                                                    query={arcs}
                                                    name="arcs"
                                                    type="EVENT"
                                                    nameField="title"
                                                    label="Event"
                                                    isMulti
                                                    creatable
                                                    variables={{pattern: getPattern(values.arcs, "title"), type: "EVENT"}}
                                                    onChange={(option) => setFieldValue("arcs", option)}
                                                    style={{
                                                        width: this.props.desktop ? "40.8%" : "100%"
                                                    }}
                                                    generateLabel={(e) => e.title}
                                                />

                                                <AutoComplete
                                                    query={arcs}
                                                    name="arcs"
                                                    type="STORYARC"
                                                    nameField="title"
                                                    label="Arc"
                                                    isMulti
                                                    creatable
                                                    variables={{pattern: getPattern(values.arcs, "title"), type: "STORYARC"}}
                                                    onChange={(option) => setFieldValue("arcs", option)}
                                                    style={{
                                                        width: this.props.desktop ? "40.8%" : "100%"
                                                    }}
                                                    generateLabel={(e) => e.title}
                                                />

                                                <AutoComplete
                                                    query={arcs}
                                                    name="arcs"
                                                    type="STORYLINE"
                                                    nameField="title"
                                                    label="Storyline"
                                                    isMulti
                                                    creatable
                                                    variables={{pattern: getPattern(values.arcs, "title"), type: "STORYLINE"}}
                                                    onChange={(option) => setFieldValue("arcs", option)}
                                                    style={{
                                                        width: this.props.desktop ? "40.8%" : "100%"
                                                    }}
                                                    generateLabel={(e) => e.title}
                                                />
                                            </React.Fragment>
                                    }

                                    {
                                        !values.series.publisher.us ?
                                            <React.Fragment>
                                                <FastField
                                                    className={this.props.desktop ? "field field35" : "field field100"}
                                                    name="comicguideid"
                                                    label="Comicguide ID"
                                                    type="number"
                                                    component={TextField}
                                                />
                                            </React.Fragment> : null
                                    }

                                    <br/>

                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="addinfo"
                                        label="Weitere Informationen"
                                        multiline
                                        rows={10}
                                        component={TextField}
                                    />

                                    <br/>
                                    <br/>

                                    <Stories setFieldValue={setFieldValue} items={values.stories} {...this.props} values={values}
                                             us={values.series.publisher.us}/>

                                    <br/>

                                    <Covers setFieldValue={setFieldValue} items={values.covers} {...this.props}
                                            us={values.series.publisher.us} values={values}/>

                                    <br/>


                                    <div className="formButtons">
                                        <Button disabled={isSubmitting}
                                                onMouseDown={(e) => {
                                                    values = defaultValues;
                                                    resetForm();
                                                }}
                                                color="secondary">
                                            Zurücksetzen
                                        </Button>

                                        <Button disabled={isSubmitting}
                                                onMouseDown={(e) => this.props.navigate(e, lastLocation ? lastLocation.pathname : "/")}
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
                    onMouseDown={(e) => this.triggerCoverIsOpen()}/>

                <Lightbox
                    showImageCount={false}
                    images={[{src: this.createPreview(this.props.cover)}]}
                    isOpen={this.state.isCoverOpen}
                    onClose={() => this.triggerCoverIsOpen()}/>

                <IconButton className="removeBtnCover" aria-label="Entfernen"
                            onMouseDown={(e) => {
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
    let extended = (props.items[props.index].exclusive || props.us) ?
        <StoryFieldsExclusive {...props} /> :
        <StoryFieldsNonExclusive {...props} />;

    return (
        <React.Fragment>
            <div className="storyAddInputContainer">
                <span style={{
                    color: "gray", fontSize: "small"
                }}>
                    {props.items[props.index].parent ? props.items[props.index].parent.title : ""}
                </span>

                <br/>

                <FastField
                    className="field field3"
                    name={"stories[" + props.index + "].number"}
                    disabled={props.disabled}
                    label="#"
                    type="number"
                    component={TextField}
                />

                <FastField
                    className={props.desktop ? "field field35" : "field field95"}
                    name={"stories[" + props.index + "].title"}
                    disabled={props.disabled}
                    label="Titel"
                    component={TextField}
                />

                <FastField
                    className={props.desktop ? "field field30" : "field field100"}
                    name={"stories[" + props.index + "].addinfo"}
                    disabled={props.disabled}
                    label="Weitere Informationen"
                    component={TextField}
                />

                <FastField
                    className={props.desktop ? "field field10" : "field field100"}
                    name={"stories[" + props.index + "].part"}
                    disabled={props.disabled}
                    label="Teil"
                    component={TextField}
                />

                {!props.us ? <ExclusiveToggle {...props}/> : null}
            </div>

            {extended}
        </React.Fragment>
    );
}

function generateSeriesLabelWithYears(series) {
    return generateLabel(series);
}

function StoryFieldsNonExclusive(props) {
    const {index, setFieldValue, values} = props;

    return (
        <div className="storyAddInputContainer">
            <AutoComplete
                query={series}
                name={"stories[" + index + "].parent.issue.series"}
                nameField="title"
                label="Serie"
                creatable
                variables={{pattern: values.stories[index].parent.issue.series.title, publisher: {name: "*", us: true}}}
                onChange={(option, live) => {
                    if(typeof option !== "string" || option.trim() !== "") {
                        if (live) {
                            setFieldValue("stories[" + index + "].parent.issue.series.title", option)
                        }
                        else {
                            if(option && !option.volume)
                                option.volume = 0;

                            setFieldValue("stories[" + index + "].parent.issue.series", option ? option : {title: '', volume: 0});
                        }
                    }
                }}
                style={{
                    width: props.desktop ? "40%" : "99%"
                }}
                generateLabel={generateSeriesLabelWithYears}
            />

            <FastField
                className={props.desktop ? "field field5" : "field field25"}
                name={"stories[" + index + "].parent.issue.series.volume"}
                label="Volume"
                type="number"
                component={TextField}
            />

            <FastField
                className={props.desktop ? "field field5" : "field field60"}
                name={"stories[" + index + "].parent.issue.number"}
                label="Nummer"
                component={TextField}
            />

            <FastField
                className={props.desktop ? "field field5" : "field field10"}
                name={"stories[" + index + "].parent.number"}
                label="#"
                type="number"
                component={TextField}
            />

            <AutoComplete
                query={individuals}
                name={"stories[" + index + "].individuals"}
                type={"TRANSLATOR"}
                nameField="name"
                label="Übersetzer"
                disabled={props.disabled}
                isMulti
                creatable
                variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                style={{
                    width: props.desktop ? "35%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
        </div>
    );
}

export function updateField(option, live, values, setFieldValue, field, pattern) {
    if(typeof option !== "string" || option.trim() !== "") {
        if (live) {
            values = values ? values : [];

            let arr = JSON.parse(JSON.stringify(values));

            if(arr.length === 0 || !arr[arr.length-1].pattern) {
                let dummy = {pattern: true};
                dummy[pattern] = option;
                arr.push(dummy);
            }
            else {
                let dummy = arr[arr.length-1];
                dummy[pattern] = option;
                arr[arr.length-1] = dummy;
            }

            setFieldValue(field, arr);
        }
        else {
            let selected = JSON.parse(JSON.stringify(values));
            let previous;

            switch (option.action) {
                case 'deselect-option':
                case 'select-option':
                    previous = selected.filter(v => v.name === option.option.name);

                    if (previous.length > 0) {
                        if (option.option.__typename === "Appearance") {
                            previous[0].type = option.type;
                            previous[0].role = option.role;
                        } else {
                            if(previous[0].type.filter(v => v === option.type).length === 0) {
                                previous[0].type.push(option.type);
                                if(previous[0].role)
                                    previous[0].role.push(option.role);
                            }
                        }
                    } else {
                        let value = option.option;

                        if (option.option.__typename === "Appearance") {
                            value.type = option.type;
                            value.role = option.role;
                        } else {
                            value.type = [option.type];
                            value.role = [option.role];
                        }

                        selected.push(value);
                    }

                    break;

                case 'remove-value':
                    if (option.name.indexOf("appearances") > 0) {
                        selected = selected.filter(v => v.name + v.type !== option.removedValue.name + option.type);
                    } else {
                        previous = selected.filter(v => v.name === option.removedValue.name);

                        if (previous.length > 0) {
                            previous[0].type = previous[0].type.filter(v => v !== option.type);
                        }
                    }

                    break;

                case 'clear':
                    if (option.name.indexOf("appearances") > 0) {
                        selected = selected.filter(v => v.type !== option.type);
                    } else {
                        selected.forEach(s => {
                            s.type = s.type.filter(v => v !== option.type);
                        })
                    }
                    break;

                case 'create-option':
                    selected.push({
                        name: values[values.length-1].name,
                        type: [option.type],
                        role: [option.role]
                    });

                    break;

                default:
                    return;
            }

            selected = selected.filter(s => !s.pattern && s.type.length > 0);
            setFieldValue(field, selected);
        }
    }
}

export function getPattern(arr, pattern) {
    if(!arr || arr.length === 0 || !arr[arr.length-1].pattern)
        return null;

    return arr[arr.length-1][pattern];
}

function StoryFieldsExclusive(props) {
    const {index, setFieldValue, values} = props;

    return (
        <React.Fragment>
            <div className="storyAddInputContainer">
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].individuals"}
                    type={"WRITER"}
                    nameField="name"
                    label="Autor"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "99%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].individuals"}
                    type={"PENCILER"}
                    nameField="name"
                    label="Zeichner"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].individuals"}
                    type={"INKER"}
                    nameField="name"
                    label="Inker"
                    isMulti
                    disabled={props.disabled}
                    creatable
                    variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
            </div>
            <div className="storyAddInputContainer">
                <AutoComplete
                    query={individuals}
                    type={"COLORIST"}
                    name={"stories[" + index + "].individuals"}
                    nameField="name"
                    label="Kolorist"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].individuals"}
                    type={"LETTERER"}
                    nameField="name"
                    label="Letterer"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].individuals"}
                    type={"EDITOR"}
                    nameField="name"
                    label="Verleger"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].individuals, "name")}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].individuals, setFieldValue, "stories[" + index + "].individuals", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <br />
                <br />
                <br />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"FEATURED"}
                    nameField="name"
                    label="Hauptcharaktere"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "CHARACTER"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"ANTAGONIST"}
                    nameField="name"
                    label="Antagonisten"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "CHARACTER"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"SUPPORTING"}
                    nameField="name"
                    label="Unterstützende Charaktere"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "CHARACTER"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"OTHER"}
                    nameField="name"
                    label="Andere Charaktere"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "CHARACTER"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"GROUP"}
                    nameField="name"
                    label="Teams"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "GROUP"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"RACE"}
                    nameField="name"
                    label="Rassen"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "RACE"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"ANIMAL"}
                    nameField="name"
                    label="Tiere"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "ANIMAL"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"ITEM"}
                    nameField="name"
                    label="Gegenstände"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "ITEM"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"VEHICLE"}
                    nameField="name"
                    label="Fahrzeuge"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "VEHICLE"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />

                <AutoComplete
                    query={apps}
                    name={"stories[" + index + "].appearances"}
                    type={"LOCATION"}
                    nameField="name"
                    label="Orte"
                    disabled={props.disabled}
                    isMulti
                    creatable
                    variables={{pattern: getPattern(values.stories[index].appearances, "name"), type: "LOCATION"}}
                    onChange={(option, live) => updateField(option, live, values.stories[index].appearances, setFieldValue, "stories[" + index + "].appearances", "name")}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
            </div>
        </React.Fragment>
    );
}

function Covers(props) {
    return (
        <React.Fragment>
            <div>
                <CardHeader className="left" title="Covergalerie"/>
                <AddContainsButton disabled={props.us} type="covers" default={coverDefault} {...props} />
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
            <div className="storyAddInputContainer">
                {props.items[props.index].number === 0 ?
                    <FastField
                        className="field field3"
                        name={"covers[" + props.index + "].number"}
                        label="#"
                        disabled
                        type="number"
                        component={TextField}
                    /> :
                    <FastField
                        className="field field3"
                        name={"covers[" + props.index + "].number"}
                        label="#"
                        disabled={props.disabled}
                        type="number"
                        component={TextField}
                    />
                }
                <FastField
                    className={props.desktop ? "field field75" : "field field95"}
                    name={"covers[" + props.index + "].addinfo"}
                    label="Weitere Informationen"
                    disabled={props.disabled}
                    component={TextField}
                />

                {!props.us ? <ExclusiveToggle {...props}/> : null}
            </div>

            {extended}

        </React.Fragment>
    );
}

function CoverFieldsNonExclusive(props) {
    const {index, setFieldValue, values} = props;

    return (
        <div className="storyAddInputContainer">
            <AutoComplete
                query={series}
                name={"covers[" + index + "].parent.issue.series"}
                nameField="title"
                label="Serie"
                creatable
                variables={{pattern: values.covers[index].parent.issue.series.title, publisher: {name: "*", us: true}}}
                onChange={(option, live) => {
                    if(typeof option !== "string" || option.trim() !== "") {
                        if (live) {
                            setFieldValue("covers[" + index + "].parent.issue.series.title", option)
                        }
                        else {
                            if(option && !option.volume)
                                option.volume = 0;

                            setFieldValue("covers[" + index + "].parent.issue.series", option ? option : {title: '', volume: 0});
                        }
                    }
                }}
                style={{
                    width: props.desktop ? "40%" : "99%"
                }}
                generateLabel={generateSeriesLabelWithYears}
            />

            <FastField
                className={props.desktop ? "field field5" : "field field25"}
                name={"covers[" + index + "].parent.issue.series.volume"}
                label="Volume"
                type="number"
                component={TextField}
            />

            <FastField
                className={props.desktop ? "field field5" : "field field73"}
                name={"covers[" + index + "].parent.issue.number"}
                label="Nummer"
                component={TextField}
            />

            <FastField
                className={props.desktop ? "field field30" : "field field100"}
                name={"covers[" + index + "].parent.issue.variant"}
                label="Variante"
                component={TextField}
            />
        </div>
    );
}

function CoverFieldsExclusive(props) {
    const {index, setFieldValue} = props;

    return (
        <React.Fragment>
            <AutoComplete
                query={individuals}
                name={"covers[" + index + "].individuals"}
                nameField="name"
                type={"ARTIST"}
                label="Zeichner"
                isMulti
                creatable
                disabled={props.disabled}
                variables={{pattern: getPattern(props.values.covers[props.index].individuals, "name")}}
                onChange={(option, live) => updateField(option, live, props.values.covers[index].individuals, setFieldValue, "covers[" + index + "].individuals", "name")}
                style={{
                    width: props.desktop ? "40%" : "99%"
                }}
                generateLabel={(e) => e.name}
            />
        </React.Fragment>
    );
}

function Contains(props) {
    if(!props.items || props.items.length === 0)
        return <Typography className="noRelationsWarning">Hinzufügen mit '+'</Typography>;

    return props.items.map((item, index) => <ContainsItem key={index} {...props} item={item} index={index} />);
}

class ContainsItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item) ||
            JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items);
    }

    render() {
        return (
            <div key={this.props.index} className="storyAddContainer">
                <RemoveContainsButton disabled={this.props.item.children && this.props.item.children.length > 0}
                                      {...this.props}/>

                <ExpansionPanel className="storyAddPanel" key={this.props.index} expanded={true}>
                    <ExpansionPanelSummary className="storyAdd">
                        {React.cloneElement(this.props.fields, {
                            ...this.props,
                            disabled: this.props.item.children && this.props.item.children.length > 0
                        })}
                    </ExpansionPanelSummary>
                </ExpansionPanel>
            </div>
        );
    }
}

function AddContainsButton(props) {
    return (
        <IconButton disabled={props.disabled} className="addBtn" aria-label="Hinzufügen"
                    onMouseDown={(e) => {
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
        <IconButton disabled={props.disabled} className="removeBtn" aria-label="Entfernen"
                    onMouseDown={(e) => {
                        let items = props.items.filter(e => JSON.stringify(e) !== JSON.stringify(props.item));
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
                        let item = JSON.parse(JSON.stringify(items[index]));

                        if(items[index].exclusive) {
                            item.individuals = undefined;
                            if(type === "stories")
                                item.appearances = undefined;
                            item.parent = {issue: {series: {title: ""}}};
                            item.exclusive = false;
                        }
                        else{
                            item.exclusive = true;
                            item.individuals = [];
                            if(type === "stories")
                                item.appearances = [];
                            item.parent = undefined;
                            item.exclusive = true;
                        }

                        setFieldValue(type + "[" + index + "]", item);
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
                volume: 1,
                publisher: {
                    name: ''
                },
            },
            number: 0
        },
        number: 0
    },
    individuals: [],
    addinfo: '',
    part: '',
    exclusive: false,
};

const coverDefault = {
    parent: {
        issue: {
            series: {
                title: '',
                volume: 1,
                publisher: {
                    name: ''
                },
            },
            number: '0',
            variant: ''
        },
        number: 0
    },
    individuals: [],
    addinfo: '',
    number: 0,
    exclusive: false,
};
export default withContext(IssueEditor);