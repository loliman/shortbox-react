import React from "react";
import { FastField } from "formik";
import { TextField } from "../../generic/FormikTextField";
import AutocompleteField from "../../generic/AutocompleteField";
import { apps, individuals, series } from "../../../graphql/queriesTyped";
import { generateLabel } from "../../../util/hierarchy";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getPattern, updateField } from "./IssueEditorHelpers";

export { getPattern, updateField };

type CoverInput = File | { __typename?: string; url?: string } | string | null | undefined;

interface CoverProps {
  desktop?: boolean;
  cover?: CoverInput;
  onDelete?: () => void;
}

interface CoverState {
  isCoverOpen: boolean;
}

export class Cover extends React.Component<CoverProps, CoverState> {
  constructor(props) {
    super(props);

    this.state = { isCoverOpen: false };
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
          onMouseDown={(e) => this.triggerCoverIsOpen()}
        />

        <Dialog
          open={this.state.isCoverOpen}
          onClose={() => this.triggerCoverIsOpen()}
          maxWidth="md"
        >
          <img
            src={this.createPreview(this.props.cover)}
            alt="Cover Vorschau"
          />
        </Dialog>

        {this.props.onDelete ? (
          <IconButton
            className="removeBtnCover"
            aria-label="Entfernen"
            onMouseDown={(e) => {
              this.props.onDelete();
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null}
      </div>
    );
  }

  triggerCoverIsOpen() {
    this.setState({ isCoverOpen: !this.state.isCoverOpen });
  }

  createPreview(file: CoverInput) {
    if (!file || file === "") return "/nocover.jpg";
    else if (typeof file === "object" && "__typename" in file && file.__typename === "Cover")
      return file.url;
    else if (typeof file === "string") return file;
    else return URL.createObjectURL(file as Blob);
  }
}

export function Stories(props) {
  return (
    <React.Fragment>
      <div>
        <CardHeader className="left" title="Geschichten" />
        <AddContainsButton type="stories" default={storyDefault} {...props} />
      </div>

      <br />

      <Contains {...props} type="stories" default={storyDefault} fields={<StoryFields />} />
    </React.Fragment>
  );
}

function StoryFields(props) {
  let extended =
    props.items[props.index].exclusive || props.us ? (
      <StoryFieldsExclusive {...props} />
    ) : (
      <StoryFieldsNonExclusive {...props} />
    );

  return (
    <React.Fragment>
      <div className="storyAddInputContainer">
        <span
        >
          {props.items[props.index].parent ? props.items[props.index].parent.title : ""}
        </span>

        <br />

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

        {!props.us ? <ExclusiveToggle {...props} /> : null}
      </div>

      {extended}
    </React.Fragment>
  );
}

function generateSeriesLabelWithYears(series) {
  return generateLabel(series);
}

function StoryFieldsNonExclusive(props) {
  const { index, setFieldValue, values } = props;

  return (
    <div className="storyAddInputContainer">
      <AutocompleteField
        query={series}
        name={"stories[" + index + "].parent.issue.series"}
        nameField="title"
        label="Serie"
        allowCreate
        variables={{
          pattern: values.stories[index].parent.issue.series.title,
          publisher: { name: "*", us: true },
        }}
        onChange={(option, live) => {
          if (typeof option !== "string" || option.trim() !== "") {
            if (live) {
              setFieldValue("stories[" + index + "].parent.issue.series.title", option);
            } else {
              if (option && !option.volume) option.volume = 0;

              setFieldValue(
                "stories[" + index + "].parent.issue.series",
                option ? option : { title: "", volume: 0 }
              );
            }
          }
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

      <AutocompleteField
        query={individuals}
        name={"stories[" + index + "].individuals"}
        type={"TRANSLATOR"}
        nameField="name"
        label="Übersetzer"
        disabled={props.disabled}
        multiple
        allowCreate
        variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
        onChange={(option, live) =>
          updateField(
            option,
            live,
            values.stories[index].individuals,
            setFieldValue,
            "stories[" + index + "].individuals",
            "name"
          )
        }
        generateLabel={(e) => e.name}
      />
    </div>
  );
}

function StoryFieldsExclusive(props) {
  const { index, setFieldValue, values } = props;

  return (
    <React.Fragment>
      <div className="storyAddInputContainer">
        <AutocompleteField
          query={individuals}
          name={"stories[" + index + "].individuals"}
          type={"WRITER"}
          nameField="name"
          label="Autor"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].individuals,
              setFieldValue,
              "stories[" + index + "].individuals",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />
        <AutocompleteField
          query={individuals}
          name={"stories[" + index + "].individuals"}
          type={"PENCILER"}
          nameField="name"
          label="Zeichner"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].individuals,
              setFieldValue,
              "stories[" + index + "].individuals",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />
        <AutocompleteField
          query={individuals}
          name={"stories[" + index + "].individuals"}
          type={"INKER"}
          nameField="name"
          label="Inker"
          multiple
          disabled={props.disabled}
          allowCreate
          variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].individuals,
              setFieldValue,
              "stories[" + index + "].individuals",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />
      </div>
      <div className="storyAddInputContainer">
        <AutocompleteField
          query={individuals}
          type={"COLORIST"}
          name={"stories[" + index + "].individuals"}
          nameField="name"
          label="Kolorist"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].individuals,
              setFieldValue,
              "stories[" + index + "].individuals",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />
        <AutocompleteField
          query={individuals}
          name={"stories[" + index + "].individuals"}
          type={"LETTERER"}
          nameField="name"
          label="Letterer"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].individuals,
              setFieldValue,
              "stories[" + index + "].individuals",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />
        <AutocompleteField
          query={individuals}
          name={"stories[" + index + "].individuals"}
          type={"EDITOR"}
          nameField="name"
          label="Verleger"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{ pattern: getPattern(values.stories[index].individuals, "name") }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].individuals,
              setFieldValue,
              "stories[" + index + "].individuals",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <br />
        <br />
        <br />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"FEATURED"}
          nameField="name"
          label="Hauptcharaktere"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "CHARACTER",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"ANTAGONIST"}
          nameField="name"
          label="Antagonisten"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "CHARACTER",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"SUPPORTING"}
          nameField="name"
          label="Unterstützende Charaktere"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "CHARACTER",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"OTHER"}
          nameField="name"
          label="Andere Charaktere"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "CHARACTER",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"GROUP"}
          nameField="name"
          label="Teams"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "GROUP",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"RACE"}
          nameField="name"
          label="Rassen"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "RACE",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"ANIMAL"}
          nameField="name"
          label="Tiere"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "ANIMAL",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"ITEM"}
          nameField="name"
          label="Gegenstände"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "ITEM",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"VEHICLE"}
          nameField="name"
          label="Fahrzeuge"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "VEHICLE",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />

        <AutocompleteField
          query={apps}
          name={"stories[" + index + "].appearances"}
          type={"LOCATION"}
          nameField="name"
          label="Orte"
          disabled={props.disabled}
          multiple
          allowCreate
          variables={{
            pattern: getPattern(values.stories[index].appearances, "name"),
            type: "LOCATION",
          }}
          onChange={(option, live) =>
            updateField(
              option,
              live,
              values.stories[index].appearances,
              setFieldValue,
              "stories[" + index + "].appearances",
              "name"
            )
          }
          generateLabel={(e) => e.name}
        />
      </div>
    </React.Fragment>
  );
}

