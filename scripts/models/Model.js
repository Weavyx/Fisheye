import { Photographer } from "./Photographer.js";
import { Media } from "./Media.js";

export class Model {
  constructor() {
    this.photographers = []; // Propriété pour stocker les photographes
  }
  //    Helpers
  handleError(error, defaultValue = []) {
    return defaultValue; // Retourne une valeur par défaut (ex. : tableau vide)
  }
  incrementLikes(media, photographer) {
    media.isLiked = true;
    media.likes++;
    photographer.totalLikes++;
  }

  decrementLikes(media, photographer) {
    media.isLiked = false;
    media.likes--;
    photographer.totalLikes--;
  }

  sortMedia(media, sortBy) {
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

  //   Methods
  getData() {
    return fetch("../../data/photographers.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "getData : Erreur réseau - impossible de récupérer le fichier photographers.json. Vérifiez que le fichier existe et que le serveur est accessible."
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          throw new Error(
            "getData : Erreur critique - les données n'ont pas pu être chargées. Veuillez réessayer plus tard."
          );
        } else {
          return data; // Retourne les données JSON
        }
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getPhotographers() {
    return this.getData()
      .then((data) => {
        if (!data.photographers) {
          throw new Error(
            "getPhotographers : Les données des photographes sont introuvables ou mal formatées dans photographers.json."
          );
        } else {
          return data.photographers.map(
            (photographer) => new Photographer(photographer)
          ); // Retourne un tableau d'objets Photographer
        }
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getPhotographer(id) {
    return this.getData().then((data) => {
      if (!data.photographers) {
        throw new Error(
          "getPhotographers : Les données des photographes sont introuvables ou mal formatées dans photographers.json."
        );
      } else {
        const photographer = data.photographers.find(
          (photographer) => photographer.id === parseInt(id)
        );
        if (!photographer) {
          throw new Error(
            `getPhotographer : Photographe avec l'ID ${id} introuvable.`
          );
        } else {
          return new Photographer(photographer); // Retourne un objet Photographer
        }
      }
    });
  }

  getPhotographerMediaAndTotalLikes(id) {
    return this.getData().then((data) => {
      if (!data.media) {
        throw new Error(
          "getPhotographerMedia : Les données des médias sont introuvables ou mal formatées dans photographers.json."
        );
      } else {
        const media = data.media.filter(
          (media) => media.photographerId === parseInt(id)
        );
        if (!media || media.length === 0) {
          throw new Error(
            `getPhotographerMedia : Aucun média trouvé pour le photographe avec l'ID ${id}.`
          );
        } else {
          const sortedMedia = this.sortMedia(
            media.map((media) => new Media(media)),
            "popularite"
          ); // Tri par popularité
          const totalLikes = sortedMedia.reduce(
            (acc, media) => acc + media.likes,
            0
          ); // Calcul du total des likes
          return {
            media: sortedMedia,
            totalLikes,
          }; // Retourne un objet avec les médias et le total des likes
        }
      }
    });
  }

  updatePhotographerTotalLikesParam(photographer, totalLikes) {
    photographer.totalLikes = totalLikes; // Met à jour le total des likes du photographe
  }
}
