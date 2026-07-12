#  Labyrinthe Intelligent Évolutif

Application mobile Android (React Native) de labyrinthe à génération procédurale, avec IA (DFS/BFS), progression multi-niveaux et système de médailles.

Projet réalisé dans le cadre du module *Développement Mobile / Génie Logiciel* — ISIMA Mahdia, 2025-2026.

**Équipe :** Lobna Kazdar (Frontend), Sirine Merdessi (Backend), Malek Hammami (IA)

---

##  Fonctionnalités

- Génération procédurale de labyrinthes par **DFS** (Depth-First Search), garantissant un chemin unique et solvable.
- Résolution optimale par **BFS** (Breadth-First Search), utilisée pour le score et pour protéger le chemin lors du placement des obstacles.
- **3 paliers de difficulté** :

  | Difficulté | Niveaux | Chrono | Obstacles | Multiplicateur de score |
  |---|---|---|---|---|
  |  Facile | 3 | Non | Non | x1.0 |
  |  Intermédiaire | 5 | Oui | Non | x1.5 |
  |  Difficile | 5 | Oui | Oui | x2.0 |

- **Progression conditionnelle** : chaque palier se débloque quand le précédent est entièrement terminé (Facile → Intermédiaire → Difficile).
- **Médailles automatiques** (Débutant / Avancé / Pro), attribuées et vérifiées côté backend pour éviter toute falsification côté client.
- Authentification par **JWT**, mots de passe hachés avec **bcrypt**.
- Déploiement backend automatisé sur **Render.com**, base de données **MongoDB Atlas**.

##  Architecture

```
Maze-Mind/
├── backend/          # Node.js + Express + MongoDB (Mongoose)
│   ├── ai/           # Génération (DFS), résolution (BFS), difficulté, obstacles
│   ├── controllers/  # auth, maze, performance
│   ├── models/       # User, Performance
│   └── routes/
├── frontend/         # React Native (TypeScript)
│   ├── screens/      # Auth, Login, Inscription, Acceuil, Progression, Play, Win, Fail, Profil
│   ├── components/   # MazeBoard, Joystick
│   └── utiles/       # api.ts, progress.ts, medals.ts, levels.ts
└── App.tsx           # Navigation (React Navigation - Stack)
```

**Principe important :** la progression, le score et les médailles sont une **source de vérité côté backend**, liée au compte utilisateur (`User.progress`, `User.medals`, `User.totalScore` en base MongoDB). L'appareil ne fait que mettre en cache la dernière réponse du serveur — il ne décide jamais seul de débloquer un niveau ou une médaille.

##  Installation

### Backend

```sh
cd backend
npm install
```

Créer un fichier `.env` :
```
MONGO_URI=<votre_connection_string_atlas>
JWT_SECRET=<votre_secret>
PORT=5000
```

```sh
npm start
```

### Frontend

```sh
npm install
npx react-native run-android   # ou run-ios
```

L'URL de l'API backend est définie dans `frontend/utiles/api.ts` (`BASE_URL`) — à adapter si vous changez d'hébergement.

## Algorithmes clés

- **Génération (DFS)** : `backend/ai/mazeGenerator.js`
- **Résolution (BFS)** : `backend/ai/pathfinding.js`
- **Difficulté par niveau** (taille, chrono, obstacles) : `backend/ai/difficultyManager.js`
- **Placement des obstacles** (Difficile uniquement) : chemin BFS protégé, obstacles placés aléatoirement sur les cellules restantes — `backend/ai/aiService.js`

##  Corrections apportées (juillet 2026)

- **Progression cassée entre niveaux** : le bouton "Niveau suivant" incrémentait le numéro de niveau sans jamais changer de palier de difficulté ni vérifier la limite (3 pour Facile, 5 pour Intermédiaire/Difficile). Terminer le niveau 3 de Facile envoyait donc vers un "niveau 4" inexistant au lieu du niveau 1 d'Intermédiaire.
- **Médailles incohérentes / progression d'un nouveau compte polluée par un ancien compte** : la progression, le score et les médailles étaient stockés uniquement en local sur l'appareil (AsyncStorage), sans lien réel avec le compte. Tout est maintenant synchronisé avec le backend (`POST /api/performances`, `GET /api/auth/profile`), qui est l'unique source de vérité.
- **Obstacles absents en Difficile / présents à tort en Intermédiaire** : le placement d'obstacles n'était en réalité jamais implémenté malgré le champ `obstacles` prévu. Il est désormais actif uniquement pour Difficile (chemin BFS protégé), et retiré d'Intermédiaire qui garde seulement le chrono.
- **Garde-fou côté serveur** : `/api/mazes/ai` refuse maintenant toute combinaison niveau/level hors des plages définies (ex. Facile niveau 4).

##  Stack technique

React Native (TypeScript) · Node.js / Express · MongoDB Atlas · Mongoose · JWT · bcrypt · Render.com
