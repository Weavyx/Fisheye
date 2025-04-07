/**
 * Classe représentant un média (image ou vidéo).
 */
export class Media {
  /**
   * Crée une instance de Media.
   *
   * @param {Object} data - Les données du média.
   * @param {number} data.id - L'ID unique du média.
   * @param {number} data.photographerId - L'ID du photographe associé.
   * @param {string} data.title - Le titre du média.
   * @param {number} data.likes - Le nombre de likes du média.
   * @param {string} data.date - La date de création du média.
   * @param {number} data.price - Le prix du média.
   * @param {string} [data.image] - Le chemin de l'image (si le média est une image).
   * @param {string} [data.video] - Le chemin de la vidéo (si le média est une vidéo).
   */
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.likes = data.likes;
    this.date = new Date(data.date); // Conversion de la date en objet Date
    this.price = data.price;

    // On vérifie si l'élément contient une image ou une vidéo
    if (data.image) {
      this.image = data.image;
      this.isImage = true;
      this.isVideo = false;
    } else if (data.video) {
      this.video = data.video;
      this.isImage = false;
      this.isVideo = true;
    }

    this.isLiked = false; // État de like par défaut
  }

  /**
   * Incrémente le nombre de likes pour ce média.
   *
   * @returns {void}
   */
  incrementLikes() {
    this.likes += 1;
    this.isLiked = true;
  }

  /**
   * Décrémente le nombre de likes pour ce média.
   *
   * @returns {void}
   */
  decrementLikes() {
    this.likes -= 1;
    this.isLiked = false;
  }
}
