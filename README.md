🧩 MazeMind — Labyrinthe Intelligent Évolutif
Une application mobile Android de jeu de labyrinthe intelligent, générée procéduralement par algorithmes d'IA, avec un système de progression, de score et de médailles automatiques.

> Projet universitaire — Licence Génie Logiciel | ISIMA Mahdia |  
> Équipe : Lobna Kazdar · Sirine Merdessi · Malek Hammami

## Aperçu :

MazeMind est un jeu de labyrinthe mobile Full Stack où chaque partie génère un labyrinthe **unique** grâce à l'algorithme **DFS**. Le joueur progresse à travers **13 niveaux** répartis sur 3 modes de difficulté, avec un système de score basé sur le temps et les pas, et un système de **médailles automatiques** côté backend.

## Fonctionnalités:

- **Génération procédurale** — chaque labyrinthe est unique (algorithme DFS)
  **3 modes de difficulté** :
  - Facile — 3 niveaux, sans timer, sans obstacles
  - Intermédiaire — 5 niveaux, avec timer
  - Difficile — 5 niveaux, timer + obstacles intelligents
- **Score intelligent** — basé sur les pas, le temps et la difficulté
- **Système de médailles** — Débutant / Avancé / Pro, déclenchés automatiquement
- **Authentification JWT** — inscription, connexion, sessions sécurisées
  **Profil utilisateur** — avatar personnalisable, score total, médailles
- **Historique des parties** — suivi de la progression

## Architecture :
Frontend (React Native)
↓
API REST (Express.js)
↓
Module IA (DFS + BFS)
↓
MongoDB Atlas (Cloud)

## Technologies:

 Frontend : React Native CLI · TypeScript 
 Navigation : React Navigation 
 Stockage local : AsyncStorage 
 Backend : Node.js Express.js 
 Authentification : JWT · bcrypt 
 Base de données : MongoDB Atlas (Cloud) 
 Algorithmes : DFS (génération) · BFS (résolution) 
 Déploiement : Render.com 

 ## Structure du projet :
 Maze-Mind/
├── frontend/
│ ├── screens/ # Écrans (Login, Home, Game, Profile...)
│ ├── components/ # Composants réutilisables
│ ├── utils/ # api.js, storage.js
│ └── navigation/ # Stack Navigator
├── backend/
│ ├── controllers/ # Logique métier
│ ├── routes/ # Endpoints REST
│ ├── models/ # Schémas Mongoose
│ ├── ai/ # Algorithmes DFS, BFS
│ └── middlewares/ # verifyToken.js
└── android/ # Build Android

## Installation & Lancement

 **Prérequis**
- Node.js ≥ 18
- Android Studio + Android SDK
- Java JDK 17
- Un émulateur Android ou un appareil physique

 **Cloner le repo**
```bash
git clone https://github.com/cyrrr-mr/Maze-Mind.git
cd Maze-Mind
```

**Installer les dépendances frontend**
```bash
npm install
```

**Configurer le backend**
```bash
cd backend
npm install
```
Créer un fichier `.env` dans `/backend` :
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
PORT=5000
```

**Lancer le backend**
```bash
cd backend
node server.js
```

**Lancer l'application**
```bash
# Dans le dossier racine
npm start

# Dans un second terminal
npm run android
```

---

**Backend en production**

Le backend est déployé sur **Render.com** :  
🔗 `https://maze-mind.onrender.com`

---

## Algorithmes

### DFS — Génération du labyrinthe
- Initialise une grille pleine de murs
- Explore récursivement les cellules non visitées
- Supprime progressivement les murs
- Garantit un chemin unique · Complexité : **O(n²)**

### BFS — Résolution & Score
- Calcule le chemin optimal entre départ et sortie
- Sert de référence pour calculer l'efficacité du joueur
- Protège les cellules du chemin avant placement des obstacles (mode Difficile)

### Formule de Score

Score = (StepScore + TimeBonus) × DifficultyMultiplier

DifficultyMultiplier : Facile ×1.0 | Intermédiaire ×1.5 | Difficile ×2.0

##  Système de Médailles

| Médaille | Condition |
|  Débutant | Terminer tous les niveaux Facile |
|  Avancé | Terminer tous les niveaux Intermédiaire |
|  Pro | Terminer tous les niveaux Difficile |

> Déclenchement automatique côté backend — non falsifiable côté client.

---

##  Sécurité

- Authentification par **JWT** (token signé, vérifié à chaque requête)
- Mots de passe hashés avec **bcrypt** (10 rounds)
- Variables sensibles dans **`.env`** (exclu du repo via `.gitignore`)
- **IP Whitelist** MongoDB Atlas restreinte au serveur Render

