import React from "react";
import { Form, Formik } from "formik";
import { search } from "../graphql/queriesTyped";
import { withContext } from "./generic";
import AutocompleteField from "./generic/AutocompleteField";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";

interface SearchBarProps {
  focus?: boolean;
  mobile?: boolean;
  tablet?: boolean;
  tabletLandscape?: boolean;
  us?: boolean;
  navigate?: (event: unknown, url: string, query?: unknown) => void;
  onFocus?: (
    event: React.FocusEvent<HTMLElement> | React.MouseEvent<HTMLElement> | null,
    focus: boolean
  ) => void;
  [key: string]: unknown;
}

class SearchBar extends React.Component<SearchBarProps> {
  render() {
    const { navigate, mobile, tablet, tabletLandscape, us } = this.props;
    const mobileHeader = Boolean(mobile || (tablet && !tabletLandscape));
    const isFocused = Boolean(this.props.focus);

    return (
      <Box
        sx={{
          width: isFocused ? "100%" : mobileHeader ? "58px" : "300px",
          transition: "all 0.2s ease-in-out",
          order: isFocused ? 0 : 2,
          maxWidth: isFocused ? "100%" : undefined,
        }}
      >
        <Formik initialValues={{ pattern: "" }} onSubmit={() => {}}>
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <AutocompleteField
                  query={search}
                  name="pattern"
                  placeholder={mobile || (tablet && !tabletLandscape) ? " " : "Suchen"}
                  variant="outlined"
                  onFocus={(e) => this.onFocus(e, true)}
                  onBlur={(e) =>
                    mobile || (tablet && !tabletLandscape) ? null : this.onFocus(e, false)
                  }
                  variables={{ pattern: values.pattern, us: us }}
                  onChange={(node, live) => {
                    if (!node) return;

                    if (live) {
                      if (values.pattern !== node) setFieldValue("pattern", node);
                    }
                    else {
                      setFieldValue("pattern", "");
                      globalThis.focus();
                      const activeElement = document.activeElement as HTMLElement | null;
                      if (activeElement) {
                        activeElement.blur();
                      }
                      this.onFocus(null, false);
                      navigate?.(null, node.url, us);
                    }
                  }}
                  dropdownIcon={<SearchIcon />}
                  style={{
                    width: "100%",
                    paddingRight: "0",
                  }}
                  generateLabel={(node) => getNodeType(node) + node.label}
                />
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  }

  onFocus = (
    e: React.FocusEvent<HTMLElement> | React.MouseEvent<HTMLElement> | null,
    focus: boolean
  ) => {
    this.props.onFocus?.(e, focus);
  };
}

function getNodeType(node: { type: string }) {
  switch (node.type) {
    case "publisher":
      return "!!Verlag!!";
    case "series":
      return "!!Serie!!";
    default:
      return "!!Ausgabe!!";
  }
}

export default withContext(SearchBar);
