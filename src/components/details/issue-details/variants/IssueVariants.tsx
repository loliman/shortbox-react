import React from "react";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import { getVariantKey } from "../utils/issueDetailsUtils";
import { IssueVariantTile } from "./IssueVariantTile";

type NavigateFn = (event: unknown, url: string, query?: Record<string, unknown>) => void;

type VariantIssue = {
  format?: string | null;
  variant?: string | null;
  collected?: boolean | null;
  cover?: { url?: string | null } | null;
  covers?: Array<{ parent?: { issue?: { cover?: { url?: string | null } | null } | null } | null }> | null;
  stories?: unknown[] | null;
};

type IssueVariantsProps = {
  issue: VariantIssue & { variants?: VariantIssue[] | null };
  us?: boolean;
  session?: unknown;
  navigate?: NavigateFn;
};

export function IssueVariants(props: Readonly<IssueVariantsProps>) {
  const variants = props.issue.variants || [];
  if (variants.length <= 1) return null;

  return (
    <React.Fragment>
      <Typography className="coverGalleryHeader" component="p">
        Erhältlich in {variants.length} Varianten
      </Typography>

      <div className="coverGallery">
        <ImageList className="gridList" cols={3}>
          {variants.map((variant, idx) => (
            <IssueVariantTile
              issue={props.issue}
              variant={variant}
              session={props.session}
              navigate={props.navigate}
              us={Boolean(props.us)}
              key={getVariantKey(variant, idx)}
            />
          ))}
        </ImageList>
      </div>
    </React.Fragment>
  );
}
