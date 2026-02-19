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
  return (
    <Accordion defaultExpanded={expanded(props.item, props.query)}>
      <AccordionSummary>
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
