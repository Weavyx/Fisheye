import { Photographer } from "./Photographer.js";
import { Media } from "./Media.js";

/**
 * Classe représentant le modèle de l'application.
 * Gère les données et leur manipulation.
 */
export class AppModel {
  constructor() {
    if (AppModel.instance) {
      return AppModel.instance;
    }
    this.photographers = [];
    AppModel.instance = this;
  }

  // Section: Méthodes de gestion des données
  /**
   * Récupère les données depuis le fichier JSON et informe l'utilisateur en cas d'erreur.
   *
   * @returns {Promise<Object>} Les données JSON ou une erreur.
   */
  fetchData() {
    return fetch("../../data/photographers.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "fetchData : Erreur réseau - impossible de récupérer le fichier photographers.json."
          );
        }
        return response.json();
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données :",
          error.message
        );
        throw error; // Relance l'erreur pour une gestion ultérieure par le contrôleur
      });
  }

  /**
   * Récupère tous les photographes.
   *
   * @returns {Promise<Array<Photographer>>} Un tableau d'objets Photographer ou une erreur.
   */
  fetchPhotographers() {
    return this.fetchData()
      .then((data) => {
        if (!data.photographers) {
          throw new Error(
            "fetchPhotographers : Les données des photographes sont introuvables ou mal formatées dans photographers.json."
          );
        }
        return data.photographers.map(
          (photographer) => new Photographer(photographer)
        );
      })
      .catch((error) => this.handleFetchError(error));
  }

  /**
   * Récupère un photographe par son ID.
   *
   * @param {number|string} id - L'ID du photographe.
   * @returns {Promise<Photographer>} Un objet Photographer ou une erreur.
   */
  fetchPhotographerById(id) {
    return this.fetchData()
      .then((data) => {
        if (!data.photographers) {
          throw new Error(
            "fetchPhotographerById : Les données des photographes sont introuvables ou mal formatées dans photographers.json."
          );
        }
        const photographer = data.photographers.find(
          (photographer) => photographer.id === parseInt(id)
        );
        if (!photographer) {
          throw new Error(
            `fetchPhotographerById : Photographe avec l'ID ${id} introuvable.`
          );
        }
        return new Photographer(photographer);
      })
      .catch((error) => this.handleFetchError(error));
  }

  /**
   * Récupère les médias d'un photographe et calcule le total des likes.
   *
   * @param {number|string} photographerId - L'ID du photographe.
   * @returns {Promise<Object>} Un objet contenant les médias triés et le total des likes ou une erreur.
   */
  fetchPhotographerMediaAndLikes(photographerId) {
    return this.fetchData()
      .then((data) => {
        if (!data.media) {
          throw new Error(
            "fetchPhotographerMediaAndLikes : Les données des médias sont introuvables ou mal formatées dans photographers.json."
          );
        }
        const mediaList = data.media.filter(
          (mediaData) => mediaData.photographerId === parseInt(photographerId)
        );
        if (!mediaList || mediaList.length === 0) {
          throw new Error(
            `fetchPhotographerMediaAndLikes : Aucun média trouvé pour le photographe avec l'ID ${photographerId}.`
          );
        }
        const sortedMediaList = this.sortMediaByCriteria(
          mediaList.map((mediaData) => new Media(mediaData)),
          "popularite"
        );
        const totalLikes = sortedMediaList.reduce(
          (acc, mediaData) => acc + mediaData.likes,
          0
        );
        return {
          media: sortedMediaList,
          totalLikes,
        };
      })
      .catch((error) => this.handleFetchError(error));
  }

  // Section: Méthodes de manipulation des données
  /**
   * Trie les médias selon un critère donné.
   *
   * @param {Array<Object>} media - Les médias à trier.
   * @param {string} sortBy - Le critère de tri ("popularite", "date", "titre").
   * @returns {Array<Object>} Les médias triés.
   */
  sortMediaByCriteria(media, sortBy) {
    switch (sortBy) {
      case "popularite":
        return media.sort((a, b) => b.likes - a.likes); // Tri par popularité (likes décroissants)
      case "date":
        return media.sort((a, b) => b.date - a.date); // Tri par date (décroissant)
      case "titre":
        return media.sort((a, b) => a.title.localeCompare(b.title)); // Tri par titre (alphabétique)
      default:
        return media; // Pas de tri
    }
  }

  /**
   * Met à jour le total des likes d'un photographe.
   *
   * @param {Photographer} photographer - L'objet Photographer.
   * @param {number} totalLikes - Le total des likes.
   * @returns {void}
   */
  updatePhotographerLikes(photographer, totalLikes) {
    photographer.totalLikes = totalLikes;
  }

  /**
   * Gère le basculement des likes pour un média.
   *
   * @param {Object} media - Les données du média.
   * @param {Object} photographer - Les données du photographe.
   * @returns {void}
   */
  toggleMediaLike(media, photographer) {
    if (media.isLiked) {
      // Décrémenter les likes si le média est déjà liké
      media.isLiked = false;
      media.likes--;
      photographer.totalLikes--;
    } else {
      // Incrémenter les likes si le média n'est pas encore liké
      media.isLiked = true;
      media.likes++;
      photographer.totalLikes++;
    }
  }

  // Section: Méthodes utilitaires
  /**
   * Gère les erreurs et retourne une valeur par défaut.
   *
   * @param {Error} error - L'erreur capturée.
   * @param {any} [defaultValue=[]] - La valeur par défaut à retourner.
   * @returns {any} La valeur par défaut.
   */
  handleFetchError(error, defaultValue = []) {
    console.error("Erreur capturée :", error.message);
    return defaultValue; // Retourne une valeur par défaut (ex. : tableau vide)
  }

  /**
   * Affiche un message d'erreur à l'utilisateur.
   *
   * @param {string} message - Le message d'erreur à afficher.
   */
  displayErrorMessage(message) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-message");
    errorContainer.textContent = message;

    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.innerHTML = ""; // Vide le contenu existant
      mainElement.appendChild(errorContainer);
    } else {
      document.body.appendChild(errorContainer);
    }
  }
}
