import React from "react";
import { Field, getIn } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import PaginatedQuery from "./PaginatedQuery";
import type { QueryCollection } from "../../types/graphql";
import type { DocumentNode, OperationDefinitionNode } from "graphql";
import type { SxProps, Theme } from "@mui/material/styles";

type OptionLike = Record<string, unknown> & {
  name?: string;
  title?: string;
  volume?: string | number;
  pattern?: boolean;
  type?: string | string[];
  role?: string | string[];
  [key: string]: any;
};

type AutocompleteChangeValue = any;

interface AutocompleteFieldProps {
  query?: DocumentNode;
  variables?: Record<string, unknown>;
  values?: OptionLike[];
  name: string;
  nameField?: string;
  disabled?: boolean;
  onChange?: (value: any, live?: any) => void;
  generateLabel?: (option: any) => string;
  [key: string]: any;
}

function AutocompleteField(props: AutocompleteFieldProps) {
  const { query, variables, values, name, disabled, ...rest } = props;
  const nameField = props.nameField || name.split(".").pop() || "name";
  const resolvedQuery = query;

  if (values) {
    return (
      <Field
        {...rest}
        disabled={disabled}
        hasQuery={false}
        name={name}
        nameField={nameField}
        options={values}
        component={FormikAutocompleteField}
        loading={false}
        loadingError={false}
      />
    );
  }

  if (!resolvedQuery) return null;

  return (
    <PaginatedQuery
      query={resolvedQuery}
      variables={variables}
      queryDeduplication={true}
      notifyOnNetworkStatusChange
    >
      {({ error, data, fetchMore, loading, fetching }) => {
        let optionsFromQuery: OptionLike[] = [];
        if (data) {
          const queryName = getQueryName(resolvedQuery);
          const raw = (data as Record<string, QueryCollection<OptionLike>>)[queryName];
          optionsFromQuery = normalizeOptions(raw);
        }

        return (
          <Field
            {...rest}
            disabled={disabled}
            hasQuery={true}
            name={name}
            nameField={nameField}
            options={optionsFromQuery}
            component={FormikAutocompleteField}
            loading={!disabled && loading && !fetching}
            loadingError={Boolean(error)}
            fetchMore={fetchMore}
          />
        );
      }}
    </PaginatedQuery>
  );
}

function normalizeOptions<T>(value: QueryCollection<T> | undefined): T[] {
  if (!value) return [];

  if (Array.isArray(value)) return value.filter(Boolean) as T[];

  return value.edges
    .map((edge: { node?: T | null } | null) => edge && edge.node)
    .filter(Boolean) as T[];
}

interface FieldBridge {
  name: string;
  value: any;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
}

interface FormBridge {
  touched: Record<string, any>;
  errors: Record<string, any>;
  setFieldValue: (field: string, value: any) => void;
}

interface FormikAutocompleteFieldProps {
  field: FieldBridge;
  form: FormBridge;
  nameField: string;
  options?: OptionLike[];
  loading?: boolean;
  loadingError?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  multiple?: boolean;
  allowCreate?: boolean;
  isMulti?: boolean;
  creatable?: boolean;
  type?: string;
  style?: React.CSSProperties;
  variant?: "filled" | "outlined" | "standard";
  placeholder?: string;
  generateLabel?: (option: OptionLike) => string;
  dropdownIcon?: React.ReactNode;
  fetchMore?: (e: React.UIEvent<HTMLElement>) => void;
  hasQuery?: boolean;
  textFieldSx?: SxProps<Theme>;
  inputAriaLabel?: string;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  onChange?: (value: any, live?: any) => void;
}

