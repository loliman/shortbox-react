import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { StoryPeopleSection } from "../sections/StoryPeopleSection";
import { StoryAppearanceSection } from "../sections/StoryAppearanceSection";
import { StoryIssueListItem } from "../StoryIssueListItem";
import { isSameIssue, toChildAddinfo, toIssueRowKey } from "../utils/storyIssueUtils";

interface IssueReference {
  [key: string]: any;
  issue?: Record<string, unknown> | null;
  number?: string | number;
  addinfo?: string;
  parent?: {
    issue?: Record<string, unknown> | null;
    number?: string | number;
  };
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
  issue?: Record<string, unknown>;
  us?: boolean;
  session?: unknown;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  [key: string]: any;
}

export function IssueDetailsUSStoryDetails(props: Readonly<IssueDetailsUSStoryDetailsProps>) {
  const story = props.item.parent ? props.item.parent : props.item;
  const us = Boolean(props.us);
  const reprints = Array.isArray(story?.reprints) ? story.reprints : [];
  const children = Array.isArray(props.item?.children) ? props.item.children : [];
  const reprintOf = props.item?.reprintOf;

  return (
    <div className="usStoryContainer">
      <div className="usStoryDetails">
        <StoryPeopleSection
          item={props.item as any}
          us={us}
          navigate={props.navigate}
          includeTranslator
          translatorOptional
        />
        <StoryAppearanceSection item={props.item as any} us={us} navigate={props.navigate} />
      </div>

      {!reprintOf?.issue ? null : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Nachdruck von</Typography>

          <List className="issueStoryIssueList">
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

          <List className="issueStoryIssueList">
            {reprints.map((child, idx) => {
              if (!child.issue) return null;

              return (
                <StoryIssueListItem
                  key={toIssueRowKey(child, idx)}
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

          <List className="issueStoryIssueList">
            {children.map((child, idx) => {
              if (!child.issue) return null;
              const addinfoText = toChildAddinfo(child);
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
                  key={toIssueRowKey(child, idx)}
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
    </div>
  );
}
