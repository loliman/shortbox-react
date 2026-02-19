import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
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

const footerLinkSx = { px: 1, color: "text.secondary" };

export default function FooterLinks(props: Readonly<FooterLinksProps>) {
  const showExtendedContactText = !props.isPhonePortrait;

  return (
    <Box
      component="nav"
      aria-label="Footer"
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Link
        component="button"
        sx={footerLinkSx}
        onClick={() => props.navigate?.(null, "/contact")}
      >
        Kontakt
        {showExtendedContactText ? "/Fehler melden/Unterstützen" : ""}
      </Link>
      <Separator />
      <Link
        component="button"
        sx={footerLinkSx}
        onClick={() => props.navigate?.(null, "/impress")}
      >
        Impressum
      </Link>
      <Separator />
      <Link
        component="button"
        sx={footerLinkSx}
        onClick={() => props.navigate?.(null, "/privacy")}
      >
        Datenschutz
      </Link>
      <Separator />
      <FooterAuthLink
        loggedIn={props.loggedIn}
        navigate={props.navigate}
        enqueueSnackbar={props.enqueueSnackbar}
        handleLogout={props.handleLogout}
      />
    </Box>
  );
}

function Separator() {
  return (
    <Box component="span" sx={{ px: 0.5, color: "text.disabled" }}>
      |
    </Box>
  );
}
