export const cardThemes = [
  { id: "navy", label: "Navy" },
  { id: "rose", label: "Rose" },
  { id: "forest", label: "Forest" },
  { id: "gold", label: "Gold" },
  { id: "mono", label: "Mono" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "lavender", label: "Lavender" },
  { id: "mint", label: "Mint" },
  { id: "charcoal", label: "Charcoal" },
] as const;

export type CardTheme = (typeof cardThemes)[number]["id"];

// z.enum 用に id を非空 tuple として再エクスポート (cardThemes は固定なので as 安全)
export const cardThemeIds = cardThemes.map((t) => t.id) as unknown as readonly [
  CardTheme,
  ...CardTheme[],
];
