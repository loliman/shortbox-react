import { alpha, createTheme } from "@mui/material/styles";

export type AppThemeMode = "light" | "dark";

export const createAppTheme = (mode: AppThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#e5e7eb" : "#000000",
        light: mode === "dark" ? "#f8fafc" : "#2b2b2b",
        dark: mode === "dark" ? "#cbd5e1" : "#000000",
      },
      secondary: {
        main: "#b12c4a",
        light: "#d45571",
        dark: "#7b2035",
      },
      background: {
        default: mode === "dark" ? "#0f1115" : "#f3f5f9",
        paper: mode === "dark" ? "#161b22" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#e6edf7" : "#152238",
        secondary: mode === "dark" ? "#a8b3c5" : "#4b5565",
      },
      divider: mode === "dark" ? alpha("#94a3b8", 0.28) : alpha("#152238", 0.12),
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      subtitle1: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
    MuiAppBar: {
      styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: "#000000",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.getContrastText(theme.palette.primary.main),
            backgroundImage: "none",
            borderBottom: `1px solid ${
              theme.palette.mode === "dark"
                ? alpha("#94a3b8", 0.28)
                : alpha(theme.palette.common.white, 0.2)
            }`,
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: (Number(theme.shape.borderRadius) || 12) - 2,
          }),
        },
      },
      MuiChip: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: "hover",
          color: "inherit",
        },
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
          }),
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: (Number(theme.shape.borderRadius) || 12) - 2,
          }),
        },
      },
      MuiSkeleton: {
        defaultProps: {
          animation: "wave",
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: (Number(theme.shape.borderRadius) || 12) - 4,
            backgroundColor: alpha(theme.palette.text.primary, 0.08),
            "&::after": {
              background: `linear-gradient(90deg, transparent, ${alpha(
                theme.palette.common.white,
                theme.palette.mode === "dark" ? 0.16 : 0.42
              )}, transparent)`,
            },
          }),
        },
      },
      MuiCircularProgress: {
        defaultProps: {
          size: 20,
          thickness: 4,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.light,
          }),
        },
      },
    },
  });

export const appTheme = createAppTheme("light");
