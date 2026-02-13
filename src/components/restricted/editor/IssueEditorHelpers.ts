interface ChangePayload {
  action?: string;
  option?: FieldItem;
  removedValue?: FieldItem;
  type?: string;
  role?: string;
  name?: string;
}

interface FieldItem {
  __typename?: string;
  pattern?: boolean;
  name?: string;
  type?: string[] | string;
  role?: string[] | string;
  [key: string]: unknown;
}

export function updateField(
  option: string | ChangePayload | null | undefined | FieldItem[],
  live: boolean,
  values: FieldItem[] | undefined,
  setFieldValue: (field: string, value: unknown) => void,
  field: string,
  pattern: string
) {
  if (typeof option !== "string" || option.trim() !== "") {
    if (live) {
      values = values || [];

      const arr = JSON.parse(JSON.stringify(values));

      if (arr.length === 0 || !arr[arr.length - 1].pattern) {
        const dummy: FieldItem = { pattern: true };
        dummy[pattern] = option;
        arr.push(dummy);
      } else {
        const dummy = arr[arr.length - 1];
        dummy[pattern] = option;
        arr[arr.length - 1] = dummy;
      }

      setFieldValue(field, arr);
    } else {
      let selected = JSON.parse(JSON.stringify(values || []));
      let previous: FieldItem[] | undefined;
      const payload = option as ChangePayload;

      switch (payload.action) {
        case "deselect-option":
        case "select-option":
          previous = selected.filter((v: FieldItem) => v.name === payload.option?.name);

          if (previous.length > 0) {
            if (payload.option?.__typename === "Appearance") {
              previous[0].type = payload.type;
              previous[0].role = payload.role;
            } else if (
              Array.isArray(previous[0].type) &&
              previous[0].type.filter((v: string) => v === payload.type).length === 0
            ) {
              previous[0].type.push(payload.type || "");
              if (Array.isArray(previous[0].role)) previous[0].role.push(payload.role || "");
            }
          } else {
            const value = payload.option as FieldItem;

            if (payload.option?.__typename === "Appearance") {
              value.type = payload.type;
              value.role = payload.role;
            } else {
              value.type = [payload.type];
              value.role = [payload.role];
            }

            selected.push(value);
          }
          break;

        case "remove-value":
          if ((payload.name || "").indexOf("appearances") > 0) {
            selected = selected.filter(
              (v: FieldItem) =>
                `${v.name}${v.type}` !== `${payload.removedValue?.name}${payload.type}`
            );
          } else {
            previous = selected.filter((v: FieldItem) => v.name === payload.removedValue?.name);
            if (previous.length > 0) {
              if (Array.isArray(previous[0].type))
                previous[0].type = previous[0].type.filter((v: string) => v !== payload.type);
            }
          }
          break;

        case "clear":
          if ((payload.name || "").indexOf("appearances") > 0) {
            selected = selected.filter((v: FieldItem) => v.type !== payload.type);
          } else {
            selected.forEach((s: FieldItem) => {
              if (Array.isArray(s.type)) s.type = s.type.filter((v: string) => v !== payload.type);
            });
          }
          break;

        case "create-option":
          selected.push({
            name: (values && values[values.length - 1]?.name) || "",
            type: [payload.type],
            role: [payload.role],
          });
          break;

        default:
          return;
      }

      selected = selected.filter(
        (s: FieldItem) => !s.pattern && Array.isArray(s.type) && s.type.length > 0
      );
      setFieldValue(field, selected);
    }
  }
}

export function getPattern(arr: FieldItem[] | null | undefined, pattern: string) {
  if (!arr || arr.length === 0 || !arr[arr.length - 1].pattern) return null;
  return arr[arr.length - 1][pattern];
}
