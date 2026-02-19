import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import type { SxProps, Theme } from "@mui/material/styles";

interface FilterSwitchProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
  sx?: SxProps<Theme>;
}

function FilterSwitch({ checked, label, onToggle, sx }: FilterSwitchProps) {
  return (
    <FormControlLabel
      sx={sx}
      control={<Switch checked={checked} onChange={onToggle} color="secondary" />}
      label={label}
    />
  );
}

export default FilterSwitch;
