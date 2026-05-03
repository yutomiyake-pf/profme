export const TAB_VALUES = [
  "mycard",
  "follow-requests",
  "endorsement-requests",
  "followers",
] as const;

export type TabValue = (typeof TAB_VALUES)[number];

export const DEFAULT_TAB: TabValue = "mycard";

export const TAB_QUERY_KEY = "tab";

export const parseTab = (value: string | undefined): TabValue =>
  (TAB_VALUES as readonly string[]).includes(value ?? "") ? (value as TabValue) : DEFAULT_TAB;
