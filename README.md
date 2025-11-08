# Fisheye - Plateforme de Photographes

> Une application web moderne et accessible pour découvrir les meilleurs travaux de photographes indépendants.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 📋 À propos du projet

**Fisheye** est un prototype fonctionnel d'une plateforme web permettant aux photographes indépendants de présenter leurs meilleur travaux. Ce projet a été réalisé dans le cadre d'une formation spécialisée en développement web, mettant l'accent sur l'**accessibilité**, la **modularité** et les **bonnes pratiques** JavaScript.

### Contexte

Le projet a été développé pour Techasite, une société de conseil en développement web et applications mobiles, à la demande du client FishEye. L'objectif était de créer un prototype fonctionnel conformément aux maquettes approuvées et aux exigences d'accessibilité strictes du client.

---

## 🎯 Objectifs pédagogiques

- ✅ Assurer l'**accessibilité** d'un site web (WCAG 2.1)
- ✅ Développer une application web **modulaire** avec des **design patterns**
- ✅ Écrire du code JavaScript **maintenable** et **professionnel**
- ✅ Gérer les **événements** d'un site web de manière efficace

---

## 🚀 Fonctionnalités

### 🏠 Page d'accueil

- Liste dynamique des photographes avec cartes détaillées
- Récupération des données via API Fetch (JSON)
- Navigation accessible au clavier
- Design responsive avec Flexbox et CSS Grid

### 👤 Pages photographes

- Affichage du profil complet du photographe
- **Galerie d'images et vidéos** gérée par une Media Factory
- Tri des médias (popularité, date, titre)
- Comptage des likes en temps réel
- Tarif journalier du photographe

### 📧 Formulaire de contact

- Modale accessible avec gestion du focus
- Validation des champs de formulaire
- Console logging des données soumises
- Fermeture fluide de la modale

### 🎞️ Lightbox

- Visualisation des médias en plein écran
- Navigation aux flèches clavier et boutons souris
- Gestion des images et vidéos
- Accessibilité complète au clavier

### 👍 Système de likes

- Incrémentation des likes par média
- Total des likes par photographe
- Limitation d'un like par utilisateur par média
- Affichage en temps réel

---

## 🛠️ Stack technique

| Technologie | Description |
|---|---|
| **HTML5** | Structure sémantique et accessible |
| **CSS3** | Layouts modernes (Flexbox, Grid) et responsive |
| **JavaScript Vanilla** | Pas de framework, code pur et performant |
| **Design Patterns** | Factory Method pour gestion des médias |
| **Fetch API** | Récupération des données JSON |
| **ESLint** | Linting et validation du code |

---

## 📁 Architecture du projet

```text
Fisheye/
├── index.html                 # Page d'accueil
├── photographer.html          # Page détail photographe
├── package.json              # Dépendances dev
├── eslint.config.mjs         # Configuration ESLint
│
├── assets/
│   ├── DM_Sans/              # Typographie
│   ├── icons/                # Icônes SVG
│   ├── images/               # Images statiques
│   └── media/
│       ├── image/            # Galerie d'images (format AVIF)
│       ├── video/            # Galerie de vidéos
│       └── photographers/    # Portraits des photographes
│
├── css/
│   ├── index.css             # Styles page d'accueil
│   ├── index.min.css         # Minifié
│   ├── photographer-page.css # Styles page photographe
│   └── photographer-page.min.css # Minifié
│
├── data/
│   └── photographers.json    # Données des photographes et médias
│
└── scripts/
    ├── app.js                # Point d'entrée principal
    ├── controller/
    │   └── Controller.js     # Logique de contrôle
    ├── models/
    │   ├── Model.js          # Modèle de données
    │   ├── Photographer.js   # Classe Photographer
    │   └── Media.js          # Classe Media
    ├── utils/
    │   ├── EventManager.js   # Gestion des événements
    │   └── TemplateManager.js # Gestion des templates
    ├── views/
    │   └── View.js           # Gestion des vues
    └── factories/
        ├── photographer.js   # Factory Photographer
        └── media.js          # Factory Media (Pattern Factory Method)
```

---

## 🔧 Installation et utilisation

### Prérequis

- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Node.js 16+ (pour le linting)

### 1. Cloner le repository

```bash
git clone https://github.com/Weavyx/Fisheye.git
cd Fisheye
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer l'application

```bash
# Ouvrir index.html dans votre navigateur
# Aucun serveur de développement nécessaire
```

### 4. Linting du code

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement les erreurs
npm run lint:fix
```

