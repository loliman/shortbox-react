import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
        borderRadius: "8px",
        border: "1px solid",
        borderColor: (theme) =>
          isHighlighted
            ? theme.palette.mode === "dark"
              ? "rgba(202, 208, 217, 0.62)"
              : "rgba(138, 144, 154, 0.55)"
            : theme.palette.divider,
        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
        overflow: "hidden",
        boxShadow: (theme) => theme.shadows[1],
        transition: "box-shadow 180ms ease, border-color 180ms ease",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": {
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#161b22" : "#ffffff"),
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ visibility: "hidden" }} />}
        sx={{
          py: 1.25,
          minHeight: 0,
          "&.Mui-expanded": {
            minHeight: 0,
          },
          "& .MuiAccordionSummary-content": {
            width: "100%",
            margin: 0,
            "&.Mui-expanded": {
              margin: 0,
            },
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            margin: 0,
            alignSelf: "center",
            pointerEvents: "none",
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
