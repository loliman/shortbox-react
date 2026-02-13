import React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
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
  const smallChip = Boolean(props.isPhone) || (Boolean(props.isTablet) && Boolean(props.drawerOpen));
  const children = Array.isArray(item.children) ? item.children : [];
  const reprints = Array.isArray(item.reprints) ? item.reprints : [];

  return (
    <div className={props.simple ? "storyTitle storyTitleSimple" : "storyTitle"}>
      <div className="headingContainer">
        <Typography className="heading">{generateItemTitle(item, props.us)}</Typography>
        <Typography className="heading headingAddInfo">{item.addinfo ? item.addinfo : null}</Typography>
      </div>

      <div className="chips">
        {item.onlyoneprint && !item.parent ? (
          !smallChip ? (
            <Chip className="chip" label="Nur einfach auf deutsch veröffentlicht" color="secondary" />
          ) : (
            <Chip className="chip" label={<PriorityHighIcon className="mobileChip" />} color="secondary" />
          )
        ) : null}

        {item.onlytb && !item.parent ? <Chip className="chip" label={!smallChip ? "Nur in Taschenbuch" : "TB"} color="primary" /> : null}

        {props.us && children.length === 0 ? (
          !smallChip ? <Chip className="chip" label="Nicht auf deutsch erschienen" color="default" /> : <Chip className="chip" label="n/a" color="default" />
        ) : null}

        {item.reprintOf ? (!smallChip ? <Chip className="chip" label="Nachdruck" color="default" /> : <Chip className="chip" label="ND" color="default" />) : null}

        {reprints.length > 0 ? (!smallChip ? <Chip className="chip" label="Nachgedruckt" color="default" /> : <Chip className="chip" label="ND" color="default" />) : null}

        {item.collectedmultipletimes && props.session ? (!smallChip ? <Chip className="chip" label="Mehrfach auf deutsch gesammelt" /> : <Chip className="chip" label="Mehrfach" />) : null}

        {!item.collectedmultipletimes && item.collected && props.session ? (!smallChip ? <Chip className="chip" label="Auf deutsch gesammelt" /> : <Chip className="chip" label="Gesammelt" />) : null}
      </div>
    </div>
  );
}
