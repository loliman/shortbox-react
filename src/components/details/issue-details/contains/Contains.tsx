import React from "react";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { getContainsItemKey } from "../utils/issueDetailsUtils";
import { ContainsSimpleItem } from "./ContainsSimpleItem";
import { ContainsItem } from "./ContainsItem";

interface ContainsProps {
  header?: string;
  noEntriesHint?: string;
  items?: unknown[];
  itemTitle: React.ReactElement;
  itemDetails?: React.ReactElement;
  query?: { filter?: string; expand?: string } | null;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  us?: boolean;
  [key: string]: unknown;
}

export function Contains(props: Readonly<ContainsProps>) {
  const items = Array.isArray(props.items) ? props.items : [];

  return (
    <div className="stories">
      {props.header ? <CardHeader title={props.header} /> : null}

      {items.length === 0 ? (
        <Typography className="noRelationsWarning">{props.noEntriesHint}</Typography>
      ) : (
        items.map((item, idx) => {
          if (!props.itemDetails) {
            return (
              <ContainsSimpleItem
                key={getContainsItemKey(item, idx)}
                item={item}
                itemTitle={props.itemTitle}
                query={props.query}
                navigate={props.navigate}
                us={props.us}
              />
            );
          }

          return (
            <ContainsItem
              idx={idx}
              key={getContainsItemKey(item, idx)}
              isLast={idx === items.length - 1}
              item={item}
              itemTitle={props.itemTitle}
              itemDetails={props.itemDetails}
              query={props.query}
              navigate={props.navigate}
              us={props.us}
            />
          );
        })
      )}
    </div>
  );
}
