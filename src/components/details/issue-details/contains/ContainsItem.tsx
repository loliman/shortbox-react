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
  const isHighlighted = expanded(props.item, props.query);
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
        border: "1px solid",
        borderColor: (theme) =>
          isHighlighted ? theme.palette.primary.main : theme.palette.divider,
        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
        overflow: "hidden",
        boxShadow: (theme) =>
          isHighlighted
            ? theme.palette.mode === "dark"
              ? "0 0 0 1px rgba(144, 202, 249, 0.65)"
              : "0 0 0 1px rgba(25, 118, 210, 0.45)"
            : "none",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": {
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
        },
        "& .MuiAccordionDetails-root": {
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
        },
      }}
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
