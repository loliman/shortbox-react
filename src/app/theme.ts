import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
      light: "#2b2b2b",
      dark: "#000000",
    },
    secondary: {
      main: "#b12c4a",
      light: "#d45571",
      dark: "#7b2035",
    },
    background: {
      default: "#f3f5f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#152238",
      secondary: "#4b5565",
    },
    divider: alpha("#152238", 0.12),
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
          backgroundColor: theme.palette.primary.main,
          backgroundImage: "none",
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
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
  },
});
