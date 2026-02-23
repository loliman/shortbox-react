import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FooterAuthLink from "./FooterAuthLink";

type FooterLinksProps = {
  isPhonePortrait?: boolean;
  loggedIn?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  enqueueSnackbar?: (
    message: string,
    options?: { variant?: "success" | "error" | "warning" | "info" }
  ) => void;
  handleLogout?: () => void;
};

const footerButtonSx = { px: 0.75, color: "text.secondary", minWidth: 0 };

export default function FooterLinks(props: Readonly<FooterLinksProps>) {
  const showExtendedContactText = !props.isPhonePortrait;

  return (
    <Box
      component="nav"
      aria-label="Footer"
      sx={{
        color: "text.secondary",
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
        justifyContent={{ xs: "center", sm: "flex-end" }}
      >
        <Button
          type="button"
          size="small"
          variant="text"
          color="inherit"
          sx={footerButtonSx}
          onClick={() => props.navigate?.(null, "/contact")}
        >
          Kontakt
          {showExtendedContactText ? " / Fehler melden / Unterstützen" : ""}
        </Button>
        <Button
          type="button"
          size="small"
          variant="text"
          color="inherit"
          sx={footerButtonSx}
          onClick={() => props.navigate?.(null, "/impress")}
        >
          Impressum
        </Button>
        <Button
          type="button"
          size="small"
          variant="text"
          color="inherit"
          sx={footerButtonSx}
          onClick={() => props.navigate?.(null, "/privacy")}
        >
          Datenschutz
        </Button>
        <FooterAuthLink
          loggedIn={props.loggedIn}
          navigate={props.navigate}
          enqueueSnackbar={props.enqueueSnackbar}
          handleLogout={props.handleLogout}
        />
      </Stack>
    </Box>
  );
}
