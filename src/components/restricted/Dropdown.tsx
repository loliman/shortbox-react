import React from "react";
import { gql, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { generateLabel, generateUrl, HierarchyLevel } from "../../util/hierarchy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkRemoveOutlinedIcon from "@mui/icons-material/BookmarkRemoveOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeletionDialog from "./DeletionDialog";
import { withContext } from "../generic";
import { stripItem } from "../../util/util";
import { runAdminTask } from "../../graphql/mutationsTyped";
import { ReimportScopeKind } from "../../graphql/typed-documents.generated";

const EDIT_ISSUE_STATUS_MUTATION = gql`
  mutation EditIssueStatus($old: IssueInput!, $item: IssueInput!) {
    editIssue(old: $old, item: $item) {
      id
      verified
      collected
    }
  }
`;

const actionButtonSx = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  bgcolor: "action.hover",
  width: 34,
  height: 34,
  "&:hover": {
    bgcolor: "action.selected",
    borderColor: "text.disabled",
  },
};

interface DropdownStory {
  children?: unknown[];
}

interface DropdownItem {
  id?: string | number;
  series?: { publisher?: { us?: boolean; name?: string }; title?: string; volume?: number };
  publisher?: { us?: boolean; name?: string };
  title?: string;
  number?: string;
  format?: string;
  variant?: string;
  releasedate?: string;
  pages?: number;
  price?: number;
  currency?: string;
  isbn?: string;
  limitation?: string;
  addinfo?: string;
  verified?: boolean;
  collected?: boolean;
  us?: boolean | null;
  stories?: DropdownStory[];
  __typename?: string;
  [key: string]: unknown;
}

interface DropdownProps {
  session?: unknown;
  level?: string;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  enqueueSnackbar?: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  handleClose?: () => void;
  item?: DropdownItem | null;
  EditDropdown?: {
    anchorEl: HTMLElement | null;
    item?: DropdownItem | null;
  };
  us?: boolean;
}

interface DropdownState {
  deletionOpen: boolean;
}

type IssueMutationInput = {
  title?: string;
  number?: string;
  format?: string;
  variant?: string;
  releasedate?: string;
  pages?: number;
  price?: number;
  currency?: string;
  isbn?: string;
  limitation?: string;
  addinfo?: string;
  series?: DropdownItem["series"];
  verified?: boolean;
  collected?: boolean;
};

class Dropdown extends React.Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props);

    this.state = {
      deletionOpen: false,
    };
  }

  render() {
    const selectedItem = this.props.item ?? this.props.EditDropdown?.item;
    if (!selectedItem || !this.props.session) return null;

    const isUsIssue =
      this.props.level === HierarchyLevel.ISSUE && Boolean(selectedItem.series?.publisher?.us);
    const canDelete =
      !isUsIssue ||
      (selectedItem.stories || []).every((story) => (story.children?.length || 0) === 0);
    const isIssueLevel = this.props.level === HierarchyLevel.ISSUE;
    const isVerified = Boolean(selectedItem.verified);
    const isCollected = Boolean(selectedItem.collected);

    return (
      <>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
          {resolveItemUs(selectedItem, this.props.level, Boolean(this.props.us)) ? (
            <ReimportActionButton
              item={selectedItem}
              level={this.props.level}
              onClose={this.props.handleClose}
              enqueueSnackbar={this.props.enqueueSnackbar}
            />
          ) : null}

          {isIssueLevel ? (
            <CollectionActionButton
              item={selectedItem}
              collected={isCollected}
              onClose={this.props.handleClose}
              enqueueSnackbar={this.props.enqueueSnackbar}
            />
          ) : null}

          {isIssueLevel ? (
            <VerifyActionButton
              item={selectedItem}
              verified={isVerified}
              onClose={this.props.handleClose}
              enqueueSnackbar={this.props.enqueueSnackbar}
            />
          ) : null}

          <Tooltip title={canDelete ? "Löschen" : "Löschen nicht möglich"}>
            <span>
              <IconButton
                aria-label="Löschen"
                disabled={!canDelete}
                onClick={() => this.handleDelete()}
                sx={actionButtonSx}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Bearbeiten">
            <IconButton
              aria-label="Bearbeiten"
              onClick={() => {
                const us = resolveItemUs(selectedItem, this.props.level, Boolean(this.props.us));
                this.props.navigate?.(
                  null,
                  "/edit" +
                    generateUrl(
                      selectedItem as unknown as import("../../types/domain").SelectedRoot,
                      us
                    )
                );
                this.props.handleClose?.();
              }}
              sx={actionButtonSx}
            >
              <EditNoteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <DeletionDialog
          handleClose={this.handleDeletionClose}
          open={this.state.deletionOpen}
          item={selectedItem}
        />
      </>
    );
  }

  handleDelete = () => {
    this.setState({
      deletionOpen: true,
    });

    this.props.handleClose?.();
  };

  handleDeletionClose = () => {
    this.setState({
      deletionOpen: false,
    });
  };
}

interface ActionMenuItemProps {
  item: DropdownItem;
  level?: string;
  verified?: boolean;
  collected?: boolean;
  onClose?: () => void;
  enqueueSnackbar?: DropdownProps["enqueueSnackbar"];
}

type ReimportScopeInput = {
  reimportScopeKind: ReimportScopeKind;
  publisherId?: string;
  seriesId?: string;
  issueId?: string;
};

