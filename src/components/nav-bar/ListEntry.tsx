import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { generateLabel, generateUrl, HierarchyLevel } from "../../util/hierarchy";
import CoverTooltip from "./CoverTooltip";

export default function TypeListEntry(props) {
  const { us, item, level, toggleDrawer } = props;
  const phonePortrait = props.isPhonePortrait ?? Boolean(props.isPhone && !props.isPhoneLandscape);
  const supportsCoverPreview = level === HierarchyLevel.ISSUE || level === HierarchyLevel.SERIES;
  const label = createItemLabel(item, level, us);
  const variantCount = item.variants ? item.variants.length - 1 : 0;
  const showVariants = Boolean(item.variants && item.variants.length > 1);
  const showCollected =
    Boolean(item.collected || item.variants?.some((v) => v.collected)) && Boolean(props.session);
  const isActiveIssue = Boolean(
    level === HierarchyLevel.ISSUE &&
      props.selected?.issue?.number &&
      props.selected.issue.number === item.number
  );

  const row = (
    <ListItemButton
      divider
      onClick={(e) => {
        if (phonePortrait && supportsCoverPreview) {
          toggleDrawer?.();
        }

        props.navigate?.(e, generateUrl(item, us), {
          expand: null,
          filter: props.query ? props.query.filter : null,
        });
      }}
    >
      <ListItemText
        sx={{ whiteSpace: "normal", m: 0 }}
        primary={
          <ListEntryPrimary
            label={label}
            active={isActiveIssue}
            showVariants={showVariants}
            variantCount={variantCount}
            showCollected={showCollected}
          />
        }
      />
    </ListItemButton>
  );

  if (supportsCoverPreview) {
    return (
      <CoverTooltip issue={item}>
        <Box data-item-index={props.idx}>{row}</Box>
      </CoverTooltip>
    );
  }

  return <Box data-item-index={props.idx}>{row}</Box>;
}

function createItemLabel(item, level, us) {
  if (level === HierarchyLevel.SERIES || level === HierarchyLevel.ISSUE) {
    if (level === HierarchyLevel.ISSUE && us) return "#" + item.number + " " + item.series.title;
    if (item.title && item.title !== "") return "#" + item.number + " " + item.title;
    return "#" + item.number + " " + item.series.title;
  }

  return generateLabel(item);
}

function ListEntryPrimary(props: {
  label: string;
  active: boolean;
  showVariants: boolean;
  variantCount: number;
  showCollected: boolean;
}) {
  return (
    <Typography component="div" sx={props.active ? { fontWeight: "bold" } : undefined}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>{props.label}</Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {props.showVariants ? (
            <Tooltip
              title={
                "+" +
                props.variantCount +
                (props.variantCount === 1 ? " Variante" : " Varianten")
              }
            >
              <Typography
                className={"material-icons"}
                sx={{ color: "gray", pl: "2px", fontSize: "8px" }}
                color={"disabled"}
              >
                +{props.variantCount}
              </Typography>
            </Tooltip>
          ) : null}

          {props.showCollected ? (
            <Box component="img" src="/collected_badge.png" alt="gesammelt" sx={{ height: 21, m: 0 }} />
          ) : null}
        </Box>
      </Box>
    </Typography>
  );
}