function FormikAutocompleteField(props: FormikAutocompleteFieldProps) {
  const {
    field,
    form,
    nameField,
    options,
    loading,
    loadingError,
    disabled,
    label,
    multiple,
    allowCreate,
    isMulti,
    creatable,
    type,
    style,
    variant,
    placeholder,
    generateLabel,
    dropdownIcon,
    fetchMore,
    hasQuery,
    textFieldSx,
    inputAriaLabel,
    onFocus,
    onBlur,
    onChange,
  } = props;

  const touched = getIn(form.touched, field.name);
  const error = getIn(form.errors, field.name);
  const showError = Boolean(touched && error);

  const cleanedOptions = (options || []).filter((o) => !o || !o.pattern);
  const currentValues = Array.isArray(field.value) ? field.value.filter((v) => !v.pattern) : [];
  const isMultiple = Boolean(multiple ?? isMulti);
  const canCreate = Boolean(allowCreate ?? creatable);
  const freeSolo = !isMultiple || canCreate;
  const shouldEmitLive = Boolean(hasQuery || canCreate || type);

  const byType = (item: OptionLike) => {
    if (!type) return true;

    if (Array.isArray(item.type))
      return item.type.includes(type) || (Array.isArray(item.role) && item.role.includes(type));

    return item.type === type || item.role === type;
  };

  const visibleValues = isMultiple ? currentValues.filter(byType) : [];

  const toOption = (value: unknown): OptionLike | null => {
    if (value === null || value === undefined) return null;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") return null;

      const existing = cleanedOptions.find(
        (opt) => optionKey(opt, nameField).toLowerCase() === trimmed.toLowerCase()
      );
      if (existing) return existing;

      if (canCreate) {
        const created: OptionLike = {};
        created[nameField] = trimmed;
        if (type) {
          created.type = [type];
          created.role = [type];
        }
        return created;
      }

      return null;
    }

    return value as OptionLike;
  };

  const singleValue = () => {
    if (isMultiple) return visibleValues;

    if (field.value === "" || field.value === null || field.value === undefined) return null;

    return toOption(field.value);
  };

  const handleInputChange = (_: React.SyntheticEvent, inputValue: string, reason: string) => {
    if (!shouldEmitLive) return;

    if (reason !== "input" && reason !== "clear") return;

    if (typeof field.value === "string" && field.value === inputValue) return;

    if (onChange) onChange(inputValue, true);
    else form.setFieldValue(field.name, inputValue);
  };

  const handleSingleChange = (_: React.SyntheticEvent, value: unknown) => {
    const selected = toOption(value);
    const nextValue = selected ? optionKey(selected, nameField) : "";

    if (typeof field.value === "string" && field.value === nextValue) return;

    if (onChange) onChange(selected, false);
    else form.setFieldValue(field.name, nextValue);
  };

  const handleMultiChange = (
    _: React.SyntheticEvent,
    value: unknown[],
    reason: string,
    details: { option?: unknown }
  ) => {
    const nextValues = (value || []).map((v) => toOption(v)).filter(Boolean) as OptionLike[];

    if (onChange) {
      if (type) {
        let action = null;
        if (reason === "selectOption") action = "select-option";
        else if (reason === "removeOption") action = "remove-value";
        else if (reason === "clear") action = "clear";
        else if (reason === "createOption") action = "create-option";

        if (action) {
          const payload: Record<string, unknown> = {
            action: action,
            name: field.name,
            type: type,
            role: type,
          };

          if (action === "select-option" || action === "create-option")
            payload.option =
              toOption(
                details && details.option ? details.option : nextValues[nextValues.length - 1]
              ) || undefined;

          if (action === "remove-value")
            payload.removedValue = toOption(details && details.option ? details.option : null);

          onChange(payload, false);
        }
      } else {
        onChange(nextValues);
      }
    } else {
      form.setFieldValue(field.name, nextValues);
    }
  };

  return (
    <div className="outerAutoComplete" style={style}>
      <Autocomplete
        multiple={isMultiple}
        freeSolo={freeSolo}
        clearOnBlur={false}
        disableClearable={false}
        filterSelectedOptions={false}
        disabled={disabled}
        loading={loading}
        options={cleanedOptions}
        value={singleValue()}
        popupIcon={dropdownIcon || undefined}
        slotProps={fetchMore ? { listbox: { onScroll: fetchMore } } : undefined}
        isOptionEqualToValue={(option, value) =>
          optionKey(option as OptionLike | string, nameField).toLowerCase() ===
          optionKey(value as OptionLike | string, nameField).toLowerCase()
        }
        getOptionLabel={(option) =>
          optionLabel(option as OptionLike | string, nameField, generateLabel)
        }
        noOptionsText={loadingError ? "Fehler!" : "Keine Ergebnisse gefunden"}
        loadingText="Lade..."
        onInputChange={handleInputChange}
        onChange={isMultiple ? (handleMultiChange as any) : handleSingleChange}
        onFocus={onFocus}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
          field.onBlur(e);
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={optionKey(option as OptionLike | string, nameField) + "_" + index}
              label={optionLabel(option as OptionLike | string, nameField, generateLabel)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant={variant}
            sx={textFieldSx}
            label={label}
            placeholder={placeholder ? placeholder.trim() : "Bitte wählen..."}
            inputProps={{
              ...params.inputProps,
              "aria-label": inputAriaLabel,
            }}
            error={showError}
            helperText={showError ? error : null}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}

function optionKey(option: OptionLike | string, nameField: string): string {
  if (typeof option === "string") return option;

  if (!option) return "";

  return String(option[nameField] || "");
}

function optionLabel(
  option: OptionLike | string,
  nameField: string,
  generateLabel?: (option: OptionLike) => string
): string {
  if (typeof option === "string") return option;

  if (!option) return "";

  let label = generateLabel ? generateLabel(option) : String(option[nameField] || "");
  if (typeof label !== "string") label = String(option[nameField] || "");

  return label.replace(/!!([^!]+)!!/g, "$1");
}

function getQueryName(query?: DocumentNode): string {
  if (!query) return "";

  const operation = query.definitions.find(
    (definition): definition is OperationDefinitionNode =>
      Boolean(definition) && definition.kind === "OperationDefinition"
  );
  if (!operation) return "";

  const firstSelection = operation.selectionSet?.selections?.[0];
  if (firstSelection && firstSelection.kind === "Field") {
    if (firstSelection.alias?.value) return firstSelection.alias.value;
    return firstSelection.name.value;
  }

  return "";
}

export default AutocompleteField;
