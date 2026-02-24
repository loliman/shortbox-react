import Box from "@mui/material/Box";
import { withContext } from "../generic";
import Dropdown from "./Dropdown";

interface EditButtonProps {
  session?: unknown;
  item?: unknown;
}

function EditButton(props: Readonly<EditButtonProps>) {
  if (!props.session) return null;

  return (
    <Box sx={{ display: "inline-flex" }}>
      <Dropdown item={props.item} />
    </Box>
  );
}

export default withContext(EditButton);
