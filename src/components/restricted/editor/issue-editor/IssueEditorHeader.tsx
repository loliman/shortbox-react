import React from "react";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import TitleLine from "../../../generic/TitleLine";

interface IssueEditorHeaderProps {
  header: string;
  id?: string | number;
  session?: unknown;
  edit?: boolean;
  us: boolean;
  onToggle: () => void;
}

function IssueEditorHeader({ header, id, session, edit, us, onToggle }: IssueEditorHeaderProps) {
  return (
    <CardHeader
      title={<TitleLine title={header} id={id} session={session} />}
      action={
        <FormControlLabel
          sx={{ m: 0 }}
          control={
            <Tooltip title={(us ? "Deutsche" : "US") + " Ausgabe"}>
              <Switch disabled={edit} checked={us} onChange={onToggle} color="secondary" />
            </Tooltip>
          }
          label="US"
        />
      }
    />
  );
}

export default IssueEditorHeader;
