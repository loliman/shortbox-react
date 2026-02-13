import { today } from "../../util/util";
import Card from "@mui/material/Card";
import { generateLabel, generateUrl } from "../../util/hierarchy";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { withContext } from "../generic";
import React from "react";
import Chip from "@mui/material/Chip";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CardMedia from "@mui/material/CardMedia";

function IssuePreview(props) {
  let date = props.issue.updatedAt.split(" ")[0];
  if (date === today()) date = "heute";
  else date = "am " + date;

  let variant = "";
  if (props.issue.format) {
    variant += props.issue.format;
    if (props.issue.variant) variant += " (" + props.issue.variant + " Variant)";
  }

  let coverUrl;
  let blurCover = false;

  if (props.issue.cover && props.issue.cover.url && props.issue.cover.url !== "") {
    coverUrl = props.issue.cover.url;
  } else if (
    !props.us &&
    props.issue.covers.length > 0 &&
    props.issue.covers[0].parent &&
    props.issue.covers[0].parent.issue &&
    props.issue.covers[0].parent.issue.cover &&
    props.issue.covers[0].parent.issue.cover.url
  ) {
    blurCover = true;
    coverUrl = props.issue.covers[0].parent.issue.cover.url;
  } else {
    coverUrl = props.cookies.get("newDesign") === "true" ? "" : "/nocover.jpg";
  }

  let smallChip =
    props.mobile ||
    props.mobileLandscape ||
    ((props.tablet || props.tabletLandscape) && props.drawerOpen);

  let collected = !!props.issue.collected;
  let collectedMultipleTimes = false;
  let sellable = 0;

  if (props.us) {
    props.issue.stories.forEach((s) => {
      if (!collectedMultipleTimes && s.collectedmultipletimes === true) {
        collectedMultipleTimes = true;
      }

      s.children.forEach((c) => {
        if (!collected) collected = !!(c.issue.collected && !collected);
      });
    });
  } else {
    props.issue.stories.forEach((s) => {
      if (s.parent && s.parent.collectedmultipletimes === true) {
        sellable++;
      }

      if (!collectedMultipleTimes && s.parent && s.parent.collectedmultipletimes === true) {
        collectedMultipleTimes = true;
      }
    });
  }

  return (
    <Card
      style={
        props.cookies.get("newDesign") === "true"
          ? { background: `white url(${coverUrl}) no-repeat 100% 50%`, backgroundSize: "75%" }
          : {}
      }
      onMouseDown={(e) => props.navigate(e, generateUrl(props.issue, props.us))}
    >
      <div
        className={blurCover ? "blurred" : ""}
        style={
          props.cookies.get("newDesign") === "true"
            ? { background: "linear-gradient(to right, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 0))" }
            : {}
        }
      >
        <div>
          {props.cookies.get("newDesign") !== "true" ? (
            <CardMedia
              image={coverUrl}
              style={{
                float: "left",
                width: "91px",
                height: "141px",
                margin: "5px",
                marginRight: "20px",
                border: "1px solid #f0f0f0",
                borderRadius: "3px",
              }}
            >
              <div className={blurCover ? "blurred" : ""} />
            </CardMedia>
          ) : null}

          <CardContent style={{ paddingBottom: "20px" }}>
            <div>
              <div>
                <Typography variant="subtitle1">
                  {generateLabel(props.issue.series) + " #" + props.issue.number}
                </Typography>

                {props.issue.title !== "" ? (
                  <Typography variant={"subtitle2"}>
                    {props.issue.title}
                  </Typography>
                ) : null}
              </div>

              <div>
                {props.issue.verified ? (
                  <img src="/verified_badge.png" alt="verifiziert" height="25" />
                ) : null}

                {collected && props.session ? (
                  <img src="/collected_badge.png" alt="gesammelt" height="25" />
                ) : null}
              </div>
            </div>

            {variant !== "" ? <Typography variant={"caption"}>{variant}</Typography> : null}

            <br />
            <br />

            {!props.us && props.issue.stories.filter((s) => s.onlyapp).length > 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Einzige Veröffentlichung" color="secondary" />
              ) : (
                <Chip
                  className="chip"
                  label={
                    <PriorityHighIcon
                      className="
                                mobileChip"
                    />
                  }
                  color="secondary"
                />
              )
            ) : null}

            {!props.us && props.issue.stories.filter((s) => s.firstapp).length > 0 ? (
              <Chip
                className="chip"
                label={!smallChip ? "Erstveröffentlichung" : "1."}
                color="primary"
              />
            ) : null}

            {!props.us && props.issue.stories.filter((s) => s.otheronlytb).length > 0 ? (
              <Chip
                className="tbchip chip"
                label={!smallChip ? "Sonst nur in Taschenbuch" : "TB"}
                color="default"
              />
            ) : null}

            {!props.us && props.issue.stories.filter((s) => s.exclusive).length > 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Exklusiver Inhalt" color="secondary" />
              ) : (
                <Chip
                  className="chip"
                  label={
                    <PriorityHighIcon
                      className="
                                mobileChip"
                    />
                  }
                  color="secondary"
                />
              )
            ) : null}

            {!props.us &&
            props.issue.stories.filter((s) => s.parent && s.parent.children.length > 1).length ===
              props.issue.stories.length &&
            props.issue.stories.filter((s) => s.firstapp).length === 0 &&
            props.issue.stories.length > 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Reiner Nachdruck" color="default" />
              ) : (
                <Chip className="chip" label="ND" color="default" />
              )
            ) : null}

            {collectedMultipleTimes && props.session ? (
              !smallChip ? (
                <Chip
                  className="chip"
                  label={"Mehrfach " + (props.us ? "auf deutsch " : "") + "gesammelt"}
                  style={{ backgroundColor: "#4eaf51", color: "white" }}
                />
              ) : (
                <Chip
                  className="chip"
                  label="Mehrfach"
                  style={{ backgroundColor: "#4eaf51", color: "white" }}
                />
              )
            ) : null}

            {props.issue.collected &&
            sellable > 0 &&
            sellable === props.issue.stories.length &&
            props.session ? (
              !smallChip ? (
                <Chip
                  className="chip"
                  label="Verkaufbar"
                  style={{ backgroundColor: "#4eaf51", color: "white" }}
                />
              ) : (
                <Chip
                  className="chip"
                  label="Verkaufbar"
                  style={{ backgroundColor: "#4eaf51", color: "white" }}
                />
              )
            ) : null}

            {!props.us && props.issue.stories.length === 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Keine Geschichten zugeordnet" color="default" />
              ) : (
                <Chip className="chip" label="n/a" color="default" />
              )
            ) : null}

            {props.us && props.issue.stories.filter((s) => s.onlyoneprint).length > 0 ? (
              !smallChip ? (
                <Chip
                  className="chip"
                  label="Nur einfach auf deutsch veröffentlicht"
                  color="secondary"
                />
              ) : (
                <Chip
                  className="chip"
                  label={
                    <PriorityHighIcon
                      className="
                                mobileChip"
                    />
                  }
                  color="secondary"
                />
              )
            ) : null}

            {props.us && props.issue.stories.filter((s) => s.onlytb).length > 0 ? (
              <Chip
                className="chip"
                label={!smallChip ? "Nur in Taschenbuch" : "TB"}
                color="primary"
              />
            ) : null}

            {props.us && props.issue.stories.filter((s) => s.children.length > 0).length === 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Nicht auf deutsch erschienen" color="default" />
              ) : (
                <Chip className="chip" label="n/a" color="default" />
              )
            ) : null}

            {props.us && props.issue.stories.filter((s) => s.reprintOf).length > 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Nachdruck" color="default" />
              ) : (
                <Chip className="chip" label="ND" color="default" />
              )
            ) : null}

            {props.us && props.issue.stories.filter((s) => s.reprints.length > 0).length > 0 ? (
              !smallChip ? (
                <Chip className="chip" label="Nachgedruckt" color="default" />
              ) : (
                <Chip className="chip" label="ND" color="default" />
              )
            ) : null}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export function IssuePreviewPlaceholder(props) {
  let n = Math.floor(Math.random() * 6);
  let lengths = ["very long", "long", "medium", "short", "very short"];

  return (
    <Card>
      <CardContent>
        <div className="ui placeholder issuePreviewHeaderPlaceholder">
          <div className="header">
            <div className={lengths[n - 1] + " line"} />
          </div>
          <div className="paragraph">
            <div className="extremly short line" />
            <div className="extremly short line" />
          </div>
        </div>

        <br />

        <div className="ui placeholder">
          <div className="very short line" />
        </div>
      </CardContent>
    </Card>
  );
}

export default withContext(IssuePreview);
