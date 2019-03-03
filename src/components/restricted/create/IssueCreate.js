import React from 'react'
import Layout from "../../Layout";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {Mutation} from "react-apollo";
import {createIssue} from "../../../graphql/mutations";
import {Field, Form, Formik} from 'formik';
import {SimpleFileUpload, TextField} from 'formik-material-ui';
import Button from "@material-ui/core/Button/Button";
import {issues, publishers, series} from "../../../graphql/queries";
import {generateLabel, generateUrl} from "../../../util/hierarchy";
import {IssueSchema} from "../../../util/yupSchema";
import {withContext} from "../../generic";
import AutoComplete from "../../generic/AutoComplete";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {Card} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function IssueCreate(props) {
    const {history, enqueueSnackbar, us} = props;

    return (
        <Layout>
            <Mutation mutation={createIssue}
                      update={(cache, result) => {
                          let data = cache.readQuery({
                              query: issues,
                              variables: result.data.createIssue.series
                          });

                          data.series.push(result.data.createIssue);
                          data.series.sort((a, b) => {
                              return (a.series.title.toLowerCase() + a.number)
                                  .localeCompare((b.series.title.toLowerCase() + b.number));
                          });

                          cache.writeQuery({
                              query: issues,
                              variables: result.data.createIssue.series,
                              data: data
                          });
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
                                volume: '',
                                publisher: {
                                    name: ''
                                }
                            },
                            number: '',
                            variant: '',
                            cover: '',
                            format: '',
                            limitation: '',
                            pages: '',
                            releasedate: '',
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

                            await createIssue({
                                variables: {
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
                                    limitation: values.limitation,
                                    pages: parseInt(values.pages),
                                    releasedate: values.releasedate,
                                    price: parseFloat(values.price),
                                    currency: values.currency,
                                    addinfo: values.addinfo
                                }
                            });

                            actions.setSubmitting(false);
                            if (error)
                                actions.resetForm();
                        }}>
                        {({resetForm, submitForm, isSubmitting, values, setFieldValue, touched, errors}) => {
                            return (
                                <Form>
                                    <CardHeader title="Ausgabe erstellen"/>

                                    <CardContent className="cardContent">
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
                                            error={touched.series && touched.series.publisher && errors.series && errors.series.publisher}
                                            onChange={(value) => {
                                                setFieldValue("series.publisher", value, true);
                                            }}
                                            width="35%"
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
                                            error={touched.series && errors.series}
                                            onChange={(value) => {
                                                setFieldValue("series", value, true);
                                            }}
                                            width="25%"
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
                                        <div className="field field35 fieldFileUpload">
                                            <Field
                                                name="cover"
                                                label="Cover"
                                                component={SimpleFileUpload}
                                            />

                                            <img alt="preview" src={createPreview(values.cover)}/>
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
                                            component={TextField}
                                        />
                                        <br/>
                                        <Field
                                            className="field field25"
                                            name="price"
                                            label="Preis"
                                            type="number"
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
                                        <br />

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
                                            <IconButton className="right" aria-label="Hinzufügen"
                                                        onClick={() => {
                                                            let stories = values.stories;
                                                            stories.push(stories.length);
                                                            setFieldValue("stories", stories, true)}}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <br/>
                                        <Card>
                                            <CardContent>
                                                {
                                                    values.stories.length === 0 ?
                                                        <Typography className="addWith">Hinzufügen mit '+'</Typography> :
                                                        null
                                                }
                                                {values.stories.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <Field
                                                                className="field field3"
                                                                name="sort"
                                                                label="#"
                                                                component={TextField}
                                                            />
                                                            <IconButton className="removeBtn" aria-label="Entfernen"
                                                                        onClick={() => {
                                                                            let stories = values.stories.filter((e) => e !== item);
                                                                            setFieldValue("stories", stories, true)}}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>

                                        <br/>

                                        <div>
                                            <CardHeader className="left" title="Weitere Inhalte"/>
                                            <IconButton className="right" aria-label="Hinzufügen"
                                                        onClick={() => {
                                                            let features = values.features;
                                                            features.push(features.length);
                                                            setFieldValue("features", features, true)}}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <br/>
                                        <Card>
                                            <CardContent>
                                                {
                                                    values.features.length === 0 ?
                                                        <Typography className="addWith">Hinzufügen mit '+'</Typography> :
                                                        null
                                                }
                                                {values.features.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <Field
                                                                className="field field3"
                                                                name="sort"
                                                                label="#"
                                                                component={TextField}
                                                            />

                                                            <Field
                                                                className="field field35"
                                                                name="titel"
                                                                label="Titel"
                                                                component={TextField}
                                                            />

                                                            <Field
                                                                className="field field25"
                                                                name="addinfo"
                                                                label="Weitere Informationen"
                                                                component={TextField}
                                                            />

                                                            <Field
                                                                className="field field15"
                                                                name="author"
                                                                label="Autor"
                                                                component={TextField}
                                                            />

                                                            <IconButton className="removeBtn" aria-label="Entfernen"
                                                                        onClick={() => {
                                                                            let features = values.features.filter((e) => e !== item);
                                                                            setFieldValue("features", features, true)}}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>

                                        <br/>

                                        <div>
                                            <CardHeader className="left" title="Covergalerie"/>
                                            <IconButton className="right" aria-label="Hinzufügen"
                                                        onClick={() => {
                                                            let covers = values.covers;
                                                            covers.push(covers.length);
                                                            setFieldValue("covers", covers, true)}}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <br/>
                                        <Card>
                                            <CardContent>
                                                {
                                                    values.covers.length === 0 ?
                                                        <Typography className="addWith">Hinzufügen mit '+'</Typography> :
                                                        null
                                                }
                                                {values.covers.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <Field
                                                                className="field field3"
                                                                name="sort"
                                                                label="#"
                                                                component={TextField}
                                                            />

                                                            <IconButton className="removeBtn" aria-label="Entfernen"
                                                                        onClick={() => {
                                                                            let covers = values.covers.filter((e) => e !== item);
                                                                            setFieldValue("covers", covers, true)}}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                        <br/>

                                        <Button disabled={isSubmitting}
                                                onClick={() => {
                                                    values = {
                                                        title: '',
                                                        series: {
                                                            title: values.series.title,
                                                            volume: values.series.volume,
                                                            publisher: {
                                                                name: values.series.publisher.name
                                                            }
                                                        },
                                                        number: '',
                                                        cover: '',
                                                        format: '',
                                                        variant: '',
                                                        limitation: '',
                                                        pages: '',
                                                        releasedate: '',
                                                        price: '',
                                                        currency: 'EUR',
                                                        addinfo: ''
                                                    };
                                                    resetForm();
                                                }}
                                                color="secondary">
                                            Zurücksetzen
                                        </Button>
                                        <Button
                                            disabled={isSubmitting}
                                            onClick={submitForm}
                                            color="primary">
                                            Erstellen
                                        </Button>
                                    </CardContent>
                                </Form>
                            )
                        }}
                    </Formik>
                )}
            </Mutation>
        </Layout>
    )
}

function createPreview(file) {
    if(file === '')
        return null;

    return URL.createObjectURL(file);
}

export default withContext(IssueCreate);