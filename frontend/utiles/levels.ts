// Nombre de niveaux par difficulté et ordre de progression
// (source unique de vérité, cf. cahier des charges 8.1)
export const NIVEAUX_ORDER = ["Facile", "Intermédiaire", "Difficile"] as const;

export const TOTAL_LEVELS: Record<string, number> = {
  Facile: 3,
  "Intermédiaire": 5,
  Difficile: 5,
};

export const nextNiveau = (niveau: string): string | null => {
  const idx = NIVEAUX_ORDER.indexOf(niveau as any);
  if (idx === -1 || idx === NIVEAUX_ORDER.length - 1) return null;
  return NIVEAUX_ORDER[idx + 1];
};
