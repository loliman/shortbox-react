import React from "react";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import AddContainsButton from "./AddContainsButton";
import Contains from "./Contains";
import CoverFields from "./CoverFields";
import { coverDefault } from "./defaults";
import type { ContainsProps } from "./types";

function Covers(props: ContainsProps) {
  return (
    <Stack spacing={2}>
      <div>
        <CardHeader className="left" title="Covergalerie" />
        <AddContainsButton
          disabled={props.us}
          type="covers"
          defaultItem={coverDefault}
          {...props}
        />
      </div>

      <Contains {...props} type="covers" fields={<CoverFields />} />
    </Stack>
  );
}

export default Covers;
