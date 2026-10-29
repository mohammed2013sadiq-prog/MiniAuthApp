# MiniAuthApp

Application mobile React Native / Expo et API Express avec PostgreSQL. Le projet reste volontairement simple pour que chaque étape puisse être expliquée.

## Prérequis

- Node.js et npm
- Docker Desktop avec Docker Compose
- Expo SDK 58 (installé avec les dépendances mobiles), Expo Go sur un téléphone compatible, ou un émulateur Android/iOS

## Lancer la base de données avec Docker

PostgreSQL tourne dans un conteneur : il n'est pas nécessaire de l'installer directement sur l'ordinateur.

1. Si nécessaire, copiez `backend/.env.example` vers `backend/.env` (`Copy-Item backend\.env.example backend\.env` dans PowerShell).
2. À la racine du projet, démarrez le conteneur :

   ```bash
   docker compose --env-file backend/.env up -d db
   ```

Le conteneur utilise les valeurs de `backend/.env`. Le mot de passe présent dans ce fichier est destiné au développement local : remplacez-le si nécessaire et gardez `DB_PASSWORD` identique côté API et côté conteneur. Le port PostgreSQL est accessible uniquement depuis cet ordinateur. Les données restent dans le volume Docker `postgres_data`, même après l'arrêt du conteneur.

Pour arrêter le conteneur sans supprimer les données :

```bash
docker compose stop db
```

## Lancer le backend

Le serveur Express s'exécute localement avec Node.js et se connecte au port PostgreSQL exposé par Docker :

   ```bash
   cd backend
   npm install
   npm run dev
   ```

L'API écoute par défaut sur `http://localhost:3002` pour éviter les conflits avec les ports 3000 et 3001 déjà utilisés par d'autres services sur cette machine. Au premier démarrage, Sequelize crée la table `users`. Remplacez aussi `JWT_SECRET` dans `backend/.env` par une longue valeur privée avant toute utilisation réelle. Ne partagez et ne commitez jamais `.env`.

### Tester l'API

Utilisez Postman ou `curl.exe` (les commandes ci-dessous fonctionnent dans PowerShell) :

```bash
curl.exe -X POST http://localhost:3002/register -H "Content-Type: application/json" -d '{"name":"Sam","email":"sam@example.com","password":"secret123"}'
curl.exe -X POST http://localhost:3002/login -H "Content-Type: application/json" -d '{"email":"sam@example.com","password":"secret123"}'
curl.exe http://localhost:3002/users -H "Authorization: Bearer VOTRE_TOKEN"
```

Les routes sont `POST /register`, `POST /login` et `GET /users`. La dernière route exige le token renvoyé par la connexion. Le mot de passe n'est jamais renvoyé à l'application : la base stocke uniquement son hash.

## Lancer l'application mobile

Dans un autre terminal :

```bash
cd mobile
npm install
npm start
```

Scannez le QR code avec Expo Go ou ouvrez le projet dans un émulateur.

Le mobile détecte automatiquement l'adresse de l'ordinateur hôte Expo en mode développement. Sur l'émulateur Android, il utilise `10.0.2.2` si l'adresse Expo n'est pas disponible ; sur iOS Simulator ou le web, il utilise `localhost`. Le téléphone physique et l'ordinateur doivent être sur le même réseau Wi-Fi. Si nécessaire, copiez `mobile/.env.example` vers `mobile/.env` et renseignez l'adresse IP locale de l'ordinateur, par exemple `EXPO_PUBLIC_API_URL=http://192.168.1.20:3002`, puis redémarrez Expo avec `npx expo start --lan -c`. Pour vérifier l'API depuis le navigateur du téléphone, ouvrez `http://ADRESSE_IP_DU_PC:3002/`.

## Parcours du code

- `backend/src/server.js` configure Express, connecte PostgreSQL et démarre l'API.
- `backend/src/models/user.model.js` décrit la table User et ses champs.
- `backend/src/controllers/auth.controller.js` crée un compte, vérifie le mot de passe et génère le token.
- `backend/src/middleware/auth.middleware.js` valide le token avant la route protégée.
- `backend/src/controllers/user.controller.js` renvoie les utilisateurs sans leurs mots de passe.
- `mobile/app/register.js` et `mobile/app/login.js` contiennent les formulaires et les appels API.
- `mobile/src/store/authStore.js` conserve l'état utilisateur avec Zustand.
- `mobile/src/utils/storage.js` sauvegarde le token dans SecureStore.
- `mobile/app/users.js` charge puis affiche les utilisateurs dans une FlatList.

## Sécurité et limites

Les mots de passe sont hashés avec bcryptjs et les tokens sont conservés avec Expo SecureStore. Pour une démonstration locale, CORS est ouvert ; avant un vrai déploiement, limitez les origines autorisées, utilisez HTTPS et configurez les secrets via l'environnement d'hébergement.
