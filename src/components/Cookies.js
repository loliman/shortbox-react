import React from "react";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Button from "@material-ui/core/Button";
import {withCookies} from 'react-cookie';

function Cookies(props) {
    if(props.cookies.get("cookiesAccepted") === "true")
        return null;

    return (
        <SnackbarContent
            id="cookieHint"
            message={
                <span>Shortbox verwendet Cookies von Google Analytics um die Leistung der Seite zu analysieren –
                    nähere Informationen dazu und zu Ihren Rechten als Benutzer finden Sie in
                    unserer <a className="cookieSpanLink" href="/privacy">Datenschutzerklärung</a> am Ende der Seite.</span>
            }
            action={[
                <Button  key={"cookieHint"} variant={"contained"} onClick={() => acceptCookies(props.cookies)}>
                    Einverstanden
                </Button>,
            ]}
        />
    );
}

function acceptCookies(cookies) {
    cookies.set('cookiesAccepted', 'true');
}

export default withCookies(Cookies);
