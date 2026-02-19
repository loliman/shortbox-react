import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#10223f",
      light: "#365b96",
      dark: "#0b172d",
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
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }),
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "20px 24px 8px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius - 2,
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius - 2,
          backgroundColor: alpha(theme.palette.common.white, 0.82),
        }),
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
          borderRadius: theme.shape.borderRadius - 2,
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          margin: 0,
          background:
            "radial-gradient(circle at 0% 0%, rgba(16, 34, 63, 0.05), transparent 45%), radial-gradient(circle at 100% 0%, rgba(177, 44, 74, 0.05), transparent 35%), " +
            theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      }),
    },
  },
});