function buildIssueMutationInput(item: DropdownItem): IssueMutationInput {
  const stripped = stripItem(structuredClone(item));
  const input: IssueMutationInput = {
    title: String(stripped.title || ""),
    number: String(stripped.number || ""),
    format: String(stripped.format || ""),
    releasedate: (stripped.releasedate as string) || "",
    pages: Number(stripped.pages || 0),
    price: Number(stripped.price || 0),
    currency: String(stripped.currency || ""),
    isbn: String(stripped.isbn || ""),
    limitation: String(stripped.limitation || ""),
    addinfo: String(stripped.addinfo || ""),
    series: (stripped.series as DropdownItem["series"]) || undefined,
    verified: Boolean(stripped.verified),
    collected: Boolean(stripped.collected),
  };

  const variant = String(stripped.variant || "");
  if (variant !== "") input.variant = variant;

  return input;
}

function formatGraphQLErrorMessage(error: unknown): string {
  const graphQLErrors = (error as { graphQLErrors?: Array<{ message?: string }> })?.graphQLErrors;
  if (!graphQLErrors || graphQLErrors.length === 0 || !graphQLErrors[0]?.message) return "";
  return ` [${graphQLErrors[0].message}]`;
}

function toPositiveId(value: unknown): string | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || Math.trunc(parsed) <= 0) return null;
  return String(Math.trunc(parsed));
}

function toReimportScopeInput(
  item: DropdownItem,
  level: string | undefined
): ReimportScopeInput | null {
  const id = toPositiveId(item.id);
  if (!id) return null;

  if (level === HierarchyLevel.PUBLISHER) {
    return {
      reimportScopeKind: ReimportScopeKind.Publisher,
      publisherId: id,
    };
  }

  if (level === HierarchyLevel.SERIES) {
    return {
      reimportScopeKind: ReimportScopeKind.Series,
      seriesId: id,
    };
  }

  if (level === HierarchyLevel.ISSUE) {
    return {
      reimportScopeKind: ReimportScopeKind.Issue,
      issueId: id,
    };
  }

  return null;
}

function ReimportActionButton(props: Readonly<ActionMenuItemProps>) {
  const [enqueueReimport] = useMutation(runAdminTask);
  const scopeInput = toReimportScopeInput(props.item, props.level);

  return (
    <Tooltip title="ID Sync">
      <span>
        <IconButton
          aria-label="ID Sync"
          disabled={!scopeInput}
          onClick={async () => {
            if (!scopeInput) {
              props.onClose?.();
              return;
            }

            try {
              const result = await enqueueReimport({
                variables: {
                  input: {
                    taskKey: "reimport-us",
                    dryRun: false,
                    ...scopeInput,
                  },
                },
              });

              const summary = result.data?.runAdminTask?.summary || "Reimport Job gestartet";
              props.enqueueSnackbar?.(summary, { variant: "success" });
            } catch (error) {
              props.enqueueSnackbar?.(
                `Reimport konnte nicht gestartet werden${formatGraphQLErrorMessage(error)}`,
                { variant: "error" }
              );
            } finally {
              props.onClose?.();
            }
          }}
          sx={{ ...actionButtonSx, width: "auto", px: 1, pr: 1.4 }}
        >
          <BadgeOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
}

function VerifyActionButton(props: Readonly<ActionMenuItemProps>) {
  const [editIssue] = useMutation(EDIT_ISSUE_STATUS_MUTATION);
  const label = props.verified ? "Falsifizieren" : "Verifizieren";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={async () => {
          const oldInput = buildIssueMutationInput(props.item);
          const nextInput = {
            ...oldInput,
            verified: !props.verified,
          };

          try {
            await editIssue({
              variables: {
                old: oldInput,
                item: nextInput,
              },
            });

            props.enqueueSnackbar?.(
              `${generateLabel(props.item as never)} erfolgreich ${label.toLowerCase()}`,
              {
                variant: "success",
              }
            );
          } catch (error) {
            props.enqueueSnackbar?.(
              `Ausgabe konnte nicht ${label.toLowerCase()} werden${formatGraphQLErrorMessage(error)}`,
              { variant: "error" }
            );
          } finally {
            props.onClose?.();
          }
        }}
        sx={actionButtonSx}
      >
        {props.verified ? <GppMaybeOutlinedIcon /> : <FactCheckOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

function CollectionActionButton(props: Readonly<ActionMenuItemProps>) {
  const [editIssue] = useMutation(EDIT_ISSUE_STATUS_MUTATION);
  const label = props.collected ? "Aus Sammlung entfernen" : "Zur Sammlung hinzufügen";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={async () => {
          const oldInput = buildIssueMutationInput(props.item);
          const nextInput = {
            ...oldInput,
            collected: !props.collected,
          };

          try {
            await editIssue({
              variables: {
                old: oldInput,
                item: nextInput,
              },
            });

            props.enqueueSnackbar?.(`${generateLabel(props.item as never)} ${label.toLowerCase()}`, {
              variant: "success",
            });
          } catch (error) {
            props.enqueueSnackbar?.(
              `Ausgabe konnte nicht ${label.toLowerCase()} werden${formatGraphQLErrorMessage(error)}`,
              { variant: "error" }
            );
          } finally {
            props.onClose?.();
          }
        }}
        sx={actionButtonSx}
      >
        {props.collected ? <BookmarkRemoveOutlinedIcon /> : <BookmarkAddOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

function resolveItemUs(
  item: DropdownItem,
  level: string | undefined,
  fallbackUs: boolean
): boolean {
  switch (level) {
    case HierarchyLevel.ISSUE:
      return Boolean(item.series?.publisher?.us);
    case HierarchyLevel.SERIES:
      return Boolean(item.publisher?.us);
    default:
      return item.us === null || item.us === undefined ? fallbackUs : Boolean(item.us);
  }
}

export default withContext(Dropdown);
