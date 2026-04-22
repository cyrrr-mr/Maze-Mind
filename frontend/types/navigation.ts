export type RootStackParamList = {
  Splash:      undefined;
  Auth:        undefined;
  Inscription: undefined;
  Login:       undefined;
  Acceuil:     undefined;
  Niveaux:     undefined;
  Progression: { niveau: string };
  Play:        { niveau: string; level: number };
  Profil:      undefined;
  Win:         { niveau: string; level: number; time: number | null; score: number };
  Fail:        { niveau: string; level: number };
};