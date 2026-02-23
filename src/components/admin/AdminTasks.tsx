import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMutation, useQuery } from "@apollo/client";
import { adminTasks } from "../../graphql/queriesTyped";
import { releaseAllAdminTaskLocks, runAdminTask } from "../../graphql/mutationsTyped";
import { withContext } from "../generic";
import Layout from "../Layout";
import { PlayArrowOutlined } from "@mui/icons-material";

type SnackbarVariant = "success" | "error" | "warning" | "info";

type AdminTasksProps = {
  enqueueSnackbar?: (message: string, options?: { variant?: SnackbarVariant }) => void;
};

const MAX_DETAIL_CHARS = 120000;

const formatDateTime = (value?: string | null): string => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("de-DE");
};

const trimDetails = (value?: string | null): { text: string; truncated: boolean } => {
  const details = String(value || "");
  if (details.length <= MAX_DETAIL_CHARS) {
    return { text: details, truncated: false };
  }

  return {
    text: details.slice(0, MAX_DETAIL_CHARS),
    truncated: true,
  };
};

type RunLike = {
  status?: string | null;
  summary?: string | null;
  details?: string | null;
  finishedAt?: string | null;
};

type VisualState = "queued" | "running" | "success" | "failed" | "missing";

const getWorkerStateFromDetails = (details?: string | null): string | null => {
  if (!details) return null;
  try {
    const parsed = JSON.parse(details) as { state?: unknown };
    return typeof parsed.state === "string" ? parsed.state : null;
  } catch {
    return null;
  }
};

const resolveVisualState = (run: RunLike | null | undefined): VisualState => {
  if (!run) return "missing";

  const summary = String(run.summary || "").toLowerCase();
  const workerState = getWorkerStateFromDetails(run.details);

  if (!run.finishedAt || summary.includes("queued") || summary.includes("running")) {
    if (workerState === "running" || summary.includes("running")) return "running";
    if (workerState === "queued" || summary.includes("queued")) return "queued";
  }

  if (run.status === "FAILED" || workerState === "failed-awaiting-retry") return "failed";
  if (run.status === "SUCCESS") return "success";
  return "missing";
};

const resolveStatusCircleSx = (state: VisualState) => {
  const base = {
    width: 16,
    height: 16,
    borderRadius: "999px",
    border: "1px solid",
    borderColor: "rgba(0,0,0,0.12)",
  };

  if (state === "running") {
    return {
      ...base,
      backgroundColor: (theme: {
        palette: { mode: string; success: { main: string; light: string } };
      }) =>
        theme.palette.mode === "dark" ? theme.palette.success.light : theme.palette.success.main,
      animation: "admin-run-pulse 1.3s ease-in-out infinite",
      borderColor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.12)",
      boxShadow: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark"
          ? "0 0 0 0 rgba(134, 239, 172, 0.75)"
          : "0 0 0 0 rgba(46, 125, 50, 0.65)",
      "@keyframes admin-run-pulse": {
        "0%": {
          transform: "scale(0.95)",
          boxShadow: "0 0 0 0 rgba(134, 239, 172, 0.75)",
        },
        "70%": {
          transform: "scale(1)",
          boxShadow: "0 0 0 7px rgba(134, 239, 172, 0)",
        },
        "100%": {
          transform: "scale(0.95)",
          boxShadow: "0 0 0 0 rgba(134, 239, 172, 0)",
        },
      },
    };
  }

  if (state === "queued") {
    return {
      ...base,
      backgroundColor: (theme: {
        palette: { mode: string; success: { light: string; main: string } };
      }) => (theme.palette.mode === "dark" ? "#bbf7d0" : "#8fdc8f"),
      borderColor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.12)",
    };
  }
  if (state === "success") {
    return {
      ...base,
      backgroundColor: (theme: {
        palette: { mode: string; success: { light: string; main: string } };
      }) =>
        theme.palette.mode === "dark" ? theme.palette.success.light : theme.palette.success.main,
      borderColor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.12)",
    };
  }
  if (state === "failed") {
    return {
      ...base,
      backgroundColor: (theme: {
        palette: { mode: string; error: { light: string; main: string } };
      }) => (theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.main),
      borderColor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.12)",
    };
  }
  return {
    ...base,
    backgroundColor: (theme: {
      palette: { mode: string; warning: { light: string; main: string } };
    }) =>
      theme.palette.mode === "dark" ? theme.palette.warning.light : theme.palette.warning.main,
    borderColor: (theme: { palette: { mode: string } }) =>
      theme.palette.mode === "dark" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.12)",
  };
};

