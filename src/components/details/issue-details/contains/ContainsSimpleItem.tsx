import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { expanded } from "./expanded";
import type { ItemLike, QueryParams } from "./expanded";

interface ContainsSimpleItemProps {
  item: ItemLike;
  query?: QueryParams;
  itemTitle: React.ReactElement;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  us?: boolean;
}

export function ContainsSimpleItem(props: Readonly<ContainsSimpleItemProps>) {
  const isHighlighted = expanded(props.item, props.query);

  return (
    <Accordion
      sx={{
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
      }}
    >
      <AccordionSummary
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
          simple: true,
        })}
      </AccordionSummary>
    </Accordion>
  );
}