---

## ✨ Fonctionnalités d'accessibilité

Ce projet respecte les standards **WCAG 2.1** niveau AA :

- 🎯 **Navigation au clavier** complète
- 👁️ **Support des lecteurs d'écran** (ARIA labels, roles)
- 🏷️ **Textes alternatifs** complets pour les images
- 🎨 **Contraste** suffisant pour la lisibilité
- ⌨️ **Gestion intelligente du focus** (modales, lightbox)
- 📱 **Design responsive** pour tous les appareils
- 🔊 **Éléments interactifs** bien identifiés

### Validation d'accessibilité

Utilisation d'outils de validation :

- Validateurs WCAG en ligne
- Lecteurs d'écran (NVDA, JAWS)
- Navigation clavier exhaustive

---

## 📐 Design Patterns utilisés

### Factory Method (Media)

```javascript
// Créer des médias (images ou vidéos) de manière uniforme
const media = mediaFactory(mediaData);
```

Distinction automatique entre :

- **Images** (format AVIF) → balise `<img>`
- **Vidéos** (format MP4) → balise `<video>`

### MVC (Model-View-Controller)

- **Model** : Gestion des données (photographers.json)
- **View** : Affichage du contenu (templates HTML/CSS)
- **Controller** : Logique métier et événements

### Template Method

- Templates réutilisables pour cartes photographes
- Génération dynamique des éléments DOM

---

## 🎨 Approche CSS

### Méthodologie

- **Flexbox** pour les alignements et distributions
- **CSS Grid** pour les layouts complexes
- **Variables CSS** pour maintenir la cohérence
- **Media queries** pour la réactivité

### Optimisation

- Fichiers minifiés (`.min.css`)
- Suppression des styles non utilisés
- Format images optimisé (AVIF)

---

## 🧪 Étapes de développement

Le projet a été construit suivant ces étapes clés :

1. ✅ **Initialisation** - Compréhension de la base de code existante
2. ✅ **Récupération de données** - Fetch API pour charger photographers.json
3. ✅ **Page d'accueil** - Affichage dynamique des photographes
4. ✅ **Navigation** - Liens entre page d'accueil et pages photographes
5. ✅ **Contenu photographe** - Affichage profil + galerie de médias
6. ✅ **Modale de contact** - Formulaire accessible
7. ✅ **Lightbox** - Visualisation des médias
8. ✅ **Système de likes** - Incrémentation et comptage
9. ✅ **Tri des médias** - Sorting par popularité/date/titre
10. ✅ **Linting** - Validation du code avec ESLint

---

## 📊 Résultats et performances

- ✅ **Accessibilité** : Rapport d'accessibilité positif
- ✅ **Code** : Zéro erreur ESLint
- ✅ **Conformité** : Maquettes respectées à 100%
- ✅ **Maintenance** : Code modulaire et documenté
- ✅ **Performance** : Chargement rapide, images optimisées

---

## 🌐 Affichage sur le web

[Visiter le rendu final](https://fisheye.maximenardelli.fr/)

---

## 📝 Compétences développées

### Frontend

- Développement avec HTML5 sémantique
- CSS3 avancé (Flexbox, Grid, animations)
- JavaScript ES6+ (fetch, event listeners, destructuring)

### Architecture

- Design Patterns (Factory, MVC)
- Modularité et séparation des préoccupations
- Code maintainable et réutilisable

### Accessibilité

- WCAG 2.1 et standards web
- ARIA labels et roles
- Navigation au clavier
- Lecteurs d'écran

### Développement professionnel

- ESLint et validation de code
- Gestion des événements
- Manipulation du DOM
- Fetch API et données JSON

---

## 🤝 Contribuer

Ce projet a été réalisé à titre pédagogique. Il n'accepte pas de contributions externes.

Pour des questions ou des retours, veuillez contacter l'auteur.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier LICENSE pour plus de détails.

---

## 👤 Auteur

**Weavyx** - Développeur Frontend Junior

- Portfolio : [maximenardelli.fr](https://www.maximenardelli.fr)
- GitHub : [@Weavyx](https://github.com/Weavyx)

---

## 🙏 Remerciements

- **Techasite** - Entreprise d'accueil
- **OpenClassrooms** - Programme de formation
- **Amanda & l'équipe FishEye** - Pour les spécifications du projet
- **Tous les utilisateurs qui ont testé l'accessibilité**
