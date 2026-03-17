import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import AddContainsButton from "./AddContainsButton";
import Contains from "./Contains";
import StoryFields from "./StoryFields";
import { storyDefault } from "./defaults";
import type { ContainsProps } from "./types";

function Stories(props: ContainsProps) {
  const [expandedStoryIndex, setExpandedStoryIndex] = React.useState<number | null>(null);
  const storyCount = Array.isArray(props.items) ? props.items.length : 0;

  React.useEffect(() => {
    if (storyCount === 0) {
      setExpandedStoryIndex(null);
      return;
    }

    setExpandedStoryIndex((prev) => {
      if (prev === null) return 0;
      if (prev >= storyCount) return storyCount - 1;
      return prev;
    });
  }, [storyCount]);

  return (
    <Stack spacing={2}>
      <Contains
        {...props}
        type="stories"
        fields={<StoryFields />}
        expandedStoryIndex={expandedStoryIndex}
        onStoryToggle={(index) => {
          setExpandedStoryIndex((prev) => (prev === index ? null : index));
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <AddContainsButton
          type="stories"
          defaultItem={storyDefault}
          {...props}
          onStoryAdded={(index) => {
            setExpandedStoryIndex(index);
          }}
        />
      </Box>
    </Stack>
  );
}

export default Stories;
