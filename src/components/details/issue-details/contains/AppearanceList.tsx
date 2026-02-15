import React from "react";
import { ChipList } from "./ChipList";

type AppearanceListProps = {
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  label?: string;
  hideIfEmpty?: boolean;
  type?: string;
  appRole?: string;
  item: { parent?: { appearances?: unknown[] | null } | null; appearances?: unknown[] | null };
};

export function AppearanceList(props: Readonly<AppearanceListProps>) {
  const appearances = props.item.parent ? props.item.parent.appearances : props.item.appearances;

  return (
    <ChipList
      us={props.us}
      navigate={props.navigate}
      label={props.label}
      hideIfEmpty={props.hideIfEmpty}
      type={props.type}
      appRole={props.appRole}
      items={Array.isArray(appearances) ? appearances : []}
    />
  );
}
