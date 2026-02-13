import Layout from "./Layout";
import React from "react";
import { withContext } from "./generic";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { FastField, Form, Formik } from "formik";
import AutocompleteField from "./generic/AutocompleteField";
import Button from "@mui/material/Button";
import { individuals, publishers, series } from "../graphql/queriesTyped";
import { stripItem } from "../util/util";
import { generateLabel } from "../util/hierarchy";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { TextField } from "./generic/FormikTextField";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { getPattern, updateField } from "./restricted/editor/IssueEditor";

type FilterFormatOption = { name: string };
type FilterDateOption = { date: string; compare: string };
type FilterNumberOption = { number: string; compare: string; variant: string };

interface FilterValues {
  formats: FilterFormatOption[];
  withVariants: boolean;
  releasedates: FilterDateOption[];
  publishers: Array<Record<string, unknown>>;
  series: Array<Record<string, unknown>>;
  numbers: FilterNumberOption[];
  arcs: string;
  individuals: Array<Record<string, unknown>>;
  appearances: string;
  firstPrint: boolean;
  onlyPrint: boolean;
  onlyTb: boolean;
  exclusive: boolean;
  reprint: boolean;
  otherOnlyTb: boolean;
  onlyOnePrint: boolean;
  noPrint: boolean;
  onlyCollected: boolean;
  onlyNotCollected: boolean;
  sellable: boolean;
  noCover: boolean;
  noContent: boolean;
  and: boolean;
}

interface FilterSubmitValues {
  formats?: string[];
  withVariants?: boolean;
  releasedates?: FilterDateOption[];
  publishers?: Array<Record<string, unknown>>;
  series?: Array<Record<string, unknown>>;
  numbers?: FilterNumberOption[];
  arcs?: string;
  individuals?: Array<Record<string, unknown>>;
  appearances?: string;
  firstPrint?: boolean;
  onlyPrint?: boolean;
  onlyTb?: boolean;
  exclusive?: boolean;
  reprint?: boolean;
  otherOnlyTb?: boolean;
  onlyOnePrint?: boolean;
  noPrint?: boolean;
  onlyCollected?: boolean;
  onlyNotCollected?: boolean;
  sellable?: boolean;
  noCover?: boolean;
  noContent?: boolean;
  and?: boolean;
  us?: boolean;
}

