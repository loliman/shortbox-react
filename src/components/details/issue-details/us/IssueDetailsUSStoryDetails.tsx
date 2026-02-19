import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { StoryPeopleSection } from "../sections/StoryPeopleSection";
import { StoryAppearanceSection } from "../sections/StoryAppearanceSection";
import { StoryIssueListItem } from "../StoryIssueListItem";
import type { StoryIssue, StoryIssueRelation } from "../utils/storyIssueUtils";
import { isSameIssue, toChildAddinfo, toIssueRowKey } from "../utils/storyIssueUtils";

interface IssueReference extends Omit<StoryIssueRelation, "issue" | "parent"> {
  [key: string]: any;
  issue?: StoryIssue | null;
  number?: string | number;
  addinfo?: string;
  parent?: {
    issue?: StoryIssue | null;
    number?: string | number;
  } | null;
}

interface StoryLike extends IssueReference {
  reprintOf?: IssueReference | null;
  reprints?: IssueReference[];
  children?: IssueReference[];
}

interface IssueDetailsUSStoryDetailsProps {
  item?: {
    parent?: StoryLike | null;
    reprintOf?: IssueReference | null;
    reprints?: IssueReference[];
    children?: IssueReference[];
  } & StoryLike;
  issue?: StoryIssue;
  us?: boolean;
  session?: unknown;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: any;
}

function toStoryIssueRelation(value: IssueReference): StoryIssueRelation {
  return {
    ...value,
    issue: value.issue || undefined,
    parent: value.parent
      ? {
          ...value.parent,
          issue: value.parent.issue || undefined,
        }
      : undefined,
  };
}

export function IssueDetailsUSStoryDetails(props: Readonly<IssueDetailsUSStoryDetailsProps>) {
  const currentItem = props.item || {};
  const story = currentItem.parent ? currentItem.parent : currentItem;
  const us = Boolean(props.us);
  const reprints = Array.isArray(story?.reprints) ? story.reprints : [];
  const children = Array.isArray(currentItem.children) ? currentItem.children : [];
  const reprintOf = currentItem.reprintOf;

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StoryPeopleSection
          item={(currentItem as Record<string, unknown>) || {}}
          us={us}
          navigate={props.navigate}
          includeTranslator
          translatorOptional
        />
        <StoryAppearanceSection
          item={(currentItem as Record<string, unknown>) || {}}
          us={us}
          navigate={props.navigate}
        />
      </Box>

      {!reprintOf?.issue ? null : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Nachdruck von</Typography>

          <List sx={{ p: 0 }}>
            <StoryIssueListItem
              issue={reprintOf.issue}
              number={reprintOf.number}
              subtitle={reprintOf.addinfo ? reprintOf.addinfo : null}
              routeUs={true}
              coverUs={true}
              navigate={props.navigate}
            />
          </List>
        </Box>
      )}

      {reprints.length === 0 ? null : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Nachgedruckt in</Typography>

          <List sx={{ p: 0 }}>
            {reprints.map((child, idx) => {
              if (!child.issue) return null;
              const relation = toStoryIssueRelation(child);

              return (
                <StoryIssueListItem
                  key={toIssueRowKey(relation, idx)}
                  issue={child.issue}
                  number={child.number}
                  subtitle={child.addinfo ? child.addinfo : null}
                  routeUs={true}
                  coverUs={true}
                  divider={reprints.length - 1 !== idx}
                  navigate={props.navigate}
                />
              );
            })}
          </List>
        </Box>
      )}

      {children.length === 0 ? null : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Auf deutsch erschienen in</Typography>

          <List sx={{ p: 0 }}>
            {children.map((child, idx) => {
              if (!child.issue) return null;
              const relation = toStoryIssueRelation(child);
              const addinfoText = toChildAddinfo(relation);
              const parentLink =
                child.parent?.issue && !isSameIssue(child.parent.issue, props.issue)
                  ? {
                      issue: child.parent.issue,
                      number: child.parent.number,
                      prefix: "Als",
                      routeUs: true,
                      coverUs: true,
                    }
                  : null;

              return (
                <StoryIssueListItem
                  key={toIssueRowKey(relation, idx)}
                  issue={child.issue}
                  number={child.number}
                  subtitle={addinfoText !== "" ? addinfoText : null}
                  titleSuffix={child.issue.title ? " - " + child.issue.title : ""}
                  parentLink={parentLink}
                  routeUs={false}
                  coverUs={false}
                  showCollected
                  session={props.session}
                  divider={children.length - 1 !== idx}
                  navigate={props.navigate}
                />
              );
            })}
          </List>
        </Box>
      )}
    </Box>
  );
}