export function Covers(props) {
  return (
    <React.Fragment>
      <div>
        <CardHeader className="left" title="Covergalerie" />
        <AddContainsButton disabled={props.us} type="covers" default={coverDefault} {...props} />
      </div>

      <br />

      <Contains {...props} type="covers" default={coverDefault} fields={<CoverFields />} />
    </React.Fragment>
  );
}

function CoverFields(props) {
  let extended = props.items[props.index].exclusive ? (
    <CoverFieldsExclusive {...props} />
  ) : (
    <CoverFieldsNonExclusive {...props} />
  );

  return (
    <React.Fragment>
      <div className="storyAddInputContainer">
        {props.items[props.index].number === 0 ? (
          <FastField
            className="field field3"
            name={"covers[" + props.index + "].number"}
            label="#"
            disabled
            type="number"
            component={TextField}
          />
        ) : (
          <FastField
            className="field field3"
            name={"covers[" + props.index + "].number"}
            label="#"
            disabled={props.disabled}
            type="number"
            component={TextField}
          />
        )}
        <FastField
          className={props.desktop ? "field field75" : "field field95"}
          name={"covers[" + props.index + "].addinfo"}
          label="Weitere Informationen"
          disabled={props.disabled}
          component={TextField}
        />

        {!props.us ? <ExclusiveToggle {...props} /> : null}
      </div>

      {extended}
    </React.Fragment>
  );
}

