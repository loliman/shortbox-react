import type { FieldItem } from "./types";

export const storyDefault: FieldItem = {
  parent: {
    issue: {
      series: {
        title: "",
        volume: 1,
        publisher: {
          name: "",
        },
      },
      number: 0,
    },
    number: 0,
  },
  individuals: [],
  addinfo: "",
  part: "",
  exclusive: false,
};

export const coverDefault: FieldItem = {
  parent: {
    issue: {
      series: {
        title: "",
        volume: 1,
        publisher: {
          name: "",
        },
      },
      number: "0",
      variant: "",
    },
    number: 0,
  },
  individuals: [],
  addinfo: "",
  number: 0,
  exclusive: false,
};

export function cloneFieldItem<T>(item: T): T {
  return structuredClone(item);
}
