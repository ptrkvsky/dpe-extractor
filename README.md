# Documentation de l'Application de Validation DPE

## Sommaire

1. [Introduction](#introduction)
2. [Architecture de l'Application](#architecture-de-lapplication)
3. [Composants Principaux](#composants-principaux)
4. [Flux de Données](#flux-de-données)
5. [API et Services](#api-et-services)
6. [Modèles de Données](#modèles-de-données)
7. [Tests](#tests)
8. [Configuration et Déploiement](#configuration-et-déploiement)
9. [Guide d'Utilisation](#guide-dutilisation)
10. [Annexes](#annexes)

## Introduction

L'Application de Validation DPE est un outil conçu pour analyser et valider les Diagnostics de Performance Énergétique (DPE) des biens immobiliers. Cette application permet aux utilisateurs de télécharger un fichier DPE (au format PDF ou image), d'extraire automatiquement les informations importantes et de vérifier leur conformité selon les normes en vigueur.

### Objectifs

- Simplifier la lecture et l'analyse des documents DPE
- Automatiser l'extraction des données clés
- Vérifier la validité et la conformité des informations
- Présenter les résultats de manière claire et visuelle

### Technologies Utilisées

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **IA**: OpenAI (GPT-4o) pour l'extraction des données
- **Tests**: Vitest

## Architecture de l'Application

L'application est construite avec Next.js, utilisant son architecture de routage et ses API Routes pour créer une application full-stack dans une seule base de code.

### Structure des Répertoires

```
/
├── components/           # Composants React réutilisables
│   ├── ui/               # Composants UI de base
│   └── upload/           # Composants liés au téléchargement de fichiers
├── hooks/                # Hooks React personnalisés
├── lib/                  # Fonctions utilitaires et services
│   ├── openai.ts         # Service d'intégration avec OpenAI
│   ├── types.ts          # Définitions de types TypeScript
│   └── utils.ts          # Fonctions utilitaires diverses
├── public/               # Ressources statiques
└── app/                  # Routes de l'application Next.js
    └── api/              # API Routes Next.js
        └── extract-dpe/  # Endpoint pour l'extraction DPE
```

## Composants Principaux

### DPEValidator

Le composant principal qui orchestre le processus de validation. Il gère l'état de l'application, coordonne le téléchargement des fichiers et affiche les résultats.

#### Fonctionnalités principales:

- Interface à onglets pour la navigation entre téléchargement et résultats
- Gestion des notifications via le système de toast
- Coordination des appels API pour l'extraction des données

### FileUploader

Gère l'interface de téléchargement de fichiers avec fonctionnalités de glisser-déposer.

#### Fonctionnalités principales:

- Support du glisser-déposer pour les fichiers
- Validation des types de fichiers (PDF et images)
- Interface visuelle interactive avec retour utilisateur

### DropZone

Composant d'interface pour la zone de dépôt de fichiers avec retour visuel.

#### Fonctionnalités principales:

- Retour visuel pour les actions de glisser-déposer
- Affichage adaptatif selon l'état (actif, fichier sélectionné, etc.)
- Intégration de sélection de fichier via dialogue natif

### DPEResults

Affiche les résultats de l'analyse DPE de manière claire et structurée.

#### Fonctionnalités principales:

- Présentation des informations générales du bien
- Affichage visuel des étiquettes énergétiques
- Liste des erreurs ou problèmes détectés
- Option d'impression du rapport

### EnergyLabel

Composant visuel pour afficher les étiquettes énergétiques selon les normes en vigueur.

#### Fonctionnalités principales:

- Affichage des classes énergétiques avec code couleur normalisé
- Support des étiquettes énergie et GES
- Gestion des cas d'erreur et d'informations manquantes

## Flux de Données

1. **Téléchargement du fichier**:

   - L'utilisateur télécharge un fichier PDF ou image via le composant FileUploader
   - Le fichier est validé côté client (type, taille)

2. **Traitement du fichier**:

   - Le fichier est envoyé au serveur via une requête POST à l'API endpoint `/api/extract-dpe`
   - Le fichier est converti en buffer et transmis à OpenAI pour analyse

3. **Extraction des données**:

   - OpenAI analyse le fichier et extrait les informations structurées
   - Les données sont converties en format JSON standardisé
   - Les classements énergétiques sont validés et corrigés si nécessaire

4. **Validation des données**:

   - Les données extraites sont validées selon des règles prédéfinies
   - Les erreurs ou problèmes sont identifiés et listés

5. **Affichage des résultats**:
   - Les données validées sont renvoyées au client
   - Le composant DPEResults affiche les informations de manière structurée
   - Les étiquettes énergétiques sont générées visuellement
   - Les erreurs sont présentées à l'utilisateur

## API et Services

### `/api/extract-dpe` (route.ts)

Endpoint principal pour l'extraction des données du DPE.

#### Méthode: POST

#### Paramètres:

- `file`: Fichier PDF ou image (FormData)

#### Réponse:

```json
{
  "data": {
    "adresse": "123 rue de Paris, 75001 Paris",
    "type_bien": "Appartement",
    "date_realisation": "2023-01-15",
    "date_validite": "2033-01-15",
    "consommation_energetique": 250,
    "classe_energetique": "E",
    "emissions_co2": 45,
    "classe_ges": "D",
    "cout_energetique_estime": {
      "min": 1200,
      "max": 1800
    }
  },
  "errors": [] // Liste des erreurs si présentes
}
```

### Service OpenAI (openai.ts)

Service d'intégration avec l'API OpenAI pour l'extraction des données à partir des documents DPE.

#### Fonctionnalités principales:

- Téléchargement sécurisé des fichiers vers OpenAI
- Création d'un assistant spécialisé dans l'extraction de DPE
- Analyse du document via GPT-4o avec accès aux outils de code et recherche de fichiers
- Extraction et nettoyage des données JSON depuis la réponse

## Modèles de Données

### DPEData (types.ts)

```typescript
export interface DPEData {
  adresse?: string;
  type_bien?: string;
  date_realisation?: string;
  date_validite?: string;
  consommation_energetique?: string | number;
  classe_energetique?: string;
  emissions_co2?: string | number;
  classe_ges?: string;
  cout_energetique_estime?: {
    min: number;
    max: number;
  };
}
```

### ValidationResult (types.ts)

```typescript
export interface ValidationResult {
  data: DPEData;
  errors: string[];
}
```

## Tests

L'application utilise Vitest pour les tests unitaires, notamment pour les fonctions utilitaires de validation et de formatage.

### utils.test.ts

Tests des fonctions utilitaires:

- Formatage de date
- Validation de date
- Validation des données DPE

## Configuration et Déploiement

### Prérequis

- Node.js (version recommandée: 16+)
- Clé API OpenAI avec accès à GPT-4o

### Variables d'Environnement

```
OPENAI_API_KEY=votre_clé_api_openai
```

### Installation

1. Cloner le dépôt
2. Installer les dépendances avec `npm install`
3. Configurer les variables d'environnement
4. Démarrer l'application en développement avec `npm run dev`

### Déploiement en Production

Pour le déploiement en production:

```bash
npm run build
npm run start
```

## Guide d'Utilisation

### Téléchargement d'un DPE

1. Accéder à l'application via un navigateur web
2. Sur l'onglet "Téléchargement", glisser-déposer un fichier DPE (PDF ou image) ou cliquer sur "Sélectionner un fichier"
3. Une fois le fichier sélectionné, cliquer sur "Valider le DPE"
4. Attendre que l'analyse soit complétée

### Lecture des Résultats

1. Une fois l'analyse terminée, l'application bascule automatiquement sur l'onglet "Résultats"
2. Les informations générales du bien sont affichées dans la première section
3. Les étiquettes énergétiques sont présentées visuellement
4. Si des problèmes sont détectés, ils sont listés en haut de la page
5. Pour imprimer le rapport, cliquer sur "Imprimer le rapport"

## Annexes

### Glossaire

- **DPE**: Diagnostic de Performance Énergétique, document obligatoire en France fournissant des informations sur la performance énergétique d'un bien immobilier.
- **Classe énergétique**: Classification de A à G indiquant la performance énergétique du bien (A étant la meilleure performance).
- **Classe GES**: Classification de A à G indiquant les émissions de gaz à effet de serre du bien.
- **kWh/m²/an**: Kilowattheure par mètre carré par an, unité de mesure de la consommation énergétique.
- **kg CO₂/m²/an**: Kilogramme de dioxyde de carbone par mètre carré par an, unité de mesure des émissions de gaz à effet de serre.

### Références

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation OpenAI](https://platform.openai.com/docs/guides/assistants)
- [Documentation React](https://reactjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
