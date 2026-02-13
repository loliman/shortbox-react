import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface FilterSwitchProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
}

function FilterSwitch({ checked, label, onToggle, className = "switchEditor" }: FilterSwitchProps) {
  return (
    <FormControlLabel
      className={className}
      control={<Switch checked={checked} onChange={onToggle} color="secondary" />}
      label={label}
    />
  );
}

export default FilterSwitch;
