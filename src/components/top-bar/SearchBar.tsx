import React, { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useQuery } from "@apollo/client";
import { search } from "../../graphql/queriesTyped";
import type { NodesQuery } from "../../graphql/typed-documents.generated";
import { withContext } from "../generic";

type SearchNode = NonNullable<NonNullable<NodesQuery["nodes"]>[number]>;
const MIN_QUERY_LENGTH = 2;

interface SearchBarProps {
  focus?: boolean;
  alignLeft?: boolean;
  isPhone?: boolean;
  isTablet?: boolean;
  isTabletLandscape?: boolean;
  compactLayout?: boolean;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: Record<string, unknown>) => void;
  onFocus?: (
    event: React.FocusEvent<HTMLElement> | React.MouseEvent<HTMLElement> | null,
    focus: boolean
  ) => void;
}

export function SearchBar(props: Readonly<SearchBarProps>) {
  const [pattern, setPattern] = useState("");
  const [debouncedPattern, setDebouncedPattern] = useState("");
  const isFocused = Boolean(props.focus);
  const mobileHeader =
    props.compactLayout ?? Boolean(props.isPhone || (props.isTablet && !props.isTabletLandscape));
  const queryPattern = debouncedPattern;
  const us = Boolean(props.us);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedPattern(pattern.trim());
    }, 250);

    return () => {
      window.clearTimeout(handle);
    };
  }, [pattern]);

  const { data, loading, error } = useQuery(search, {
    variables: { pattern: queryPattern, us },
    skip: queryPattern.length < MIN_QUERY_LENGTH,
    // Always hit the API after debounce, no client cache short-circuit.
    fetchPolicy: "no-cache",
  });

  const options = useMemo<SearchNode[]>(
    () =>
      queryPattern.length < MIN_QUERY_LENGTH
        ? []
        : (data?.nodes || [])
            .filter((node: SearchNode | null | undefined): node is SearchNode =>
              Boolean(node?.label && node?.url)
            )
            .slice(0, 50),
    [data?.nodes, queryPattern.length]
  );

  const handleFocus = (
    e: React.FocusEvent<HTMLElement> | React.MouseEvent<HTMLElement> | null,
    focus: boolean
  ) => {
    props.onFocus?.(e, focus);
  };

  return (
    <Box
      sx={{
        width: isFocused ? "100%" : mobileHeader ? 58 : 300,
        ml: props.alignLeft ? 0 : "auto",
        transition: "width 0.2s ease-in-out",
        maxWidth: isFocused ? "100%" : undefined,
      }}
    >
      <Autocomplete
        options={options}
        filterOptions={(x) => x}
        loading={loading}
        inputValue={pattern}
        noOptionsText={
          queryPattern.length < MIN_QUERY_LENGTH
            ? `Mindestens ${MIN_QUERY_LENGTH} Zeichen eingeben`
            : error
              ? "Fehler!"
              : "Keine Ergebnisse gefunden"
        }
        getOptionLabel={(option) =>
          typeof option === "string" ? option : `${getNodeType(option.type)} ${option.label || ""}`
        }
        isOptionEqualToValue={(a, b) => (a.url || "") === (b.url || "")}
        onInputChange={(_, value, reason) => {
          if (reason === "input" || reason === "clear") setPattern(value);
        }}
        onChange={(_, value) => {
          if (!value || typeof value === "string" || !value.url) return;

          setPattern("");
          const activeElement = document.activeElement as HTMLElement | null;
          activeElement?.blur();
          handleFocus(null, false);
          props.navigate?.(null, value.url);
        }}
        onFocus={(e) => handleFocus(e, true)}
        onBlur={(e) => (mobileHeader ? undefined : handleFocus(e, false))}
        popupIcon={<SearchIcon />}
        sx={(theme) => ({
          "& .MuiOutlinedInput-root": {
            color: "common.white",
            backgroundColor: "rgba(255, 255, 255, 0.18)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.58)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.82)",
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.common.white,
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.9)",
            opacity: 1,
          },
          "& .MuiSvgIcon-root": {
            color: "common.white",
          },
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={mobileHeader ? " " : "Suchen"}
            inputProps={{
              ...params.inputProps,
              "aria-label": "Suche",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  );
}

export function getNodeType(type?: string | null) {
  switch (type) {
    case "publisher":
      return "Verlag";
    case "series":
      return "Serie";
    default:
      return "Ausgabe";
  }
}

export default withContext(SearchBar);
