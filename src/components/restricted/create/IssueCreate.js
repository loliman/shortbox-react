import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createIssue} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {individuals, issues, publishers, series} from "../../../graphql/queries";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import {IssueSchema} from "../../../util/yupSchema";
import {withContext} from "../../generic";
import AutoComplete from "../../generic/AutoComplete";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {ExpansionPanelSummary} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Lightbox from "react-images";
import CardMedia from "@material-ui/core/CardMedia";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Link from "react-router-dom/es/Link";
import {stripItem} from "../../../util/util";
import SimpleFileUpload from "../../generic/SimpleFileUpload";

class IssueCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCoverOpen: false,
            cover: null
        };
    }
    
    render() {
        const {history, enqueueSnackbar, us} = this.props;

        return (
            <Layout>
                <Mutation mutation={createIssue}
                          update={(cache, result) => {
                              try {
                                  let data = cache.readQuery({
                                      query: issues,
                                      variables: {
                                          series: {
                                              title: result.data.createIssue.series.title,
                                              volume: result.data.createIssue.series.volume,
                                              publisher: {
                                                  name: result.data.createIssue.series.publisher.name
                                              }
                                          }
                                      }
                                  });

                                  if (data.issues.filter(e => e.number === result.data.createIssue.number).length === 0) {
                                      data.issues.push(result.data.createIssue);
                                      data.issues.sort((a, b) => {
                                          return (a.number).localeCompare((b.number));
                                      });

                                      cache.writeQuery({
                                          query: issues,
                                          variables: {
                                              series: {
                                                  title: result.data.createIssue.series.title,
                                                  volume: result.data.createIssue.series.volume,
                                                  publisher: {
                                                      name: result.data.createIssue.series.publisher.name
                                                  }
                                              }
                                          },
                                          data: data
                                      });
                                  }
                              } catch (e) {
                                  //ignore cache exception;
                              }
                          }}
                          onCompleted={(data) => {
                              enqueueSnackbar(generateLabel(data.createIssue) + " erfolgreich erstellt", {variant: 'success'});
                              history.push(generateUrl(data.createIssue));
                          }}
                          onError={() => {
                              enqueueSnackbar("Ausgabe kann nicht erstellt werden", {variant: 'error'});
                          }}>
                    {(createIssue, {error}) => (
                        <Formik
                            initialValues={{
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
                                releasedate: '01-01-1900',
                                price: '',
                                currency: 'EUR',
                                addinfo: '',
                                stories: [],
                                features: [],
                                covers: []
                            }}
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

                                await createIssue({
                                    variables: {
                                        issue : {
                                            title: values.title,
                                            series: {
                                                title: values.series.title,
                                                volume: values.series.volume,
                                                publisher: {
                                                    name: values.series.publisher.name
                                                }
                                            },
                                            number: values.number,
                                            cover: values.cover,
                                            format: values.format,
                                            variant: values.variant,
                                            limitation: values.limitation,
                                            pages: values.pages,
                                            releasedate: values.releasedate,
                                            price: values.price + '',
                                            currency: values.currency,
                                            addinfo: values.addinfo,
                                            stories: stories,
                                            features: values.features,
                                            covers: covers
                                        }
                                    }
                                });

                                actions.setSubmitting(false);
                                if (error)
                                    actions.resetForm();
                            }}
                            on>
                            {({resetForm, submitForm, isSubmitting, values, setFieldValue}) => {
                                if(values.cover !== '' && !values.covers.find(e => e.number === 0))
                                    values.covers.unshift({
                                        number: 0,
                                        parent: {
                                            issue: {
                                                series: {
                                                    title: '',
                                                    volume: 0,
                                                    publisher: {
                                                        name: ''
                                                    },
                                                    number: ''
                                                },
                                            },
                                            number: 0
                                        },
                                        artist: {
                                            name: ''
                                        },
                                        addinfo: '',
                                        exclusive: false,
                                    });
                                else if (values.cover === '') {
                                    values.covers = values.covers.filter(e => e.number !== 0);
                                }

                                return (
                                    <Form>
                                        <CardHeader title="Ausgabe erstellen"/>

                                        <CardContent className="cardContent">
                                            {
                                                this.state.cover !== null ?
                                                    <div className="right field50">
                                                        <CardMedia
                                                            image={this.state.cover}
                                                            title="Cover Vorschau"
                                                            className="media field100"
                                                            onClick={() => this.triggerCoverIsOpen()}/>

                                                        <Lightbox
                                                            showImageCount={false}
                                                            images={[{src: this.state.cover}]}
                                                            isOpen={this.state.isCoverOpen}
                                                            onClose={() => this.triggerCoverIsOpen()}/>

                                                        <IconButton className="removeBtnCover" aria-label="Entfernen"
                                                                    onClick={() => {
                                                                        setFieldValue('cover', '', true);
                                                                        this.setState({cover: null});
                                                                    }}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </div> : null
                                            }

                                            <Field
                                                className="field field35"
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
                                                    "width": "35%"
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
                                                    "width": "25%"
                                                }}
                                                generateLabel={generateLabel}
                                            />

                                            <Field
                                                disabled={!values.series.publisher.name ||
                                                values.series.publisher.name.trim().length === 0}
                                                className="field field10"
                                                name="series.volume"
                                                label="Volume"
                                                type="number"
                                                component={TextField}
                                            />
                                            <br/>
                                            <Field
                                                className="field field35"
                                                name="number"
                                                label="Nummer"
                                                component={TextField}
                                            />
                                            <br/>

                                            <div className="field field35 fieldFileUpload addBtn">
                                                <Field
                                                    name="cover"
                                                    label="Cover"
                                                    component={SimpleFileUpload}
                                                    onChange={(e) => this.createPreview(e)}
                                                />
                                            </div>

                                            <Field
                                                type="text"
                                                name="format"
                                                label="Format"
                                                select
                                                component={TextField}
                                                className="field field35"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            >
                                                <MenuItem key="heft" value="Heft">
                                                    Heft
                                                </MenuItem>
                                                <MenuItem key="miniHeft" value="Mini Heft">
                                                    Mini Heft
                                                </MenuItem>
                                                <MenuItem key="magazin" value="Magazin">
                                                    Magazin
                                                </MenuItem>
                                                <MenuItem key="prestige" value="Prestige">
                                                    Prestige
                                                </MenuItem>
                                                <MenuItem key="softcover" value="Softcover">
                                                    Softcover
                                                </MenuItem>
                                                <MenuItem key="hardcover" value="Hardcover">
                                                    Hardcover
                                                </MenuItem>
                                                <MenuItem key="taschenbuch" value="Taschenbuch">
                                                    Taschenbuch
                                                </MenuItem>
                                                <MenuItem key="album" value="Album">
                                                    Album
                                                </MenuItem>
                                                <MenuItem key="albumHardcover" value="Album Hardcover">
                                                    Album Hardcover
                                                </MenuItem>
                                            </Field>
                                            <br/>
                                            <Field
                                                className="field field35"
                                                name="variant"
                                                label="Variante"
                                                component={TextField}
                                            />
                                            <br/>
                                            <Field
                                                className="field field35"
                                                name="limitation"
                                                label="Limitierung"
                                                type="number"
                                                component={TextField}
                                            />
                                            <br/>
                                            <Field
                                                className="field field35"
                                                name="pages"
                                                label="Seiten"
                                                type="number"
                                                component={TextField}
                                            />
                                            <br/>
                                            <Field
                                                className="field field35"
                                                name="releasedate"
                                                label="Erscheinungsdatum"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                component={TextField}
                                            />
                                            <br/>
                                            <Field
                                                className="field field25"
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
                                                className="field field10"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            >
                                                <MenuItem key="eur" value="EUR">
                                                    EUR
                                                </MenuItem>
                                                <MenuItem key="dem" value="DEM">
                                                    DEM
                                                </MenuItem>
                                            </Field>
                                            <br/>

                                            <Field
                                                className="field field35"
                                                name="addinfo"
                                                label="Weitere Informationen"
                                                multiline
                                                rows={10}
                                                component={TextField}
                                            />

                                            <br/>
                                            <br/>

                                            <div>
                                                <CardHeader className="left" title="Geschichten"/>
                                                <IconButton className="addBtn" aria-label="Hinzufügen"
                                                            onClick={() => {
                                                                let stories = values.stories;
                                                                stories.push({
                                                                    number: stories.length + 1,
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
                                                                    translator: {
                                                                        name: ''
                                                                    },
                                                                    title: '',
                                                                    addinfo: '',
                                                                    exclusive: false,
                                                                });
                                                                setFieldValue("stories", stories, true)
                                                            }}>
                                                    <AddIcon/>
                                                </IconButton>
                                            </div>

                                            <br />

                                            {values.stories.length === 0 ?
                                                <Typography className="noRelationsWarning">Hinzufügen mit '+'</Typography> :
                                                values.stories.map((item, index) => {
                                                    return (
                                                        <div key={index} className="storyAddContainer">
                                                            <IconButton className="removeBtn" aria-label="Entfernen"
                                                                        onClick={() => {
                                                                            let stories = values.stories.filter((e, i) => i !== index);
                                                                            setFieldValue("stories", stories, true)
                                                                        }}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                            <ExpansionPanel className="storyAddPanel" key={index} expanded={true}>
                                                                <ExpansionPanelSummary className="storyAdd">
                                                                    <Field
                                                                        className="field field3"
                                                                        name={"stories[" + index + "].number"}
                                                                        label="#"
                                                                        component={TextField}
                                                                    />

                                                                    {values.stories[index].exclusive ?
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
                                                                                    "width": "20%"
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
                                                                                    "width": "20%"
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
                                                                                    "width": "20%"
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
                                                                                    "width": "20%"
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
                                                                                    "width": "20%"
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
                                                                                    "width": "20%"
                                                                                }}
                                                                                generateLabel={(e) => e.name}
                                                                            />
                                                                        </React.Fragment> :
                                                                        <React.Fragment>
                                                                            <AutoComplete
                                                                                query={series}
                                                                                variables={{
                                                                                    publisher: values.stories[index].parent.issue.series.publisher.name === '' ?
                                                                                        {name: "*", us: true} :
                                                                                        {name: values.stories[index].parent.issue.series.publisher.name}
                                                                                }}
                                                                                name={"stories[" + index + "].parent.issue.series.title"}
                                                                                label="Serie"
                                                                                onChange={(value) => {
                                                                                    setFieldValue("stories[" + index + "].parent.issue.series", stripItem(value), true);
                                                                                }}
                                                                                style={{
                                                                                    "width": "25%"
                                                                                }}
                                                                                generateLabel={generateLabel}
                                                                            />

                                                                            <Field
                                                                                className="field field5"
                                                                                name={"stories[" + index + "].parent.issue.series.volume"}
                                                                                label="Volume"
                                                                                type="number"
                                                                                component={TextField}
                                                                            />

                                                                            <AutoComplete
                                                                                query={publishers}
                                                                                variables={{us: true}}
                                                                                name={"stories[" + index + "].parent.issue.series.publisher.name"}
                                                                                label="Verlag"
                                                                                onChange={(value) => {
                                                                                    setFieldValue("stories[" + index + "].parent.issue.series.publisher", stripItem(value), true);
                                                                                }}
                                                                                style={{
                                                                                    "width": "15%"
                                                                                }}
                                                                                generateLabel={generateLabel}
                                                                            />

                                                                            <Field
                                                                                className="field field10"
                                                                                name={"stories[" + index + "].parent.issue.number"}
                                                                                label="Nummer"
                                                                                component={TextField}
                                                                            />

                                                                            <Field
                                                                                className="field field10"
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
                                                                                    "width": "20%"
                                                                                }}
                                                                                generateLabel={(e) => e.name}
                                                                            />
                                                                        </React.Fragment>
                                                                    }

                                                                    <Field
                                                                        className="field field25"
                                                                        name={"stories[" + index + "].title"}
                                                                        label="Titel"
                                                                        component={TextField}
                                                                    />

                                                                    <Field
                                                                        className="field field25"
                                                                        name={"stories[" + index + "].addinfo"}
                                                                        label="Weitere Informationen"
                                                                        component={TextField}
                                                                    />

                                                                    <FormControlLabel
                                                                        className="exclusiveToggle"
                                                                        control={
                                                                            <Switch
                                                                                checked={values.stories[index].exclusive}
                                                                                onChange={() => {
                                                                                    setFieldValue("stories["+ index + "].exclusive", !values.stories[index].exclusive)
                                                                                }}
                                                                                value="exclusive"
                                                                            />
                                                                        }
                                                                        label="exklusiv"
                                                                    />
                                                                </ExpansionPanelSummary>
                                                            </ExpansionPanel>
                                                        </div>
                                                    );
                                                })
                                            }

                                            <br/>

                                            <div>
                                                <CardHeader className="left" title="Weitere Inhalte"/>
                                                <IconButton className="addBtn" aria-label="Hinzufügen"
                                                            onClick={() => {
                                                                let features = values.features;
                                                                features.push({
                                                                    number: features.length + 1,
                                                                    title: '',
                                                                    addinfo: '',
                                                                    writer: {
                                                                        name: ''
                                                                    },
                                                                    exclusive: false
                                                                });
                                                                setFieldValue("features", features, true)
                                                            }}>
                                                    <AddIcon/>
                                                </IconButton>
                                            </div>
                                            <br/>
                                            {values.features.length === 0 ?
                                                <Typography className="noRelationsWarning">Hinzufügen mit '+'</Typography> :
                                                values.features.map((item, index) => {
                                                    return (
                                                        <div key={index} className="storyAddContainer">
                                                            <IconButton className="removeBtn" aria-label="Entfernen"
                                                                        onClick={() => {
                                                                            let features = values.features.filter((e, i) => i !== index);
                                                                            setFieldValue("features", features, true)
                                                                        }}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                            <ExpansionPanel className="storyAddPanel" key={index} expanded={true}>
                                                                <ExpansionPanelSummary className="storyAdd">
                                                                    <Field
                                                                        className="field field3"
                                                                        name={"features[" + index + "].number"}
                                                                        label="#"
                                                                        component={TextField}
                                                                    />

                                                                    <Field
                                                                        className="field field35"
                                                                        name={"features[" + index + "].title"}
                                                                        label="Titel"
                                                                        component={TextField}
                                                                    />

                                                                    <Field
                                                                        className="field field25"
                                                                        name={"features[" + index + "].addinfo"}
                                                                        label="Weitere Informationen"
                                                                        component={TextField}
                                                                    />

                                                                    <AutoComplete
                                                                        id="writer"
                                                                        query={individuals}
                                                                        name={"features[" + index + "].writer.name"}
                                                                        label="Autor"
                                                                        onChange={(value) => {
                                                                            setFieldValue("features[" + index + "].writer", stripItem(value), true);
                                                                        }}
                                                                        style={{
                                                                            "width": "20%"
                                                                        }}
                                                                        generateLabel={(e) => e.name}
                                                                    />
                                                                </ExpansionPanelSummary>
                                                            </ExpansionPanel>
                                                        </div>
                                                    );
                                                })
                                            }

                                            <br/>

                                            <div>
                                                <CardHeader className="left" title="Covergalerie"/>
                                                <IconButton className="addBtn" aria-label="Hinzufügen"
                                                            onClick={() => {
                                                                let covers = values.covers;
                                                                covers.push({
                                                                    number: values.cover !== '' ? covers.length : covers.length+1,
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
                                                                });
                                                                setFieldValue("covers", covers, true)
                                                            }}>
                                                    <AddIcon/>
                                                </IconButton>
                                            </div>
                                            <br/>
                                            {values.covers.length === 0 ?
                                                <Typography className="noRelationsWarning">Hinzufügen mit '+'</Typography> :
                                                values.covers.map((item, index) => {
                                                    return (
                                                        <div key={index} className="storyAddContainer">
                                                            <IconButton disabled={values.covers[index].number === 0} className="removeBtn" aria-label="Entfernen"
                                                                        onClick={() => {
                                                                            let covers = values.covers.filter((e, i) => i !== index);
                                                                            setFieldValue("covers", covers, true)
                                                                        }}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                            <ExpansionPanel className="storyAddPanel" key={index} expanded={true}>
                                                                <ExpansionPanelSummary className="storyAdd">
                                                                    {
                                                                        values.covers[index].number === 0 ?
                                                                            <Field
                                                                                className="field field3"
                                                                                name={"covers[" + index + "].number"}
                                                                                label="#"
                                                                                disabled
                                                                                component={TextField}
                                                                            /> :
                                                                            <Field
                                                                                className="field field3"
                                                                                name={"covers[" + index + "].number"}
                                                                                label="#"
                                                                                component={TextField}
                                                                            />
                                                                    }

                                                                    {
                                                                        values.covers[index].exclusive ?
                                                                            <AutoComplete
                                                                                query={individuals}
                                                                                name={"covers[" + index + "].artist.name"}
                                                                                label="Artist"
                                                                                onChange={(value) => {
                                                                                    setFieldValue("covers[" + index + "].artist", stripItem(value), true);
                                                                                }}
                                                                                style={{
                                                                                    "width": "25%"
                                                                                }}
                                                                                generateLabel={(e) => e.name}
                                                                            /> :
                                                                            (<React.Fragment>
                                                                                <AutoComplete
                                                                                    query={series}
                                                                                    variables={{
                                                                                        publisher: values.covers[index].parent.issue.series.publisher.name === '' ?
                                                                                            {name: "*", us: true} :
                                                                                            {name: values.covers[index].parent.issue.series.publisher.name}
                                                                                    }}
                                                                                    name={"covers[" + index + "].parent.issue.series.title"}
                                                                                    label="Serie"
                                                                                    onChange={(value) => {
                                                                                        setFieldValue("covers[" + index + "].parent.issue.series", stripItem(value), true);
                                                                                    }}
                                                                                    style={{
                                                                                        "width": "25%"
                                                                                    }}
                                                                                    generateLabel={generateLabel}
                                                                                />

                                                                                <Field
                                                                                    className="field field5"
                                                                                    name={"covers[" + index + "].parent.issue.series.volume"}
                                                                                    label="Volume"
                                                                                    type="number"
                                                                                    component={TextField}
                                                                                />

                                                                                <Field
                                                                                    className="field field10"
                                                                                    name={"covers[" + index + "].parent.issue.number"}
                                                                                    label="Nummer"
                                                                                    component={TextField}
                                                                                />

                                                                                <Field
                                                                                    className="field field5"
                                                                                    name={"covers[" + index + "].parent.issue.variant"}
                                                                                    label="Variante"
                                                                                    component={TextField}
                                                                                />

                                                                                <AutoComplete
                                                                                    query={publishers}
                                                                                    variables={{us: true}}
                                                                                    name={"covers[" + index + "].parent.issue.series.publisher.name"}
                                                                                    label="Verlag"
                                                                                    onChange={(value) => {
                                                                                        setFieldValue("covers[" + index + "].parent.issue.series.publisher", stripItem(value), true);
                                                                                    }}
                                                                                    style={{
                                                                                        "width": "15%"
                                                                                    }}
                                                                                    generateLabel={generateLabel}
                                                                                />
                                                                            </React.Fragment>)
                                                                    }

                                                                    <Field
                                                                        className="field field25"
                                                                        name={"covers[" + index + "].addinfo"}
                                                                        label="Weitere Informationen"
                                                                        component={TextField}
                                                                    />

                                                                    <FormControlLabel
                                                                        className="exclusiveToggle"
                                                                        control={
                                                                            <Switch
                                                                                checked={values.covers[index].exclusive}
                                                                                onChange={() => {
                                                                                    setFieldValue("covers["+ index + "].exclusive", !values.covers[index].exclusive)
                                                                                }}
                                                                                value="exclusive"
                                                                            />
                                                                        }
                                                                        label="exklusiv"
                                                                    />
                                                                </ExpansionPanelSummary>
                                                            </ExpansionPanel>
                                                        </div>
                                                    );
                                                })
                                            }


                                            <br/>
                                            <br/>

                                            <div className="formButtons">
                                                <Button disabled={isSubmitting}
                                                        onClick={() => {
                                                            values = {
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
                                                                releasedate: '01-01-1900',
                                                                price: '',
                                                                currency: 'EUR',
                                                                addinfo: '',
                                                                stories: [],
                                                                features: [],
                                                                covers: []
                                                            };
                                                            resetForm();
                                                        }}
                                                        color="secondary">
                                                    Zurücksetzen
                                                </Button>

                                                <Button disabled={isSubmitting}
                                                        component={Link}
                                                        to={this.props.lastLocation ? this.props.lastLocation : "/"}
                                                        color="primary">
                                                    Abbrechen
                                                </Button>

                                                <Button
                                                    className="createButton"
                                                    disabled={isSubmitting}
                                                    onClick={submitForm}
                                                    color="primary">
                                                    Erstellen
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Form>
                                )
                            }}
                        </Formik>
                    )}
                </Mutation>
            </Layout>
        );
    }

    triggerCoverIsOpen() {
        this.setState({isCoverOpen: !this.state.isCoverOpen});
    }

    createPreview(file) {
        this.setState({
            cover: URL.createObjectURL(file),
            coverName: file.name
        });
    }
}

export default withContext(IssueCreate);