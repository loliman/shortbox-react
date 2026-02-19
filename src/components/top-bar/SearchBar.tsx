import React, { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useQuery } from "@apollo/client";
import { search } from "../../graphql/queriesTyped";
import type { NodesQuery } from "../../graphql/typed-documents.generated";
import { withContext } from "../generic";

type SearchNode = NonNullable<NonNullable<NodesQuery["nodes"]>[number]>;
const MIN_QUERY_LENGTH = 2;

interface SearchBarProps {
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
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        size="small"
        disablePortal
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
        onBlur={(e) => handleFocus(e, false)}
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Suchen"
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
