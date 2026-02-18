import type { FieldItem } from "../../util/filterFieldHelpers";

export type FilterFormatOption = { name: string };
export type FilterDateOption = { date: string; compare: string };
export type FilterNumberOption = { number: string; compare: string; variant: string };

export interface FilterValues {
  formats: FilterFormatOption[];
  withVariants: boolean;
  releasedates: FilterDateOption[];
  publishers: FieldItem[];
  series: FieldItem[];
  numbers: FilterNumberOption[];
  arcs: string;
  individuals: FieldItem[];
  appearances: string;
  firstPrint: boolean;
  onlyPrint: boolean;
  onlyTb: boolean;
  exclusive: boolean;
  reprint: boolean;
  otherOnlyTb: boolean;
  onlyOnePrint: boolean;
  noPrint: boolean;
  onlyCollected: boolean;
  onlyNotCollected: boolean;
  sellable: boolean;
  noCover: boolean;
  noContent: boolean;
  and: boolean;
}

export interface FilterSubmitValues {
  formats?: string[];
  withVariants?: boolean;
  releasedates?: FilterDateOption[];
  publishers?: FieldItem[];
  series?: FieldItem[];
  numbers?: FilterNumberOption[];
  arcs?: string;
  individuals?: FieldItem[];
  appearances?: string;
  firstPrint?: boolean;
  onlyPrint?: boolean;
  onlyTb?: boolean;
  exclusive?: boolean;
  reprint?: boolean;
  otherOnlyTb?: boolean;
  onlyOnePrint?: boolean;
  noPrint?: boolean;
  onlyCollected?: boolean;
  onlyNotCollected?: boolean;
  sellable?: boolean;
  noCover?: boolean;
  noContent?: boolean;
  and?: boolean;
  us?: boolean;
}

export interface FilterPageProps {
  lastLocation?: { pathname?: string } | null;
  us: boolean;
  query?: { filter?: string } | null;
  session?: unknown;
  isDesktop?: boolean;
  navigate: (e: unknown, url: string, query?: Record<string, unknown>) => void;
}

export interface FilterFormikBag {
  values: FilterValues;
  setFieldValue: (field: string, value: unknown) => void;
}