const resolveVisualStateLabel = (state: VisualState): string => {
  if (state === "queued") return "QUEUED";
  if (state === "running") return "RUNNING";
  if (state === "success") return "SUCCESS";
  if (state === "failed") return "FAILED";
  return "MISSING";
};

const resolveAggregateTaskState = (runs: Array<RunLike | null | undefined>): VisualState => {
  if (!runs || runs.length === 0) return "missing";
  const states = runs.map((run) => resolveVisualState(run));
  if (states.includes("running")) return "running";
  if (states.includes("queued")) return "queued";
  if (states.includes("failed")) return "failed";
  if (states.includes("success")) return "success";
  return "missing";
};

function AdminTasksPage(props: Readonly<AdminTasksProps>) {
  const [runningTaskKey, setRunningTaskKey] = React.useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(adminTasks, {
    variables: { limitRuns: 10 },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const [runTask] = useMutation(runAdminTask);
  const [releaseLocks, { loading: releasingLocks }] = useMutation(releaseAllAdminTaskLocks);

  const tasks = data?.adminTasks || [];

  const runSelectedTask = async (taskKey: string, dryRun: boolean) => {
    setRunningTaskKey(taskKey + (dryRun ? ":dry" : ":run"));

    try {
      const result = await runTask({
        variables: {
          input: {
            taskKey,
            dryRun,
          },
        },
      });

      const run = result?.data?.runAdminTask;
      const status = run?.status || "UNKNOWN";
      const summary = run?.summary || "";

      if (status === "SUCCESS") {
        props.enqueueSnackbar?.(`Task ${taskKey} abgeschlossen. ${summary}`, {
          variant: "success",
        });
      } else {
        props.enqueueSnackbar?.(`Task ${taskKey} fehlgeschlagen. ${summary}`, {
          variant: "error",
        });
      }
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : "Unbekannter Fehler";
      props.enqueueSnackbar?.(`Task ${taskKey} fehlgeschlagen: ${message}`, {
        variant: "error",
      });
    } finally {
      setRunningTaskKey(null);
      await refetch({ limitRuns: 10 });
    }
  };

  const releaseAllLocksNow = async () => {
    try {
      const result = await releaseLocks();
      const removedJobs = Number(result?.data?.releaseAllAdminTaskLocks || 0);
      if (removedJobs > 0) {
        props.enqueueSnackbar?.(
          `${removedJobs} Admin-Job(s) wurden freigegeben und aus der Queue entfernt.`,
          { variant: "success" }
        );
      } else {
        props.enqueueSnackbar?.("Keine Admin-Jobs zum Freigeben/Entfernen gefunden.", {
          variant: "info",
        });
      }
    } catch (releaseError) {
      const message = releaseError instanceof Error ? releaseError.message : "Unbekannter Fehler";
      props.enqueueSnackbar?.(`Locks konnten nicht freigegeben werden: ${message}`, {
        variant: "error",
      });
    } finally {
      await refetch({ limitRuns: 10 });
    }
  };

  return (
    <Layout>
      <CardHeader
        title="Adminpanel"
        action={
          <Tooltip title="Alle Admin-Jobs entsperren und direkt aus der Queue entfernen">
            <span>
              <Button
                size="small"
                aria-label="Release Jobs"
                color="primary"
                disabled={releasingLocks}
                sx={{ minWidth: 0, width: 32, height: 32, p: 0 }}
                onClick={releaseAllLocksNow}
              >
                <LockOpenIcon fontSize="small" />
              </Button>
            </span>
          </Tooltip>
        }
      />

      <CardContent sx={{ pt: 1 }}>
        {loading ? <Typography>Lade Jobs...</Typography> : null}
        {error ? <Alert severity="error">Jobs konnten nicht geladen werden.</Alert> : null}

        {!loading && !error && tasks.length === 0 ? (
          <Alert severity="info">Es sind aktuell keine Jobs registriert.</Alert>
        ) : null}

        <Box>
          {tasks.map((task, idx) => {
            const taskKey = String(task?.key || "");
            const runs = (task?.runs || []).slice(0, 10);
            const aggregateState = resolveAggregateTaskState(runs);
            const runningDryKey = `${taskKey}:dry`;
            const runningRealKey = `${taskKey}:run`;
            const isLast = idx === tasks.length - 1;
            const borderRadius =
              idx === 0 ? (isLast ? "8px" : "8px 8px 0 0") : isLast ? "0 0 8px 8px" : "0";

            return (
              <Accordion
                key={String(task?.key || task?.id)}
                sx={{
                  borderRadius,
                  width: "auto",
                  maxWidth: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                  "& .MuiAccordionSummary-root": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
                  },
                  "& .MuiAccordionDetails-root": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      width: "100%",
                      my: 0.5,
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    sx={{ width: "100%", pr: 0.5 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {task?.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Key: {taskKey}
                      </Typography>
                      {task?.description ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                          {task.description}
                        </Typography>
                      ) : null}
                    </Box>

                    <Stack
                      direction="row"
                      spacing={0.25}
                      alignItems="center"
                      sx={{ flexWrap: "wrap" }}
                    >
                      <Tooltip title={`${resolveVisualStateLabel(aggregateState)}`}>
                        <Box sx={{ ...resolveStatusCircleSx(aggregateState), mr: 1 }} />
                      </Tooltip>
                      <Box sx={{ width: 8 }} />

                      <Tooltip
                        title={
                          runningTaskKey === runningDryKey ? "Dry-Run läuft" : "Dry-Run starten"
                        }
                      >
                        <span>
                          <Button
                            size="small"
                            aria-label="Dry-Run starten"
                            color="primary"
                            disabled={Boolean(runningTaskKey)}
                            sx={{ minWidth: 0, width: 32, height: 32, p: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              runSelectedTask(taskKey, true);
                            }}
                          >
                            <ScienceOutlinedIcon fontSize="small" />
                          </Button>
                        </span>
                      </Tooltip>

                      <Tooltip
                        title={runningTaskKey === runningRealKey ? "Run läuft" : "Live-Run starten"}
                      >
                        <span>
                          <Button
                            size="small"
                            aria-label="Live-Run starten"
                            color="primary"
                            disabled={Boolean(runningTaskKey)}
                            sx={{ minWidth: 0, width: 32, height: 32, p: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              runSelectedTask(taskKey, false);
                            }}
                          >
                            <PlayArrowOutlined fontSize="small" />
                          </Button>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0.5 }}>
                  <Typography variant="h6">Letzte Runs</Typography>

                  <Stack spacing={0.75}>
                    {runs.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Keine Runs vorhanden.
                      </Typography>
                    ) : null}

                    {runs.map((run, runIndex) => {
                      const runId = String(run?.id || "");
                      const details = trimDetails(run?.details || "");
                      const runVisualState = resolveVisualState(run);

                      return (
                        <React.Fragment key={runId}>
                          <Accordion
                            disableGutters
                            elevation={0}
                            sx={{
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
                              overflow: "hidden",
                              "&:before": { display: "none" },
                              "&.Mui-expanded": { margin: 0 },
                              "& .MuiAccordionSummary-root": {
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
                              },
                              "& .MuiAccordionDetails-root": {
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                minHeight: 40,
                                "& .MuiAccordionSummary-content": { my: 0, width: "100%" },
                                "& .MuiAccordionSummary-content.Mui-expanded": { my: 0 },
                              }}
                            >
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={0.75}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                sx={{ minWidth: 0 }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatDateTime(run?.startedAt)}
                                </Typography>
                                <Tooltip title={resolveVisualStateLabel(runVisualState)}>
                                  <Box sx={resolveStatusCircleSx(runVisualState)} />
                                </Tooltip>
                                <Chip
                                  size="small"
                                  variant={"outlined"}
                                  label={run?.dryRun ? "Dry" : "Live"}
                                />
                                <Typography variant="body2" sx={{ minWidth: 0 }}>
                                  {run?.summary}
                                </Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 0 }}>
                              <Box
                                component="pre"
                                sx={{
                                  mt: 0.25,
                                  mb: 0,
                                  p: 1,
                                  maxHeight: 180,
                                  overflow: "auto",
                                  backgroundColor: "action.hover",
                                  borderRadius: 1,
                                  fontSize: "0.75rem",
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                }}
                              >
                                {details.text || "(keine Details)"}
                              </Box>
                              {details.truncated ? (
                                <Typography
                                  variant="caption"
                                  color="warning.main"
                                  sx={{ mt: 0.5, display: "block" }}
                                >
                                  Details wurden im UI gekürzt.
                                </Typography>
                              ) : null}
                            </AccordionDetails>
                          </Accordion>
                          {runIndex < runs.length - 1 ? <Divider /> : null}
                        </React.Fragment>
                      );
                    })}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </CardContent>
    </Layout>
  );
}

export default withContext(AdminTasksPage);