function Filter(props) {
  const { lastLocation, us } = props;

  let defaultValues;
  if (props.query && props.query.filter) {
    try {
      defaultValues = JSON.parse(props.query.filter);
    } catch (e) {
      //
    }
  }

  if (!defaultValues)
    defaultValues = {
      formats: [],
      withVariants: false,
      releasedates: [{ date: "1900-01-01", compare: ">" }],
      publishers: [],
      series: [],
      numbers: [{ number: "", compare: ">", variant: "" }],
      arcs: "",
      individuals: [],
      appearances: "",
      firstPrint: false,
      onlyPrint: false,
      onlyTb: false,
      exclusive: false,
      reprint: false,
      otherOnlyTb: false,
      onlyOnePrint: false,
      noPrint: false,
      onlyCollected: false,
      onlyNotCollected: false,
      sellable: false,
      noCover: false,
      noContent: false,
      and: false,
    };
  else {
    if (!defaultValues.formats) defaultValues.formats = [];
    else {
      let formats = [];
      defaultValues.formats.forEach((f) => {
        formats.push({ name: f });
      });
      defaultValues.formats = formats;
    }
    if (!defaultValues.withVariants) defaultValues.withVariants = false;
    if (!defaultValues.releasedates)
      defaultValues.releasedates = [{ date: "1900-01-01", compare: ">" }];
    if (!defaultValues.publishers) defaultValues.publishers = [];
    if (!defaultValues.series) defaultValues.series = [];
    else {
      defaultValues.series.forEach((s) => {
        s.__typename = "Series";
      });
    }
    if (!defaultValues.numbers) defaultValues.numbers = [{ number: "", compare: ">", variant: "" }];
    if (!defaultValues.arcs) defaultValues.arcs = "";
    if (!defaultValues.individuals) defaultValues.individuals = [];
    if (!defaultValues.appearances) defaultValues.appearances = "";
    if (!defaultValues.firstPrint) defaultValues.firstPrint = false;
    if (!defaultValues.onlyPrint) defaultValues.onlyPrint = false;
    if (!defaultValues.onlyTb) defaultValues.onlyTb = false;
    if (!defaultValues.exclusive) defaultValues.exclusive = false;
    if (!defaultValues.reprint) defaultValues.reprint = false;
    if (!defaultValues.otherOnlyTb) defaultValues.otherOnlyTb = false;
    if (!defaultValues.noPrint) defaultValues.noPrint = false;
    if (!defaultValues.onlyOnePrint) defaultValues.onlyOnePrint = false;
    if (!defaultValues.onlyCollected) defaultValues.onlyCollected = false;
    if (!defaultValues.onlyNotCollected) defaultValues.onlyNotCollected = false;
    if (!defaultValues.sellable) defaultValues.sellable = false;
    if (!defaultValues.noCover) defaultValues.noCover = false;
    if (!defaultValues.noContent) defaultValues.noContent = false;
    if (!defaultValues.and) defaultValues.and = false;
  }

  return (
    <Layout>
      <Formik
        initialValues={defaultValues}
        onSubmit={async (values: FilterValues, actions) => {
          actions.setSubmitting(true);

          let v: FilterSubmitValues = {};
          if (values.formats.length > 0) {
            v.formats = [];
            values.formats.forEach((o) => v.formats.push(o.name));
          }
          if (values.withVariants) v.withVariants = true;
          if (values.releasedates.length > 0) {
            v.releasedates = [];
            values.releasedates.forEach((o) => {
              if (o.date.trim() !== "1900-01-01") v.releasedates.push(o);
            });
            if (v.releasedates.length === 0) v.releasedates = undefined;
          }
          if (values.publishers.length > 0) {
            v.publishers = [];
            values.publishers.forEach((o) => {
              let p = stripItem(o);
              p.us = undefined;
              v.publishers.push(p);
            });
          }
          if (values.series.length > 0) {
            v.series = [];
            values.series.forEach((o) => {
              v.series.push(stripItem(o));
            });
          }
          if (values.numbers.length > 0) {
            v.numbers = [];
            values.numbers.forEach((o) => {
              if (o.number.trim() !== "") v.numbers.push(o);
            });
            if (v.numbers.length === 0) v.numbers = undefined;
          }
          if (values.arcs) {
            v.arcs = values.arcs;
          }

          if (values.individuals.length > 0) {
            v.individuals = [];
            values.individuals.forEach((o) => {
              let item = stripItem(o);
              item.role = undefined;
              v.individuals.push(item);
            });
          }
          if (values.appearances) {
            v.appearances = values.appearances;
          }
          if (values.firstPrint) v.firstPrint = true;
          if (values.onlyPrint) v.onlyPrint = true;
          if (values.onlyTb) v.onlyTb = true;
          if (values.exclusive) v.exclusive = true;
          if (values.reprint) v.reprint = true;
          if (values.otherOnlyTb) v.otherOnlyTb = true;
          if (values.noPrint) v.noPrint = true;
          if (values.onlyOnePrint) v.onlyOnePrint = true;
          if (values.onlyCollected) v.onlyCollected = true;
          if (values.onlyNotCollected) v.onlyNotCollected = true;
          if (values.sellable) v.sellable = true;
          if (values.noCover) v.noCover = true;
          if (values.noContent) v.noContent = true;
          if (values.and) v.and = true;

          if (JSON.stringify(v) !== "{}") {
            v.us = us;
          }

          let url = lastLocation ? lastLocation.pathname : "/" + (props.us ? "us" : "de");
          props.navigate(null, url, {
            filter: JSON.stringify(v) !== "{}" ? JSON.stringify(v) : null,
          });

          actions.setSubmitting(false);
        }}
      >
        {({ values, resetForm, submitForm, isSubmitting, setFieldValue }) => {
          return (
            <Form>
              <CardHeader title="Filter" />

              <CardContent className="cardContent">
                <Typography variant="h6">Details</Typography>

                <AutocompleteField
                  values={[
                    { name: "Heft" },
                    { name: "Mini Heft" },
                    { name: "Magazin" },
                    { name: "Prestige" },
                    { name: "Softcover" },
                    { name: "Hardcover" },
                    { name: "Taschenbuch" },
                    { name: "Album" },
                    { name: "Album Hardcover" },
                  ]}
                  nameField="name"
                  name={"formats"}
                  label="Format"
                  multiple
                  onChange={(option) => setFieldValue("formats", option)}
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
                      color="secondary"
                    />
                  }
                  label="Mit Varianten"
                />

                <br />

                {values.releasedates.map((n, i) => {
                  return (
                    <React.Fragment key={i}>
                      <FastField
                        className={props.desktop ? "field field352" : "field field90"}
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
                        className={"field field5"}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        {[">", "<", "=", ">=", "<="].map((e) => (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        ))}
                      </FastField>

                      {i === values.releasedates.length - 1 ? (
                        <IconButton
                          className="addBtnFilter"
                          aria-label="Hinzufügen"
                          onMouseDown={(e) => {
                            let o = JSON.parse(JSON.stringify(values.releasedates));
                            o.push({ date: "1900-01-01", compare: ">" });
                            setFieldValue("releasedates", o);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      ) : null}

                      <br />
                    </React.Fragment>
                  );
                })}

                <br />

                <FormControlLabel
                  className="switchEditor"
                  control={
                    <Switch
                      checked={values.and}
                      onChange={() => {
                        setFieldValue("and", !values.and);
                      }}
                      color="secondary"
                    />
                  }
                  label="Alle Kriterien müssen erfüllt sein"
                />

                <FormControlLabel
                  className="switchEditor"
                  control={
                    <Switch
                      checked={values.noCover}
                      onChange={() => {
                        setFieldValue("noCover", !values.noCover);
                      }}
                      color="secondary"
                    />
                  }
                  label="Ohne Cover"
                />

                <FormControlLabel
                  className="switchEditor"
                  control={
                    <Switch
                      checked={values.noContent}
                      onChange={() => {
                        setFieldValue("noContent", !values.noContent);
                      }}
                      color="secondary"
                    />
                  }
                  label="Ohne Inhalt"
                />

                {props.session ? (
                  <React.Fragment>
                    {" "}
                    <br />
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.onlyCollected}
                          onChange={() => {
                            setFieldValue("onlyCollected", !values.onlyCollected);
                          }}
                          color="secondary"
                        />
                      }
                      label="Nur in Sammlung"
                    />
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.onlyNotCollected}
                          onChange={() => {
                            setFieldValue("onlyNotCollected", !values.onlyNotCollected);
                          }}
                          color="secondary"
                        />
                      }
                      label="Nur nicht in Sammlung"
                    />{" "}
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.sellable}
                          onChange={() => {
                            setFieldValue("sellable", !values.sellable);
                          }}
                          color="secondary"
                        />
                      }
                      label="Verkaufbar"
                    />
                  </React.Fragment>
                ) : null}

                <br />
                <br />
                <br />

                <Typography variant="h6">{us ? "Enthalten in" : "Enthält"}</Typography>

                {!us ? (
                  <React.Fragment>
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.onlyPrint}
                          onChange={() => {
                            setFieldValue("onlyPrint", !values.onlyPrint);
                          }}
                          color="secondary"
                        />
                      }
                      label="Einzige Veröffentlichung"
                    />

                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.firstPrint}
                          onChange={() => {
                            setFieldValue("firstPrint", !values.firstPrint);
                          }}
                          color="secondary"
                        />
                      }
                      label="Erstveröffentlichung"
                    />

                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.otherOnlyTb}
                          onChange={() => {
                            setFieldValue("otherOnlyTb", !values.otherOnlyTb);
                          }}
                          color="secondary"
                        />
                      }
                      label="Sonst nur in Taschenbuch"
                    />

                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.exclusive}
                          onChange={() => {
                            setFieldValue("exclusive", !values.exclusive);
                          }}
                          color="secondary"
                        />
                      }
                      label="Exklusiver Inhalt"
                    />

                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.reprint}
                          onChange={() => {
                            setFieldValue("reprint", !values.reprint);
                          }}
                          color="secondary"
                        />
                      }
                      label="Reiner Nachdruck"
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.onlyTb}
                          onChange={() => {
                            setFieldValue("onlyTb", !values.onlyTb);
                          }}
                          color="secondary"
                        />
                      }
                      label="Nur in Taschenbuch"
                    />

                    <FormControlLabel
                      className="switchEditor"
                      control={
                        <Switch
                          checked={values.onlyOnePrint}
                          onChange={() => {
                            setFieldValue("onlyOnePrint", !values.onlyOnePrint);
                          }}
                          color="secondary"
                        />
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
                          color="secondary"
                        />
                      }
                      label="Nicht auf deutsch erschienen"
                    />
                  </React.Fragment>
                )}

                {
                  <React.Fragment>
                    <br />

                    <AutocompleteField
                      query={publishers}
                      name={"publishers"}
                      nameField="name"
                      label="Verlag"
                      multiple
                      variables={{ pattern: getPattern(values.publishers, "name"), us: !us }}
                      onChange={(option, live) =>
                        updateField(
                          option,
                          live,
                          values.publishers,
                          setFieldValue,
                          "publishers",
                          "name"
                        )
                      }
                      generateLabel={(e) => e.name}
                    />

                    <br />

                    <AutocompleteField
                      query={series}
                      name={"series"}
                      nameField="title"
                      label="Serie"
                      multiple
                      variables={{
                        pattern: getPattern(values.series, "title"),
                        publisher: { name: "*", us: !us },
                      }}
                      onChange={(option, live) =>
                        updateField(option, live, values.series, setFieldValue, "series", "title")
                      }
                      generateLabel={generateLabel}
                    />

                    <br />

                    {values.numbers.map((n, i) => {
                      return (
                        <React.Fragment key={i}>
                          <FastField
                            className={props.desktop ? "field field352" : "field field90"}
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
                            className={"field field5"}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          >
                            {[">", "<", "=", ">=", "<="].map((e) => (
                              <MenuItem key={e} value={e}>
                                {e}
                              </MenuItem>
                            ))}
                          </FastField>

                          {i === values.numbers.length - 1 ? (
                            <IconButton
                              className="addBtnFilter"
                              aria-label="Hinzufügen"
                              onMouseDown={(e) => {
                                let o = JSON.parse(JSON.stringify(values.numbers));
                                o.push({
                                  number: "",
                                  compare: ">",
                                  variant: "",
                                });
                                setFieldValue("numbers", o);
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          ) : null}

                          <br />
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                }

                <br />
                <br />
                <br />

                {
                  <React.Fragment>
                    <Typography variant="h6">Mitwirkende</Typography>

                    <AutocompleteField
                      query={individuals}
                      name={"individuals"}
                      nameField="name"
                      type="WRITER"
                      label="Autor"
                      multiple
                      variables={{ pattern: getPattern(values.individuals, "name") }}
                      onChange={(option, live) =>
                        updateField(
                          option,
                          live,
                          values.individuals,
                          setFieldValue,
                          "individuals",
                          "name"
                        )
                      }
                      generateLabel={(e) => e.name}
                    />

                    <AutocompleteField
                      query={individuals}
                      name={"individuals"}
                      nameField="name"
                      type={"PENCILER"}
                      label="Zeichner"
                      multiple
                      variables={{ pattern: getPattern(values.individuals, "name") }}
                      onChange={(option, live) =>
                        updateField(
                          option,
                          live,
                          values.individuals,
                          setFieldValue,
                          "individuals",
                          "name"
                        )
                      }
                      generateLabel={(e) => e.name}
                    />

                    <br />

                    <React.Fragment>
                      <AutocompleteField
                        query={individuals}
                        name={"individuals"}
                        type={"INKER"}
                        nameField="name"
                        label="Inker"
                        multiple
                        variables={{ pattern: getPattern(values.individuals, "name") }}
                        onChange={(option, live) =>
                          updateField(
                            option,
                            live,
                            values.individuals,
                            setFieldValue,
                            "individuals",
                            "name"
                          )
                        }
                        generateLabel={(e) => e.name}
                      />

                      <AutocompleteField
                        query={individuals}
                        name={"individuals"}
                        type={"COLORIST"}
                        nameField="name"
                        label="Kolorist"
                        multiple
                        variables={{ pattern: getPattern(values.individuals, "name") }}
                        onChange={(option, live) =>
                          updateField(
                            option,
                            live,
                            values.individuals,
                            setFieldValue,
                            "individuals",
                            "name"
                          )
                        }
                        generateLabel={(e) => e.name}
                      />

                      <br />

                      <AutocompleteField
                        query={individuals}
                        name={"individuals"}
                        type={"LETTERER"}
                        nameField="name"
                        label="Letterer"
                        multiple
                        variables={{ pattern: getPattern(values.individuals, "name") }}
                        onChange={(option, live) =>
                          updateField(
                            option,
                            live,
                            values.individuals,
                            setFieldValue,
                            "individuals",
                            "name"
                          )
                        }
                        generateLabel={(e) => e.name}
                      />

                      <AutocompleteField
                        query={individuals}
                        name={"individuals"}
                        type={"EDITOR"}
                        nameField="name"
                        label="Editor"
                        multiple
                        variables={{ pattern: getPattern(values.individuals, "name") }}
                        onChange={(option, live) =>
                          updateField(
                            option,
                            live,
                            values.individuals,
                            setFieldValue,
                            "individuals",
                            "name"
                          )
                        }
                        generateLabel={(e) => e.name}
                      />
                    </React.Fragment>

                    {!us ? (
                      <React.Fragment>
                        <br />

                        <AutocompleteField
                          query={individuals}
                          name={"individuals"}
                          type={"TRANSLATOR"}
                          nameField="name"
                          label="Übersetzer"
                          multiple
                          variables={{ pattern: getPattern(values.individuals, "name") }}
                          onChange={(option, live) =>
                            updateField(
                              option,
                              live,
                              values.individuals,
                              setFieldValue,
                              "individuals",
                              "name"
                            )
                          }
                          generateLabel={(e) => e.name}
                        />
                      </React.Fragment>
                    ) : null}

                    <br />
                    <br />
                    <br />
                    <br />
                  </React.Fragment>
                }

                <Typography variant="h6">Inhalt</Typography>

                <FastField
                  className={props.desktop ? "field field40" : "field field90"}
                  name={"arcs"}
                  label="Teil von (Event, Story Arc, Story Line)"
                  component={TextField}
                />

                <br />

                <FastField
                  className={props.desktop ? "field field40" : "field field90"}
                  name={"appearances"}
                  label="Auftritte (Personen, Gegenstände, Orte, ...)"
                  component={TextField}
                />

                <br />
                <br />
                <br />
                <br />

                <div className="formButtons">
                  <Button
                    disabled={isSubmitting}
                    onMouseDown={(e) => {
                      resetForm({
                        values: {
                          formats: [],
                          withVariants: false,
                          releasedates: [{ date: "1900-01-01", compare: ">" }],
                          publishers: [],
                          series: [],
                          numbers: [{ number: "", compare: ">", variant: "" }],
                          arcs: "",
                          individuals: [],
                          appearances: "",
                          firstPrint: false,
                          onlyPrint: false,
                          onlyTb: false,
                          exclusive: false,
                          reprint: false,
                          otherOnlyTb: false,
                          noPrint: false,
                          onlyOnePrint: false,
                          onlyCollected: false,
                          onlyNotCollected: false,
                          sellable: false,
                          noCover: false,
                          noContent: false,
                          and: false,
                        },
                      });
                    }}
                    color="secondary"
                  >
                    Zurücksetzen
                  </Button>

                  <Button disabled={isSubmitting} onMouseDown={(e) => submitForm()} color="primary">
                    Abbrechen
                  </Button>

                  <Button
                    className="createButton"
                    disabled={isSubmitting}
                    onClick={submitForm}
                    color="primary"
                  >
                    Filtern
                  </Button>
                </div>
              </CardContent>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
}

export default withContext(Filter);
