import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import { expanded } from "./expanded";
import type { ItemLike, QueryParams } from "./expanded";

interface ContainsItemProps {
  idx: number;
  isLast: boolean;
  item: ItemLike;
  query?: QueryParams;
  itemTitle: React.ReactElement;
  itemDetails: React.ReactElement;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  us?: boolean;
}

export function ContainsItem(props: Readonly<ContainsItemProps>) {
  let borderRadius: string;
  if (props.idx === 0) {
    if (props.isLast) {
      borderRadius = "8px";
    } else {
      borderRadius = "8px 8px 0 0";
    }
  } else if (props.isLast) {
    borderRadius = "0 0 8px 8px";
  } else {
    borderRadius = "0";
  }

  return (
    <Accordion
      sx={{
        borderRadius,
        width: "auto",
        maxWidth: "100%",
      }}
      defaultExpanded={expanded(props.item, props.query)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          "& .MuiAccordionSummary-content": {
            width: "100%",
          },
        }}
      >
        {React.cloneElement(props.itemTitle, {
          navigate: props.navigate,
          item: props.item,
          us: props.us,
        })}
      </AccordionSummary>
      <AccordionDetails>
        {React.cloneElement(props.itemDetails, {
          us: props.us,
          navigate: props.navigate,
          item: props.item,
        })}
      </AccordionDetails>
    </Accordion>
  );
}
