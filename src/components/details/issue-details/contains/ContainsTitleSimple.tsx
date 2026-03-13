import React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { generateLabel } from "../../../../util/hierarchy";
import { IssueReferenceInline } from "../../../generic/IssueNumberInline";

type ContainsTitleSimpleItem = {
  addinfo?: string | null;
  number?: string | number | null;
  legacy_number?: string | null;
  series?: {
    title?: string;
    volume?: number;
    startyear?: number;
    publisher?: { name?: string };
  } | null;
  title?: string | null;
  onlyoneprint?: boolean;
  onlytb?: boolean;
  parent?: unknown;
  children?: unknown[] | null;
  reprintOf?: unknown;
  reprints?: unknown[] | null;
  collectedmultipletimes?: boolean;
  collected?: boolean;
};

type ContainsTitleSimpleProps = {
  item: ContainsTitleSimpleItem;
  us?: boolean;
  simple?: boolean;
  compactLayout?: boolean;
  isPhone?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  drawerOpen?: boolean;
  session?: unknown;
};

export function ContainsTitleSimple(props: Readonly<ContainsTitleSimpleProps>) {
  const item = props.item;
  const stackActions =
    props.compactLayout ??
    Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const children = Array.isArray(item.children) ? item.children : [];
  const reprints = Array.isArray(item.reprints) ? item.reprints : [];
  const hasIssueReference = Boolean(item.series);
  const titleSuffix = item.title ? (hasIssueReference ? " - " + item.title : item.title) : "";
  const actionChips = buildSimpleActionChips({
    item,
    childrenCount: children.length,
    reprintsCount: reprints.length,
    us: Boolean(props.us),
    hasSession: Boolean(props.session),
  });

  return (
    <Box
      sx={
        stackActions
          ? {
              width: "100%",
              display: "block",
            }
          : {
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }
      }
    >
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "grid", rowGap: 0.5 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: "0.16em" }}
          >
            Story
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {hasIssueReference ? (
            <IssueReferenceInline
              seriesLabel={item.series ? generateLabel({ series: item.series } as any) : undefined}
              number={item.number}
              legacy_number={item.legacy_number}
            />
          ) : null}
          {titleSuffix ? (
            <Box component="span" sx={{ fontWeight: hasIssueReference ? 400 : 700 }}>
              {titleSuffix}
            </Box>
          ) : null}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.addinfo ? item.addinfo : null}
          </Typography>
        </Box>

        {stackActions && actionChips.length > 0 ? (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              alignItems: "center",
            }}
          >
            {actionChips}
          </Box>
        ) : null}
      </Box>

      {!stackActions ? (
        <Box
          sx={{
            ml: "auto",
            alignSelf: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {actionChips}
        </Box>
      ) : null}
    </Box>
  );
}

function buildSimpleActionChips({
  item,
  childrenCount,
  reprintsCount,
  us,
  hasSession,
}: {
  item: ContainsTitleSimpleItem;
  childrenCount: number;
  reprintsCount: number;
  us: boolean;
  hasSession: boolean;
}): React.ReactElement[] {
  const chips: React.ReactElement[] = [];

  if (item.onlyoneprint && !item.parent) {
    chips.push(
      <Chip key="onlyoneprint" label="Nur einfach auf deutsch veröffentlicht" color="secondary" />
    );
  }

  if (item.onlytb && !item.parent) {
    chips.push(<Chip key="onlytb" label="Nur in Taschenbuch" color="primary" />);
  }

  if (us && childrenCount === 0) {
    chips.push(<Chip key="notpublished" label="Nicht auf deutsch erschienen" color="default" />);
  }

  if (item.reprintOf) {
    chips.push(<Chip key="reprintof" label="Nachdruck" color="default" />);
  }

  if (reprintsCount > 0) {
    chips.push(<Chip key="reprints" label="Nachgedruckt" color="default" />);
  }

  if (item.collectedmultipletimes && hasSession) {
    chips.push(
      <Chip key="collectedmultiple" color="success" label="Mehrfach auf deutsch gesammelt" />
    );
  }

  if (!item.collectedmultipletimes && item.collected && hasSession) {
    chips.push(<Chip key="collected" color="success" label="Auf deutsch gesammelt" />);
  }

  return chips;
}
