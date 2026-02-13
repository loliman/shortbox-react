import { IssueSchema } from "../../../util/yupSchema";
import { FastField, Form, Formik } from "formik";
import { TextField } from "../../generic/FormikTextField";
import React from "react";
import { Mutation } from "@apollo/client/react/components";
import { generateLabel, generateUrl } from "../../../util/hierarchy";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import withContext from "../../generic/withContext";
import CardHeader from "@mui/material/CardHeader";
import {
  apps,
  arcs,
  individuals,
  issue,
  issues,
  publishers,
  series,
} from "../../../graphql/queriesTyped";
import { decapitalize, stripItem, wrapItem } from "../../../util/util";
import AutocompleteField from "../../generic/AutocompleteField";
import { addToCache, removeFromCache, updateInCache } from "./Editor";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import TitleLine from "../../generic/TitleLine";
import { Cover, Covers, Stories, getPattern } from "./IssueEditorSections";
import type { DocumentNode } from "graphql";
import type { SelectedRoot } from "../../../types/domain";

export const formats = [
  "Heft",
  "Mini Heft",
  "Magazin",
  "Prestige",
  "Softcover",
  "Hardcover",
  "Taschenbuch",
  "Album",
  "Album Hardcover",
];
export const currencies = ["EUR", "DEM"];

interface IssueEditorFormValues {
  title: string;
  series: {
    title: string;
    volume: number | string;
    publisher: {
      name: string;
      us: boolean;
    };
  };
  number: string;
  variant: string;
  cover: unknown;
  format: string;
  limitation: number;
  pages: number;
  releasedate: string;
  price: string;
  currency: string;
  individuals: Array<Record<string, unknown>>;
  addinfo: string;
  comicguideid: number;
  isbn: string;
  arcs?: Array<Record<string, unknown>>;
  stories: Array<Record<string, unknown>>;
  features: Array<Record<string, unknown>>;
  covers: Array<Record<string, unknown>>;
}

interface IssueEditorProps {
  defaultValues?: IssueEditorFormValues;
  edit?: boolean;
  copy?: boolean;
  mutation: DocumentNode;
  id?: string | number;
  session?: unknown;
  desktop?: boolean;
  navigate: (event: unknown, url: string) => void;
  lastLocation?: { pathname: string } | null;
  enqueueSnackbar: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  selected?: SelectedRoot;
  [key: string]: unknown;
}

interface IssueEditorState {
  defaultValues: IssueEditorFormValues;
  header: string;
  submitLabel: string;
  submitAndCopyLabel: string;
  successMessage: string;
  errorMessage: string;
  copy: boolean;
}

class IssueEditor extends React.Component<IssueEditorProps, IssueEditorState> {
  constructor(props: IssueEditorProps) {
    super(props);

    let defaultValues = props.defaultValues;
    if (!defaultValues)
      defaultValues = {
        title: "",
        series: {
          title: "",
          volume: 0,
          publisher: {
            name: "",
            us: false,
          },
        },
        number: "",
        variant: "",
        cover: "",
        format: formats[0],
        limitation: 0,
        pages: 0,
        releasedate: "1900-01-01",
        price: "0",
        currency: currencies[0],
        individuals: [],
        addinfo: "",
        comicguideid: 0,
        isbn: "",
        arcs: [],
        stories: [],
        features: [],
        covers: [],
      };

    this.state = {
      defaultValues: defaultValues,
      header: props.edit
        ? generateLabel(defaultValues as unknown as SelectedRoot) + " bearbeiten"
        : props.copy
          ? generateLabel(defaultValues as unknown as SelectedRoot) + " kopieren"
          : "Ausgabe erstellen",
      submitLabel: "Fertig",
      submitAndCopyLabel: "Fertig und kopieren",
      successMessage: props.edit
        ? " erfolgreich gespeichert"
        : props.copy
          ? " erfolgreich kopiert"
          : " erfolgreich erstellt",
      errorMessage: props.edit
        ? generateLabel(defaultValues as unknown as SelectedRoot) +
          " konnte nicht gespeichert werden"
        : props.copy
          ? " konnte nicht kopiert werden"
          : "Ausgabe konnte nicht erstellt werden",
      copy: Boolean(props.copy),
    };
  }

