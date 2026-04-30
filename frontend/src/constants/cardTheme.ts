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