function CoverFieldsNonExclusive(props) {
  const { index, setFieldValue, values } = props;

  return (
    <div className="storyAddInputContainer">
      <AutocompleteField
        query={series}
        name={"covers[" + index + "].parent.issue.series"}
        nameField="title"
        label="Serie"
        allowCreate
        variables={{
          pattern: values.covers[index].parent.issue.series.title,
          publisher: { name: "*", us: true },
        }}
        onChange={(option, live) => {
          if (typeof option !== "string" || option.trim() !== "") {
            if (live) {
              setFieldValue("covers[" + index + "].parent.issue.series.title", option);
            } else {
              if (option && !option.volume) option.volume = 0;

              setFieldValue(
                "covers[" + index + "].parent.issue.series",
                option ? option : { title: "", volume: 0 }
              );
            }
          }
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
  const { index, setFieldValue } = props;

  return (
    <React.Fragment>
      <AutocompleteField
        query={individuals}
        name={"covers[" + index + "].individuals"}
        nameField="name"
        type={"ARTIST"}
        label="Zeichner"
        multiple
        allowCreate
        disabled={props.disabled}
        variables={{ pattern: getPattern(props.values.covers[props.index].individuals, "name") }}
        onChange={(option, live) =>
          updateField(
            option,
            live,
            props.values.covers[index].individuals,
            setFieldValue,
            "covers[" + index + "].individuals",
            "name"
          )
        }
        generateLabel={(e) => e.name}
      />
    </React.Fragment>
  );
}

function Contains(props) {
  if (!props.items || props.items.length === 0)
    return <Typography className="noRelationsWarning">Hinzufügen mit '+'</Typography>;

  return props.items.map((item, index) => (
    <ContainsItem key={index} {...props} item={item} index={index} />
  ));
}

interface ContainsItemProps {
  item: { children?: unknown[] };
  items: unknown[];
  index: number;
  fields: React.ReactElement;
  [key: string]: unknown;
}

class ContainsItem extends React.Component<ContainsItemProps> {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item) ||
      JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items)
    );
  }

  render() {
    return (
      <div key={this.props.index} className="storyAddContainer">
        <RemoveContainsButton
          disabled={this.props.item.children && this.props.item.children.length > 0}
          {...this.props}
        />

        <Accordion className="storyAddPanel" key={this.props.index} expanded={true}>
          <AccordionSummary className="storyAdd">
            {React.cloneElement(this.props.fields, {
              ...this.props,
              disabled: this.props.item.children && this.props.item.children.length > 0,
            })}
          </AccordionSummary>
        </Accordion>
      </div>
    );
  }
}

function AddContainsButton(props) {
  return (
    <IconButton
      disabled={props.disabled}
      className="addBtn"
      aria-label="Hinzufügen"
      onMouseDown={(e) => {
        let items = props.items;
        let def = JSON.parse(JSON.stringify(props.default));
        def.number = props.items.length + 1;
        items.push(def);
        props.setFieldValue(props.type, items, true);
      }}
    >
      <AddIcon />
    </IconButton>
  );
}

function RemoveContainsButton(props) {
  return (
    <IconButton
      disabled={props.disabled}
      className="removeBtn"
      aria-label="Entfernen"
      onMouseDown={(e) => {
        let items = props.items.filter((e) => JSON.stringify(e) !== JSON.stringify(props.item));
        props.setFieldValue(props.type, items, true);
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}

function ExclusiveToggle(props) {
  const { type, index, items, setFieldValue } = props;

  return (
    <FormControlLabel
      className="exclusiveToggle"
      control={
        <Switch
          checked={items[index].exclusive}
          onChange={() => {
            let item = JSON.parse(JSON.stringify(items[index]));

            if (items[index].exclusive) {
              item.individuals = undefined;
              if (type === "stories") item.appearances = undefined;
              item.parent = { issue: { series: { title: "" } } };
              item.exclusive = false;
            } else {
              item.exclusive = true;
              item.individuals = [];
              if (type === "stories") item.appearances = [];
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

export const storyDefault = {
  parent: {
    issue: {
      series: {
        title: "",
        volume: 1,
        publisher: {
          name: "",
        },
      },
      number: 0,
    },
    number: 0,
  },
  individuals: [],
  addinfo: "",
  part: "",
  exclusive: false,
};

export const coverDefault = {
  parent: {
    issue: {
      series: {
        title: "",
        volume: 1,
        publisher: {
          name: "",
        },
      },
      number: "0",
      variant: "",
    },
    number: 0,
  },
  individuals: [],
  addinfo: "",
  number: 0,
  exclusive: false,
};
