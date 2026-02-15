import React from "react";
import { FastField } from "formik";
import { TextField } from "../../../generic/FormikTextField";
import ExclusiveToggle from "./ExclusiveToggle";
import CoverFieldsExclusive from "./CoverFieldsExclusive";
import CoverFieldsNonExclusive from "./CoverFieldsNonExclusive";
import type { ContainsProps, FieldItem } from "./types";

interface CoverFieldsProps extends ContainsProps {
  index?: number;
  items?: FieldItem[];
  values?: Record<string, unknown> & { covers?: FieldItem[] };
}

function CoverFields(props: CoverFieldsProps) {
  const index = Number.isInteger(props.index) ? (props.index as number) : 0;
  const items = props.items || [];
  const item = items[index] || {};
  const isExclusive = Boolean(item.exclusive);
  const isZeroNumber = Number(item.number) === 0;

  return (
    <React.Fragment>
      <div className="storyAddInputContainer">
        <FastField
          className="field field3"
          name={`covers[${index}].number`}
          label="#"
          disabled={isZeroNumber || props.disabled}
          type="number"
          component={TextField}
        />

        <FastField
          className={props.isDesktop ? "field field75" : "field field95"}
          name={`covers[${index}].addinfo`}
          label="Weitere Informationen"
          disabled={props.disabled}
          component={TextField}
        />

        {!props.us ? <ExclusiveToggle {...props} type="covers" index={index} /> : null}
      </div>

      {isExclusive ? (
        <CoverFieldsExclusive {...props} index={index} />
      ) : (
        <CoverFieldsNonExclusive {...props} index={index} />
      )}
    </React.Fragment>
  );
}

export default CoverFields;
