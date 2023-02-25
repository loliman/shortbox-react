import React from "react";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Button from "@material-ui/core/Button";
import {withContext} from "./generic";

function Cookies(props) {
   if(props.cookies.get("cookiesAccepted") === "true" || props.cookies.get("cookiesAccepted") === "false")
        return null;

    return (
        <SnackbarContent
            id="cookieHint"
            message={
                <span>Shortbox verwendet Cookies von Google Analytics um die Leistung der Seite zu analysieren.
                    Nähere Informationen dazu und zu Ihren Rechten als Nutzer von Shortbox finden Sie in
                    unserer <u><span className="cookieSpanLink"
                                  onMouseDown={(e) => props.navigate(e, e, "/privacy")}>Datenschutzerklärung</span></u> am Ende der Seite.</span>
            }
            action={[
                <Button  key={"cookieHintAccepted"} variant={"contained"} onMouseDown={(e) => acceptCookies(props.cookies)}>
                    Einverstanden
                </Button>,
                <Button  style={{marginLeft:"5px"}} key={"cookieHintDeclined"} variant={"contained"} href={"www.google.com"} onMouseDown={(e) => declineCookies(props.cookies)}>
                    Nicht einverstanden
                </Button>,
            ]}
        />
    );
}

function acceptCookies(cookies) {
    cookies.set('cookiesAccepted', 'true');
    window.location.reload();
}

function declineCookies(cookies) {
    cookies.set('cookiesAccepted', 'false');
    window.location.reload();
}

export default withContext(Cookies);
