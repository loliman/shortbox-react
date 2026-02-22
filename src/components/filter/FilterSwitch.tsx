import React from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

interface FilterSwitchProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const FilterToggleSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  width: 62,
  height: 34,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    opacity: 1,
    backgroundColor: "rgba(100, 116, 139, 0.42)",
    border: "1px solid rgba(71, 85, 105, 0.7)",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-switchBase": {
    margin: 0,
    padding: 7,
    transitionDuration: "220ms",
    "&.Mui-checked": {
      transform: "translateX(28px)",
      color: "#ffffff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#22c55e",
        borderColor: "#16a34a",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
    backgroundColor: "#ffffff",
    width: 20,
    height: 20,
    margin: 0,
  },
}));

function FilterSwitch({ checked, label, onToggle, disabled = false, sx }: FilterSwitchProps) {
  return (
    <Box sx={sx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.25,
          px: 1.15,
          py: 0.5,
          minHeight: 48,
          borderRadius: 1.75,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.9)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
          opacity: disabled ? 0.6 : 1,
          "&:hover": {
            borderColor: "rgba(34,197,94,0.55)",
            boxShadow: "0 2px 9px rgba(34,197,94,0.16)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "text.primary",
            minWidth: 0,
            lineHeight: 1.25,
          }}
        >
          {label}
        </Typography>
        <FilterToggleSwitch
          checked={checked}
          onChange={onToggle}
          color="primary"
          disabled={disabled}
          inputProps={{ "aria-label": label }}
        />
      </Box>
    </Box>
  );
}

export default FilterSwitch;
