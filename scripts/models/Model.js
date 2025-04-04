import { Photographer } from "./Photographer.js";
import { Media } from "./Media.js";

/**
 * Classe représentant le modèle de l'application.
 * Gère les données et leur manipulation.
 */
export class AppModel {
  constructor() {
    this.photographers = []; // Propriété pour stocker les photographes
  }

  // Section: Méthodes de gestion des données
  /**
   * Récupère les données depuis le fichier JSON.
   *
   * @async
   * @returns {Promise<Object>} Les données JSON.
   */
  async fetchData() {
    try {
      const response = await fetch("../../data/photographers.json");
      if (!response.ok) {
        throw new Error(
          "fetchData : Erreur réseau - impossible de récupérer le fichier photographers.json. Vérifiez que le fichier existe et que le serveur est accessible."
        );
      }
      const data = await response.json();
      if (!data) {
        throw new Error(
          "fetchData : Erreur critique - les données n'ont pas pu être chargées. Veuillez réessayer plus tard."
        );
      }
      return data;
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  /**
   * Récupère tous les photographes.
   *
   * @async
   * @returns {Promise<Array<Photographer>>} Un tableau d'objets Photographer.
   */
  async fetchPhotographers() {
    try {
      const data = await this.fetchData();
      if (!data.photographers) {
        throw new Error(
          "fetchPhotographers : Les données des photographes sont introuvables ou mal formatées dans photographers.json."
        );
      }
      return data.photographers.map(
        (photographer) => new Photographer(photographer)
      );
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  /**
   * Récupère un photographe par son ID.
   *
   * @async
   * @param {number|string} id - L'ID du photographe.
   * @returns {Promise<Photographer>} Un objet Photographer.
   */
  async fetchPhotographerById(id) {
    try {
      const data = await this.fetchData();
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
    } catch (error) {
      return this.handleFetchError(error);
    }
  }

  /**
   * Récupère les médias d'un photographe et calcule le total des likes.
   *
   * @async
   * @param {number|string} photographerId - L'ID du photographe.
   * @returns {Promise<Object>} Un objet contenant les médias triés et le total des likes.
   */
  async fetchPhotographerMediaAndLikes(photographerId) {
    try {
      const data = await this.fetchData();
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
    } catch (error) {
      return this.handleFetchError(error);
    }
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
        return media.sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date (décroissant)
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
   * Incrémente le compteur de likes pour un média.
   *
   * @param {Object} media - Les données du média.
   * @param {Object} photographer - Les données du photographe.
   * @returns {void}
   */
  incrementMediaLikes(media, photographer) {
    media.isLiked = true;
    media.likes++;
    photographer.totalLikes++;
  }

  /**
   * Décrémente le compteur de likes pour un média.
   *
   * @param {Object} media - Les données du média.
   * @param {Object} photographer - Les données du photographe.
   * @returns {void}
   */
  decrementMediaLikes(media, photographer) {
    media.isLiked = false;
    media.likes--;
    photographer.totalLikes--;
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
}
