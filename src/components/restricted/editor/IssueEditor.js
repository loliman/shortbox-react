import {IssueSchema} from "../../../util/yupSchema";
import {FastField, Form, Formik} from "formik";
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
                editors: [],
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

    toogleUs = () => {
        let newDefaultValues = this.state.defaultValues;
        newDefaultValues.series.publisher.us = !newDefaultValues.series.publisher.us;
        this.setState({defaultValues: newDefaultValues});
    };

    render() {
        const {lastLocation, history, enqueueSnackbar, edit, mutation} = this.props;
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
                          history.push(generateUrl(data[mutationName], data[mutationName].series.publisher.us));
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
                                if(e.exclusive || values.series.publisher.us) {
                                    e.parent = undefined;
                                    e.translators = undefined;
                                } else {
                                    e.writers = undefined;
                                    e.pencilers = undefined;
                                    e.inkers = undefined;
                                    e.colourists = undefined;
                                    e.letterers = undefined;
                                    e.editors = undefined;
                                }
                                e.children = undefined;

                                return e;
                            });

                            let covers = values.covers.map(e => {
                                if(e.exclusive || values.series.publisher.us) {
                                    e.parent = undefined;
                                } else {
                                    e.artists = undefined;
                                }
                                e.children = undefined;

                                return e;
                            });

                            let variables = {};
                            variables.item = stripItem(values);
                            variables.item.cover = values.cover;
                            variables.item.stories = stories;
                            variables.item.covers = covers;

                            if(!variables.item.series.publisher.us)
                                variables.item.editors = undefined;
                            else {
                                variables.item.format = undefined;
                                variables.item.limitation = undefined;
                                variables.item.pages = undefined;
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
                            if(variables.item.editors)
                                variables.item.editors = variables.item.editors.map(item => stripItem(item));

                            if(variables.item.stories)
                                variables.item.stories = variables.item.stories.map(story => {
                                   if(story.series)
                                       story.series = stripItem(story.series);
                                   if(story.translators)
                                       story.translators = story.translators.map(item => stripItem(item));
                                   if(story.writers)
                                       story.writers = story.writers.map(item => stripItem(item));
                                   if(story.pencilers)
                                       story.pencilers = story.pencilers.map(item => stripItem(item));
                                   if(story.inkers)
                                       story.inkers = story.inkers.map(item => stripItem(item));
                                   if(story.colourists)
                                       story.colourists = story.colourists.map(item => stripItem(item));
                                   if(story.inkers)
                                       story.letterers = story.letterers.map(item => stripItem(item));
                                   if(story.editors)
                                       story.editors = story.editors.map(item => stripItem(item));
                                   if(story.parent && story.parent.issue && story.parent.issue.series)
                                       story.parent.issue.series = stripItem(story.parent.issue.series);
                                   return story;
                                });

                            if(variables.item.features)
                                variables.item.features = variables.item.features.map(feature => {
                                    if(feature.writers)
                                        feature.writers= feature.writers.map(item => stripItem(item));

                                    return feature;
                                });

                            if(variables.item.covers)
                                variables.item.covers = variables.item.covers.map(cover => {
                                    if(cover.series)
                                        cover.series = stripItem(cover.series);
                                    if(cover.artists)
                                        cover.artists = cover.artists.map(item => stripItem(item));
                                    if(cover.parent && cover.parent.issue && cover.parent.issue.series)
                                        cover.parent.issue.series = stripItem(cover.parent.issue.series);
                                    return cover;
                                });

                            await mutation({
                                variables: variables
                            });

                            actions.setSubmitting(false);
                            if(error)
                                actions.resetForm();
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
                                        variables={{us: defaultValues.series.publisher.us ? defaultValues.series.publisher.us : false}}
                                        name="series.publisher.name"
                                        label="Verlag"
                                        onChange={(option) => {
                                            setFieldValue("series", {title: '', volume: '', publisher: {name : '', us: defaultValues.series.publisher.us}});

                                            if(option)
                                                setFieldValue("series.publisher", option);

                                        }}
                                        style={{
                                            width: this.props.desktop ? "35.7%" : "100%"
                                        }}
                                        generateLabel={generateLabel}
                                    />

                                    <br/>

                                    <AutoComplete
                                        disabled={!values.series.publisher.name || values.series.publisher.name.trim().length === 0}
                                        query={series}
                                        variables={{publisher: {name: values.series.publisher.name}}}
                                        name="series.title"
                                        label="Serie"
                                        onChange={(option) => {
                                            setFieldValue("series", option ?
                                                {title: option.title, volume: option.volume, publisher: {name : values.series.publisher.name, us: values.series.publisher.us}} :
                                                {title: '', volume: '', publisher: {name : values.series.publisher.name, us: values.series.publisher.us}})
                                        }}
                                        style={{
                                            width: this.props.desktop ? "25.7%" : "73.3%"
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

                                    <FastField
                                        className={this.props.desktop ? "field field35" : "field field100"}
                                        name="releasedate"
                                        label="Erscheinungsdatum"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        component={TextField}
                                    />
                                    <br/>

                                    {
                                        !values.series.publisher.us ?
                                            <React.Fragment>
                                                <FastField
                                                    className={this.props.desktop ? "field field25" : "field field75"}
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
                                            </React.Fragment> :

                                            <AutoComplete
                                                query={individuals}
                                                name="editors"
                                                nameField="name"
                                                label="Editor"
                                                isMulti
                                                creatable
                                                onChange={(option) => setFieldValue("editors", option)}
                                                style={{
                                                    width: this.props.desktop ? "35.7%" : "100%"
                                                }}
                                                generateLabel={(e) => e.name}
                                            />
                                    }

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

                                    <Stories setFieldValue={setFieldValue} items={values.stories} {...this.props}
                                        us={values.series.publisher.us}/>

                                    <br/>

                                    {
                                        !values.series.publisher.us ?
                                            <React.Fragment>
                                                <Features setFieldValue={setFieldValue} items={values.features} {...this.props}/>

                                                <br/>
                                            </React.Fragment> : null
                                    }

                                    <Covers setFieldValue={setFieldValue} items={values.covers} {...this.props}
                                        us={values.series.publisher.us}/>

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
    let extended = (props.items[props.index].exclusive || props.us) ?
        <StoryFieldsExclusive {...props} /> :
        <StoryFieldsNonExclusive {...props} />;

    return (
        <React.Fragment>
            <div className="storyAddInputContainer">
                <FastField
                    className="field field3"
                    name={"stories[" + props.index + "].number"}
                    label="#"
                    type="number"
                    component={TextField}
                />

                <FastField
                    className={props.desktop ? "field field35" : "field field95"}
                    name={"stories[" + props.index + "].title"}
                    label="Titel"
                    component={TextField}
                />

                <FastField
                    className={props.desktop ? "field field35" : "field field100"}
                    name={"stories[" + props.index + "].addinfo"}
                    label="Weitere Informationen"
                    component={TextField}
                />

                {!props.us ? <ExclusiveToggle {...props}/> : null}
            </div>

            {extended}
        </React.Fragment>
    );
}

function generateSeriesLabelWithYears(series) {
    let label = generateLabel(series);

    /*if(series.startyear) {
        label += " (" + series.startyear + " - ";
        if(series.endyear === 0)
            label += "...";
        else
            label += series.endyear;
        label += ")";
    }*/

    return label;
}

function StoryFieldsNonExclusive(props) {
    const {index, setFieldValue} = props;

    return (
        <div className="storyAddInputContainer">
            <AutoComplete
                    query={series}
                    variables={{publisher: {name: "*", us: true}}}
                    name={"stories[" + index + "].parent.issue.series"}
                    nameField="title"
                    label="Serie"
                    creatable
                    onChange={(option) => {
                        if(option && !option.volume)
                            option.volume = 0;

                        setFieldValue("stories[" + index + "].parent.issue.series", option ? option : {title: '', volume: 0});
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
                name={"stories[" + index + "].translators"}
                nameField="name"
                label="Übersetzer"
                isMulti
                creatable
                onChange={(option) => setFieldValue("stories[" + index + "].translators", option)}
                style={{
                    width: props.desktop ? "35%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />
        </div>
    );
}

function StoryFieldsExclusive(props) {
    const {index, setFieldValue} = props;

    return (
        <React.Fragment>
            <div className="storyAddInputContainer">
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].writers"}
                    nameField="name"
                    label="Autor"
                    isMulti
                    creatable
                    onChange={(option) => setFieldValue("stories[" + index + "].writers", option)}
                    style={{
                        width: props.desktop ? "33.3%" : "99%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].pencilers"}
                    nameField="name"
                    label="Zeichner"
                    isMulti
                    creatable
                    onChange={(option) => setFieldValue("stories[" + index + "].pencilers", option)}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].inkers"}
                    nameField="name"
                    label="Inker"
                    isMulti
                    creatable
                    onChange={(option) => setFieldValue("stories[" + index + "].inkers", option)}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
            </div>
            <div className="storyAddInputContainer">
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].colourists"}
                    nameField="name"
                    label="Kolorist"
                    isMulti
                    creatable
                    onChange={(option) => setFieldValue("stories[" + index + "].colourists", option)}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].letterers"}
                    nameField="name"
                    label="Letterer"
                    isMulti
                    creatable
                    onChange={(option) => setFieldValue("stories[" + index + "].letterers", option)}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
                <AutoComplete
                    query={individuals}
                    name={"stories[" + index + "].editors"}
                    nameField="name"
                    label="Editor"
                    isMulti
                    creatable
                    onChange={(option) => setFieldValue("stories[" + index + "].editors", option)}
                    style={{
                        width: props.desktop ? "33.3%" : "100%"
                    }}
                    generateLabel={(e) => e.name}
                />
            </div>
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
        <div className="storyAddInputContainer">
            <FastField
                className="field field3"
                name={"features[" + props.index + "].number"}
                label="#"
                type="number"
                component={TextField}
            />

            <FastField
                className={props.desktop ? "field field30" : "field field95"}
                name={"features[" + props.index + "].title"}
                label="Titel"
                component={TextField}
            />

            <AutoComplete
                query={individuals}
                name={"features[" + props.index + "].writers"}
                nameField="name"
                label="Autor"
                isMulti
                creatable
                onChange={(option) => props.setFieldValue("features[" + props.index + "].writers", option)}
                style={{
                    width: props.desktop ? "30%" : "100%"
                }}
                generateLabel={(e) => e.name}
            />

            <FastField
                className={props.desktop ? "field field30" : "field field100"}
                name={"features[" + props.index + "].addinfo"}
                label="Weitere Informationen"
                component={TextField}
            />
        </div>
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
                        type="number"
                        component={TextField}
                    />
                }
                <FastField
                    className={props.desktop ? "field field75" : "field field95"}
                    name={"covers[" + props.index + "].addinfo"}
                    label="Weitere Informationen"
                    component={TextField}
                />

                {!props.us ? <ExclusiveToggle {...props}/> : null}
            </div>

            {extended}

        </React.Fragment>
    );
}

function CoverFieldsNonExclusive(props) {
    const {index, setFieldValue} = props;

    return (
        <div className="storyAddInputContainer">
            <AutoComplete
                query={series}
                variables={{publisher: {name: "*", us: true}}}
                name={"covers[" + index + "].parent.issue.series"}
                nameField="title"
                label="Serie"
                creatable
                onChange={(option) => {
                    if(option && !option.volume)
                        option.volume = 0;
                    setFieldValue("covers[" + index + "].parent.issue.series", option ? option : {title: '', volume: 0});
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
                name={"covers[" + index + "].artists"}
                nameField="name"
                label="Artist"
                isMulti
                creatable
                onChange={(option) => setFieldValue("covers[" + index + "].artists", option)}
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
        return JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item);
    }

    render() {
        return (
            <div key={this.props.index} className="storyAddContainer">
                <RemoveContainsButton disabled={this.props.item.children && this.props.item.children.length > 0}
                                      {...this.props}/>

                <ExpansionPanel className="storyAddPanel" key={this.props.index} expanded={true}>
                    <ExpansionPanelSummary className="storyAdd">
                        {React.cloneElement(this.props.fields, {
                            ...this.props
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
        <IconButton disabled={props.disabled} className="removeBtn" aria-label="Entfernen"
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
                volume: 1,
                publisher: {
                    name: ''
                },
            },
            number: 0
        },
        number: 1
    },
    translators: [],
    writers: [],
    pencilers: [],
    inkers: [],
    colourists: [],
    letterers: [],
    editors: [],
    addinfo: '',
    exclusive: false,
};

const featureDefault = {
    title: '',
    addinfo: '',
    writers: [],
    number: 0
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
    artists: [],
    addinfo: '',
    number: 0,
    exclusive: false,
};
export default withContext(IssueEditor);