import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import RemoveContainsButton from "./RemoveContainsButton";
import type { ContainsProps, FieldItem } from "./types";

interface ContainsItemProps extends ContainsProps {
  item: FieldItem;
  index: number;
  fields: React.ReactElement;
  type: "stories";
}

class ContainsItem extends React.Component<ContainsItemProps> {
  shouldComponentUpdate(nextProps: ContainsItemProps) {
    return (
      this.props.item !== nextProps.item ||
      (this.props.items || []).length !== (nextProps.items || []).length ||
      this.props.index !== nextProps.index
    );
  }

  render() {
    const childCount = Array.isArray(this.props.item.children)
      ? this.props.item.children.length
      : 0;
    const isDisabled = childCount > 0;

    return (
      <div className="storyAddContainer">
        <RemoveContainsButton {...this.props} disabled={isDisabled} />

        <Accordion className="storyAddPanel" expanded={true}>
          <AccordionSummary className="storyAdd">
            {React.cloneElement(this.props.fields, {
              ...this.props,
              disabled: isDisabled,
            })}
          </AccordionSummary>
        </Accordion>
      </div>
    );
  }
}

export default ContainsItem;
