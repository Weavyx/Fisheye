import { Model } from "./models/Model.js";
import { View } from "./views/View.js";
import { Controller } from "./controller/Controller.js";

// Initialisation du contrôleur
const app = new Controller(new Model(), new View());

// Détection de la page actuelle
const currentPage = window.location.pathname;

// Attendre le chargement complet du DOM avant d'exécuter le code
document.addEventListener("DOMContentLoaded", () => {
  if (currentPage.includes("index.html") || currentPage === "/") {
    // Page d'accueil
    app.RenderIndex();
  } else if (currentPage.includes("photographer.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get("id"); // Récupère la valeur de "id"
    // Page de détails d'un photographe
    app.RenderPhotographer(photographerId);
  }
});
