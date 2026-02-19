import React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { generateItemTitle } from "../../../../util/issues";

type ContainsTitleSimpleItem = {
  addinfo?: string | null;
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
  isPhone?: boolean;
  isTablet?: boolean;
  drawerOpen?: boolean;
  session?: unknown;
};

export function ContainsTitleSimple(props: Readonly<ContainsTitleSimpleProps>) {
  const item = props.item;
  const smallChip =
    Boolean(props.isPhone) || (Boolean(props.isTablet) && Boolean(props.drawerOpen));
  const children = Array.isArray(item.children) ? item.children : [];
  const reprints = Array.isArray(item.reprints) ? item.reprints : [];

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600 }}>{generateItemTitle(item, Boolean(props.us))}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.addinfo ? item.addinfo : null}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, justifyContent: "flex-end" }}>
        {item.onlyoneprint && !item.parent ? (
          !smallChip ? (
            <Chip label="Nur einfach auf deutsch veröffentlicht" color="secondary" />
          ) : (
            <Chip label={<PriorityHighIcon sx={{ fontSize: 16 }} />} color="secondary" />
          )
        ) : null}

        {item.onlytb && !item.parent ? (
          <Chip label={!smallChip ? "Nur in Taschenbuch" : "TB"} color="primary" />
        ) : null}

        {props.us && children.length === 0 ? (
          !smallChip ? (
            <Chip label="Nicht auf deutsch erschienen" color="default" />
          ) : (
            <Chip label="n/a" color="default" />
          )
        ) : null}

        {item.reprintOf ? (
          !smallChip ? (
            <Chip label="Nachdruck" color="default" />
          ) : (
            <Chip label="ND" color="default" />
          )
        ) : null}

        {reprints.length > 0 ? (
          !smallChip ? (
            <Chip label="Nachgedruckt" color="default" />
          ) : (
            <Chip label="ND" color="default" />
          )
        ) : null}

        {item.collectedmultipletimes && props.session ? (
          !smallChip ? (
            <Chip color="success" label="Mehrfach auf deutsch gesammelt" />
          ) : (
            <Chip color="success" label="Mehrfach" />
          )
        ) : null}

        {!item.collectedmultipletimes && item.collected && props.session ? (
          !smallChip ? (
            <Chip color="success" label="Auf deutsch gesammelt" />
          ) : (
            <Chip color="success" label="Gesammelt" />
          )
        ) : null}
      </Box>
    </Box>
  );
}
