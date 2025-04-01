import { Photographer } from "./Photographer.js";
import { Media } from "./Media.js";

export class Model {
  //    Helpers
  handleError(error, defaultValue = []) {
    console.error(error.message); // Log l'erreur pour le débogage
    return defaultValue; // Retourne une valeur par défaut (ex. : tableau vide)
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

  getPhotographerMedia(id) {
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
          return media
            .map((media) => new Media(media))
            .sort((a, b) => {
              if (a.likes === b.likes) {
                return a.title.localeCompare(b.title); // Trie par titre si les likes sont égaux
              } else {
                return b.likes - a.likes; // Trie par likes décroissants
              }
            }); // Retourne un tableau d'objets Media triés par likes
        }
      }
    });
  }
  // Retourne un objet avec le total des likes des media et photographer.price
  getPhotographerPriceAndTotalLikes(id) {
    return this.getData().then((data) => {
      if (!data.media) {
        throw new Error(
          "getPhotographerPriceAndTotalLikes : Les données des médias sont introuvables ou mal formatées dans photographers.json."
        );
      } else {
        const media = data.media.filter(
          (media) => media.photographerId === parseInt(id)
        );
        if (!media || media.length === 0) {
          throw new Error(
            `getPhotographerPriceAndTotalLikes : Aucun média trouvé pour le photographe avec l'ID ${id}.`
          );
        } else {
          const totalLikes = media.reduce((acc, media) => acc + media.likes, 0);
          const photographer = data.photographers.find(
            (photographer) => photographer.id === parseInt(id)
          );
          if (!photographer) {
            throw new Error(
              `getPhotographerPriceAndTotalLikes : Photographe avec l'ID ${id} introuvable.`
            );
          } else {
            return {
              price: photographer.price,
              totalLikes: totalLikes,
            }; // Retourne un objet avec le prix et le total des likes
          }
        }
      }
    });
  }
}