  toogleUs = () => {
    let newDefaultValues = this.state.defaultValues;
    newDefaultValues.series.publisher.us = !newDefaultValues.series.publisher.us;
    this.setState({ defaultValues: newDefaultValues });
  };

  render() {
    const { lastLocation, navigate, enqueueSnackbar, edit, mutation } = this.props;
    const { defaultValues, header, submitLabel, submitAndCopyLabel, successMessage, errorMessage } =
      this.state;

    const mutationDefinition = mutation.definitions[0] as { name?: { value?: string } };
    let mutationName = decapitalize(mutationDefinition.name?.value || "");

    return (
      <Mutation
        mutation={mutation}
        update={(cache, result) => {
          let res = JSON.parse(JSON.stringify(result.data[mutationName]));

          if (edit) {
            let defVariables: { issue: Record<string, unknown> } = { issue: {} };
            const defSeries = stripItem(defaultValues.series) as {
              publisher?: { us?: boolean };
            } & Record<string, unknown>;
            defVariables.issue.series = defSeries;
            if (defSeries.publisher) {
              defSeries.publisher.us = undefined;
            }
            defVariables.issue.number = defaultValues.number;
            if (defaultValues.format !== "") defVariables.issue.format = defaultValues.format;
            if (defaultValues.variant !== "") defVariables.issue.variant = defaultValues.variant;

            res.series.publisher.us = false;

            try {
              updateInCache(cache, issue, defVariables, defVariables, wrapItem(res));
            } catch (e) {
              //ignore cache exception;
            }

            try {
              let variables = JSON.parse(JSON.stringify(defVariables.issue));
              variables.__typename = "Issue";
              removeFromCache(cache, issues, { series: defVariables.issue.series }, variables);
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
            let item: Record<string, unknown> = {};
            item.title = res.title;
            item.number = res.number;
            item.series = res.series;
            const itemSeries = item.series as { publisher?: { us?: boolean } };
            if (itemSeries.publisher) {
              itemSeries.publisher.us = undefined;
            }
            item.format = res.format;
            item.variant = res.variant;
            item.__typename = "Issue";
            addToCache(cache, issues, stripItem(wrapItem(res.series)), item);
          } catch (e) {
            //ignore cache exception;
          }
        }}
        onCompleted={(data) => {
          enqueueSnackbar(generateLabel(data[mutationName]) + successMessage, {
            variant: "success",
          });

          if (!this.state.copy)
            navigate(null, generateUrl(data[mutationName], data[mutationName].series.publisher.us));
          else {
            let selected = JSON.parse(JSON.stringify(data[mutationName]));
            selected.format = undefined;
            selected.variant = undefined;
            navigate(null, "/copy/issue" + generateUrl(selected, selected.series.publisher.us));
          }
        }}
        onError={(errors) => {
          let message =
            errors.graphQLErrors && errors.graphQLErrors.length > 0
              ? " [" + errors.graphQLErrors[0].message + "]"
              : "";
          enqueueSnackbar(errorMessage + message, { variant: "error" });
        }}
      >
        {(mutation, { error }) => (
          <Formik
            initialValues={defaultValues}
            validationSchema={IssueSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);

              let stories = values.stories.map((e) => {
                if (e.exclusive || values.series.publisher.us) e.parent = undefined;
                e.children = undefined;

                return e;
              });

              let covers = values.covers.map((e) => {
                if (e.exclusive || values.series.publisher.us) e.parent = undefined;
                e.children = undefined;

                return e;
              });

              const itemPayload = stripItem(values) as IssueEditorFormValues &
                Record<string, unknown>;
              itemPayload.cover = undefined;
              itemPayload.stories = stories;
              itemPayload.covers = covers;

              if (itemPayload.series.publisher.us) {
                itemPayload.format = undefined;
                itemPayload.limitation = undefined;
                itemPayload.pages = undefined;
                itemPayload.comicguideid = undefined;
                itemPayload.isbn = undefined;
                itemPayload.price = undefined;
                itemPayload.currency = undefined;
              }

              const variables: {
                item: IssueEditorFormValues & Record<string, unknown>;
                old?: Record<string, unknown>;
              } = {
                item: itemPayload,
              };

              if (edit) {
                variables.old = {};
                variables.old.series = stripItem(defaultValues.series);
                variables.old.number = defaultValues.number;
                variables.old.format = defaultValues.format;
                variables.old.variant = defaultValues.variant;
              }

              if (variables.item.publisher)
                variables.item.publisher = stripItem(
                  variables.item.publisher as Record<string, unknown>
                );
              if (variables.item.series)
                variables.item.series = stripItem(
                  variables.item.series as Record<string, unknown>
                ) as IssueEditorFormValues["series"];
              if (variables.item.individuals) {
                let i = [];

                variables.item.individuals.forEach((item: { name: string; type: string[] }) => {
                  if (!i[item.name]) {
                    i[item.name] = { name: item.name, type: [] };
                  }

                  i[item.name].type = item.type;
                });

                variables.item.individuals = i.map((x) => x);
              }
              if (variables.item.arcs)
                variables.item.arcs = variables.item.arcs.map((item) => stripItem(item));

              if (variables.item.stories)
                variables.item.stories = variables.item.stories.map(
                  (
                    story: Record<string, unknown> & {
                      series?: Record<string, unknown>;
                      individuals?: Array<{ name: string; type: string[] }>;
                      appearances?: Array<Record<string, unknown> & { type?: string }>;
                      parent?: { issue?: { series?: Record<string, unknown> } };
                    }
                  ) => {
                    if (story.series)
                      story.series = stripItem(story.series as Record<string, unknown>);
                    if (story.individuals) {
                      let i = [];

                      (story.individuals as Array<{ name: string; type: string[] }>).forEach(
                        (item) => {
                          if (!i[item.name]) {
                            i[item.name] = { name: item.name, type: [] };
                          }

                          i[item.name].type = item.type;
                        }
                      );

                      const storyIndividuals: Array<{ name: string; type: string[] }> = [];
                      for (let k in i) {
                        storyIndividuals.push(i[k]);
                      }
                      story.individuals = storyIndividuals;
                    }

                    if (story.appearances) {
                      story.appearances = (story.appearances as Array<Record<string, unknown>>).map(
                        (item) => stripItem(item)
                      );
                      (story.appearances as Array<{ type: string }>).forEach((a) => {
                        if (
                          a.type === "FEATURED" ||
                          a.type === "ANTAGONIST" ||
                          a.type === "SUPPORTING" ||
                          a.type === "OTHER"
                        )
                          a.type = "CHARACTER";
                      });
                    }

                    if (story.parent && story.parent.issue && story.parent.issue.series)
                      story.parent.issue.series = stripItem(
                        story.parent.issue.series as Record<string, unknown>
                      );
                    return story;
                  }
                );

              if (variables.item.features)
                variables.item.features = variables.item.features.map(
                  (feature: Record<string, unknown>) => {
                    if (feature.individuals) {
                      let i = [];

                      (feature.individuals as Array<{ name: string; type: string[] }>).forEach(
                        (item) => {
                          if (!i[item.name]) {
                            i[item.name] = { name: item.name, type: [] };
                          }

                          i[item.name].type = item.type;
                        }
                      );
                      feature.individuals = i.map((x) => x);
                    }

                    return feature;
                  }
                );

              if (variables.item.covers)
                variables.item.covers = variables.item.covers.map(
                  (
                    cover: Record<string, unknown> & {
                      series?: Record<string, unknown>;
                      individuals?: Array<{ name: string; type: string[] }>;
                      parent?: { issue?: { series?: Record<string, unknown> } };
                    }
                  ) => {
                    if (cover.series)
                      cover.series = stripItem(cover.series as Record<string, unknown>);

                    if (cover.individuals) {
                      let i = [];

                      (cover.individuals as Array<{ name: string; type: string[] }>).forEach(
                        (item) => {
                          if (!i[item.name]) {
                            i[item.name] = { name: item.name, type: [] };
                          }

                          i[item.name].type = item.type;
                        }
                      );
                      cover.individuals = i.map((x) => x);
                    }

                    if (cover.parent && cover.parent.issue && cover.parent.issue.series)
                      cover.parent.issue.series = stripItem(
                        cover.parent.issue.series as Record<string, unknown>
                      );
                    return cover;
                  }
                );

              await mutation({
                variables: variables,
              });

              actions.setSubmitting(false);
            }}
          >
            {({ values, resetForm, submitForm, isSubmitting, setFieldValue }) => (
              <Form>
                <CardHeader
                  title={
                    <TitleLine title={header} id={this.props.id} session={this.props.session} />
                  }
                  action={
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Tooltip
                          title={(values.series.publisher.us ? "Deutsche" : "US") + " Ausgabe"}
                        >
                          <Switch
                            disabled={edit}
                            checked={values.series.publisher.us}
                            onChange={() => {
                              this.toogleUs();
                              resetForm();
                            }}
                            color="secondary"
                          />
                        </Tooltip>
                      }
                      label="US"
                    />
                  }
                />

                <CardContent className="cardContent">
                  {this.props.desktop ? <Cover {...this.props} cover={values.cover} /> : null}

                  <FastField
                    className={this.props.desktop ? "field field35" : "field field100"}
                    name="title"
                    label="Titel"
                    component={TextField}
                  />
                  <br />

                  <AutocompleteField
                    query={publishers}
                    name="series.publisher.name"
                    label="Verlag"
                    variables={{
                      pattern: values.series.publisher.name,
                      us: defaultValues.series.publisher.us
                        ? defaultValues.series.publisher.us
                        : false,
                    }}
                    onChange={(option, live) => {
                      if (typeof option !== "string" || option.trim() !== "") {
                        if (live) {
                          setFieldValue("series.publisher.name", option);
                        } else {
                          setFieldValue("series", {
                            title: "",
                            volume: "",
                            publisher: { name: "", us: defaultValues.series.publisher.us },
                          });

                          if (option) setFieldValue("series.publisher", option);
                        }
                      }
                    }}
                    generateLabel={generateLabel}
                  />

                  <br />

                  <AutocompleteField
                    disabled={
                      !values.series.publisher.name ||
                      values.series.publisher.name.trim().length === 0
                    }
                    query={series}
                    variables={{
                      pattern: values.series.title,
                      publisher: { name: values.series.publisher.name },
                    }}
                    name="series.title"
                    label="Serie"
                    onChange={(option, live) => {
                      if (typeof option !== "string" || option.trim() !== "") {
                        if (live) {
                          setFieldValue("series.title", option);
                        } else {
                          setFieldValue(
                            "series",
                            option
                              ? {
                                  title: option.title,
                                  volume: option.volume,
                                  publisher: {
                                    name: values.series.publisher.name,
                                    us: values.series.publisher.us,
                                  },
                                }
                              : {
                                  title: "",
                                  volume: "",
                                  publisher: {
                                    name: values.series.publisher.name,
                                    us: values.series.publisher.us,
                                  },
                                }
                          );
                        }
                      }
                    }}
                    generateLabel={generateLabel}
                  />

                  <FastField
                    disabled={
                      !values.series.publisher.name ||
                      values.series.publisher.name.trim().length === 0
                    }
                    className={this.props.desktop ? "field field10" : "field field25"}
                    name="series.volume"
                    label="Volume"
                    type="number"
                    component={TextField}
                  />
                  <br />
                  <FastField
                    className={this.props.desktop ? "field field35" : "field field100"}
                    name="number"
                    label="Nummer"
                    component={TextField}
                  />
                  <br />

                  {!this.props.desktop ? (
                    <React.Fragment>
                      <br />
                      <Cover {...this.props} cover={values.cover} />
                    </React.Fragment>
                  ) : null}

                  {!values.series.publisher.us ? (
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
                        {formats.map((e) => (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        ))}
                      </FastField>
                      <br />
                    </React.Fragment>
                  ) : null}

                  <FastField
                    className={this.props.desktop ? "field field35" : "field field100"}
                    name="variant"
                    label="Variante"
                    component={TextField}
                  />
                  <br />

                  {!values.series.publisher.us ? (
                    <React.Fragment>
                      <FastField
                        className={this.props.desktop ? "field field35" : "field field100"}
                        name="limitation"
                        label="Limitierung"
                        type="number"
                        component={TextField}
                      />
                      <br />
                      <FastField
                        className={this.props.desktop ? "field field35" : "field field100"}
                        name="pages"
                        label="Seiten"
                        type="number"
                        component={TextField}
                      />
                      <br />
                    </React.Fragment>
                  ) : null}

                  {!values.series.publisher.us ? (
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
                          shrink: true,
                        }}
                      >
                        {currencies.map((e) => (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        ))}
                      </FastField>
                      <br />

                      <FastField
                        className={this.props.desktop ? "field field35" : "field field100"}
                        name="releasedate"
                        label="Erscheinungsdatum"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        component={TextField}
                      />
                      <br />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <FastField
                        className={this.props.desktop ? "field field35" : "field field100"}
                        name="releasedate"
                        label="Erscheinungsdatum"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        component={TextField}
                      />
                      <br />

                      <AutocompleteField
                        query={individuals}
                        name="individuals"
                        type="EDITOR"
                        nameField="name"
                        label="Verleger"
                        multiple
                        allowCreate
                        variables={{ pattern: getPattern(values.individuals, "name") }}
                        onChange={(option) => setFieldValue("individuals", option)}
                        generateLabel={(e) => e.name}
                      />

                      <AutocompleteField
                        query={arcs}
                        name="arcs"
                        type="EVENT"
                        nameField="title"
                        label="Event"
                        multiple
                        allowCreate
                        variables={{ pattern: getPattern(values.arcs, "title"), type: "EVENT" }}
                        onChange={(option) => setFieldValue("arcs", option)}
                        generateLabel={(e) => e.title}
                      />

                      <AutocompleteField
                        query={arcs}
                        name="arcs"
                        type="STORYARC"
                        nameField="title"
                        label="Arc"
                        multiple
                        allowCreate
                        variables={{ pattern: getPattern(values.arcs, "title"), type: "STORYARC" }}
                        onChange={(option) => setFieldValue("arcs", option)}
                        generateLabel={(e) => e.title}
                      />

                      <AutocompleteField
                        query={arcs}
                        name="arcs"
                        type="STORYLINE"
                        nameField="title"
                        label="Storyline"
                        multiple
                        allowCreate
                        variables={{ pattern: getPattern(values.arcs, "title"), type: "STORYLINE" }}
                        onChange={(option) => setFieldValue("arcs", option)}
                        generateLabel={(e) => e.title}
                      />
                    </React.Fragment>
                  )}

                  {!values.series.publisher.us ? (
                    <React.Fragment>
                      <FastField
                        className={this.props.desktop ? "field field35" : "field field100"}
                        name="comicguideid"
                        label="Comicguide ID"
                        type="number"
                        component={TextField}
                      />
                    </React.Fragment>
                  ) : null}

                  {!values.series.publisher.us ? (
                    <React.Fragment>
                      <br />
                      <FastField
                        className={this.props.desktop ? "field field35" : "field field100"}
                        name="isbn"
                        label="ISBN"
                        type="string"
                        component={TextField}
                      />
                    </React.Fragment>
                  ) : null}

                  <br />

                  <FastField
                    className={this.props.desktop ? "field field35" : "field field100"}
                    name="addinfo"
                    label="Weitere Informationen"
                    multiline
                    rows={10}
                    component={TextField}
                  />

                  <br />
                  <br />

                  <Stories
                    setFieldValue={setFieldValue}
                    items={values.stories}
                    {...this.props}
                    values={values}
                    us={values.series.publisher.us}
                  />

                  <br />

                  <Covers
                    setFieldValue={setFieldValue}
                    items={values.covers}
                    {...this.props}
                    us={values.series.publisher.us}
                    values={values}
                  />

                  <br />

                  <div className="formButtons">
                    <Button
                      disabled={isSubmitting}
                      onMouseDown={(e) => {
                        values = defaultValues;
                        resetForm();
                      }}
                      color="secondary"
                    >
                      Zurücksetzen
                    </Button>

                    <Button
                      disabled={isSubmitting}
                      onMouseDown={(e) => {
                        if (this.state.copy) {
                          this.props.navigate(
                            e,
                            generateUrl(this.props.selected, this.props.selected.us)
                          );
                        } else {
                          this.props.navigate(e, lastLocation ? lastLocation.pathname : "/");
                        }
                      }}
                      color="primary"
                    >
                      Abbrechen
                    </Button>

                    <div className={"createButton"}>
                      <Button
                        disabled={isSubmitting}
                        onClick={() => {
                          this.setState({ copy: false });
                          submitForm();
                        }}
                        color="primary"
                      >
                        {submitLabel}
                      </Button>

                      <Button
                        value={"createAndCopy"}
                        disabled={isSubmitting}
                        onClick={() => {
                          this.setState({ copy: true });
                          submitForm();
                        }}
                        color="primary"
                      >
                        {submitAndCopyLabel}
                      </Button>
                    </div>
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

export { getPattern, updateField } from "./IssueEditorSections";
export default withContext(IssueEditor);
