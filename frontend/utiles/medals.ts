export type Medal = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
};

export const MEDALS: Medal[] = [
  {
    id: "debutant",
    label: "Débutant",
    emoji: "🥉",
    description: "Terminer tous les niveaux Facile",
    color: "#CD7F32",
  },
  {
    id: "avance",
    label: "Avancé",
    emoji: "🥈",
    description: "Terminer tous les niveaux Intermédiaire",
    color: "#C0C0C0",
  },
  {
    id: "pro",
    label: "Pro",
    emoji: "🥇",
    description: "Terminer tous les niveaux Difficile",
    color: "#FFD700",
  },
];

export const getMedalForNiveau = (niveau: string): Medal | null => {
  if (niveau === "Facile") return MEDALS[0];
  if (niveau === "Intermédiaire") return MEDALS[1];
  if (niveau === "Difficile") return MEDALS[2];
  return null;
};