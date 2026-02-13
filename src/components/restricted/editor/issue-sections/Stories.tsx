import React from "react";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import AddContainsButton from "./AddContainsButton";
import Contains from "./Contains";
import StoryFields from "./StoryFields";
import { storyDefault } from "./defaults";
import type { ContainsProps } from "./types";

function Stories(props: ContainsProps) {
  return (
    <Stack spacing={2}>
      <div>
        <CardHeader className="left" title="Geschichten" />
        <AddContainsButton type="stories" defaultItem={storyDefault} {...props} />
      </div>

      <Contains {...props} type="stories" fields={<StoryFields />} />
    </Stack>
  );
}

export default Stories;
