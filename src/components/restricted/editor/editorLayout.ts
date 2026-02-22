import { alpha, type Theme } from "@mui/material/styles";

export const editorSectionSx = (theme: Theme) => ({
  px: { xs: 1.25, sm: 1.75 },
  py: { xs: 1.25, sm: 1.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.45)" : "0 1px 3px rgba(0, 0, 0, 0.08)",
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.96)} 0%, ${alpha(
    theme.palette.background.default,
    0.96
  )} 100%)`,
});
