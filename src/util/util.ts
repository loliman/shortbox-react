import type { Issue, Publisher, SelectedRoot, Series } from "../types/domain";

type TypedEntity = Publisher | Series | Issue;

export function wrapItem(item: TypedEntity): SelectedRoot {
  if (item.__typename === "Publisher") return { us: item.us ? item.us : false, publisher: item };

  if (item.__typename === "Series")
    return { us: item.publisher?.us ? item.publisher.us : false, series: item };

  return { us: item.series.publisher.us ? item.series.publisher.us : false, issue: item };
}

export function unwrapItem(item: SelectedRoot & { __typename?: string }) {
  if (item.__typename === "Publisher") return item.publisher;

  if (item.__typename === "Series") return item.series;

  return item.issue;
}

export function stripItem(item) {
  let stripped = structuredClone(item);

  stripped.__resolveType = undefined;
  stripped.__typename = undefined;

  if (stripped.series) {
    stripped.series.id = undefined;
    stripped.series.__resolveType = undefined;
    stripped.series.__typename = undefined;
    stripped.series.publisher.id = undefined;
    stripped.series.publisher.__resolveType = undefined;
    stripped.series.publisher.__typename = undefined;
  }

  if (stripped.publisher) {
    stripped.publisher.id = undefined;
    stripped.publisher.__typename = undefined;
    stripped.publisher.__resolveType = undefined;
  }

  return stripped;
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function decapitalize(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function romanize(num) {
  if (Number.isNaN(num)) return Number.NaN;

    let digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3;

  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return new Array(+digits.join("") + 1).join("M") + roman;
}

export function today() {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = String(date.getFullYear());

  return dd + "." + mm + "." + yyyy;
}
