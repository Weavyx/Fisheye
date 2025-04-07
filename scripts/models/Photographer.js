/**
 * Classe représentant un photographe.
 */
export class Photographer {
  /**
   * Crée une instance de Photographer.
   *
   * @param {Object} data - Les données du photographe.
   * @param {string} data.name - Le nom du photographe.
   * @param {number} data.id - L'ID unique du photographe.
   * @param {string} data.city - La ville du photographe.
   * @param {string} data.country - Le pays du photographe.
   * @param {string} data.tagline - La tagline du photographe.
   * @param {number} data.price - Le prix par jour du photographe.
   * @param {string} data.portrait - Le chemin de l'image du portrait du photographe.
   */
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.city = data.city;
    this.country = data.country;
    this.tagline = data.tagline;
    this.price = data.price;
    this.portrait = data.portrait;
    this.media = [];
    this.totalLikes = null; // Nombre total de likes
  }

  /**
   * Calcule le nombre total de likes pour un photographe.
   *
   * @returns {number} Le nombre total de likes.
   */
  calculateTotalLikes() {
    return this.media.reduce((total, media) => total + media.likes, 0);
  }
}
