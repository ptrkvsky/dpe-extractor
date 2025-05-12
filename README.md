# DPE Validator

Une application moderne pour valider et analyser les Diagnostics de Performance Énergétique (DPE) des biens immobiliers.

## 📋 Vue d'ensemble

Cette application web permet de télécharger et analyser automatiquement des documents DPE, d'extraire les informations clés et de valider leur conformité aux normes réglementaires.

## ✨ Fonctionnalités

- **Téléchargement de PDF** : Interface simple pour télécharger les documents DPE
- **Extraction automatisée** : Analyse intelligente des données importantes du DPE
- **Validation des données** : Vérification complète de la cohérence et validité des informations
- **Interface utilisateur intuitive** : Affichage clair des résultats et des erreurs éventuelles
- **Exportation des résultats** : Possibilité d'exporter les données extraites en format JSON

## 🛠️ Technologies

- **Frontend** : [Next.js](https://nextjs.org/) avec TypeScript
- **UI Components** : [Shadcn/UI](https://ui.shadcn.com/)
- **State Management** : React Hooks
- **Parsing de PDF** : OpenAI Assistants API
- **Tests** : Vitest, Testing Library
- **Utilitaires** : date-fns, clsx, tailwind-merge

## 🚀 Démarrage

### Prérequis

- Node.js 18.x ou supérieur
- npm, yarn ou pnpm

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/dpe-validator.git
cd dpe-validator

# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
```

### Configuration

1. Créez un fichier `.env.local` à la racine du projet avec vos variables d'environnement :

```
OPENAI_API_KEY=votre-clé-api-openai
```

### Exécution en développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir l'application.

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Mode watch pour le développement
npm run test:watch

# Avec interface utilisateur
npm run test:ui

# Rapport de couverture
npm run test:coverage
```

## 📁 Structure du projet

```
src/
├── app/                # Routes Next.js et app router
├── components/         # Composants React réutilisables
│   ├── dpe-results.tsx # Affichage des résultats DPE
│   ├── file-uploader.tsx # Composant de téléchargement de fichiers
│   └── ui/             # Composants UI de base (Shadcn)
├── hooks/              # Hooks React personnalisés
├── lib/                # Fonctions utilitaires et logique métier
│   ├── types.ts        # Types TypeScript pour les données DPE
│   └── utils.ts        # Fonctions utilitaires et validation
├── services/           # Services API et logique métier
└── tests/              # Tests unitaires et d'intégration
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer DPE Validator, n'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add some amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
