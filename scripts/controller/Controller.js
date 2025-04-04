/**
 * Classe représentant le contrôleur de l'application.
 * Gère la logique entre le modèle et la vue.
 */
export class AppController {
  // Renommé pour refléter son rôle dans l'application
  /**
   * Crée une instance de Controller.
   *
   * @param {Model} model - L'instance du modèle.
   * @param {View} view - L'instance de la vue.
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.controller = this;
    this.view.model = this.model;
  }

  // Section: Méthodes de rendu des pages
  /**
   * Rend la page d'accueil avec la liste des photographes.
   *
   * @method
   * @returns {void}
   */
  async renderHomePage() {
    try {
      const photographerList = await this.model.fetchPhotographers();
      const photographersSectionElement = document.querySelector(
        ".photographer_section"
      );
      photographerList.forEach((photographerInfo) => {
        photographersSectionElement.appendChild(
          this.view.createPhotographerCard(photographerInfo)
        );
      });
    } catch (error) {
      console.error(
        "Erreur lors du rendu de la page d'accueil :",
        error.message
      );
    }
  }

  /**
   * Rend la page d'un photographe avec ses détails et ses médias.
   *
   * @method
   * @param {number|string} id - L'ID du photographe.
   * @returns {void}
   */
  async renderPhotographerPage(photographerId) {
    try {
      const photographerInfo = await this.model.fetchPhotographerById(
        photographerId
      );
      this.view.displayPhotographerBanner(photographerInfo);

      const { media: mediaList, totalLikes } =
        await this.model.fetchPhotographerMediaAndLikes(photographerId);

      // Stocker la liste des médias dans le contrôleur
      this.mediaList = mediaList;

      this.model.updatePhotographerLikes(photographerInfo, totalLikes);

      this.view.displayStickyInfoBox(
        photographerInfo.price,
        photographerInfo.totalLikes
      );

      this.view.displayPhotographerMedia(mediaList, photographerInfo);
      this.view.attachSortEvent(mediaList, photographerInfo);
      this.view.attachModalEvents();
    } catch (error) {
      console.error(
        "Erreur lors du rendu de la page photographe :",
        error.message
      );
    }
  }

  // Section: Méthodes de gestion de la lightbox
  /**
   * Ouvre la lightbox pour afficher un média.
   *
   * @param {Object} mediaData - Les données du média à afficher.
   * @returns {void}
   */
  openMediaLightbox(mediaData) {
    console.log("Ouverture de la lightbox pour le média :", mediaData.title);
    const lightbox = document.getElementById("lightbox");

    // Vérification si la lightbox existe dans le DOM
    if (!lightbox) {
      console.error(
        "Lightbox introuvable dans le DOM. Assurez-vous que l'élément HTML de la lightbox est correctement défini."
      );
      return;
    }

    // Vérification si la liste des médias est définie
    if (!this.mediaList || this.mediaList.length === 0) {
      console.error(
        "La liste des médias n'est pas définie. Assurez-vous que les médias sont correctement chargés."
      );
      return;
    }

    // Affiche le média dans la lightbox
    this.view.renderLightboxMedia(mediaData);

    // Stocker l'index du média actuel
    this.currentMediaIndex = this.mediaList.findIndex(
      (media) => media.id === mediaData.id
    );

    // Vérification de l'état de la lightbox
    if (lightbox.style.display !== "flex") {
      console.error("La lightbox n'est pas visible. Vérifiez les styles CSS.");
    } else {
      console.log("La lightbox est visible.");
    }

    if (lightbox.getAttribute("aria-hidden") !== "false") {
      console.error(
        "L'attribut \"aria-hidden\" de la lightbox n'est pas correctement défini."
      );
    } else {
      console.log(
        'L\'attribut "aria-hidden" de la lightbox est correctement défini.'
      );
    }
  }

  /**
   * Affiche le média suivant dans la lightbox.
   *
   * @returns {void}
   */
  showNextMedia() {
    if (this.currentMediaIndex === undefined || this.mediaList.length === 0) {
      return;
    }

    // Calculer l'index du média suivant
    this.currentMediaIndex =
      (this.currentMediaIndex + 1) % this.mediaList.length;

    // Afficher le média suivant
    const nextMedia = this.mediaList[this.currentMediaIndex];
    this.view.renderLightboxMedia(nextMedia);
  }

  /**
   * Affiche le média précédent dans la lightbox.
   *
   * @returns {void}
   */
  showPreviousMedia() {
    if (this.currentMediaIndex === undefined || this.mediaList.length === 0) {
      return;
    }

    // Calculer l'index du média précédent
    this.currentMediaIndex =
      (this.currentMediaIndex - 1 + this.mediaList.length) %
      this.mediaList.length;

    // Afficher le média précédent
    const prevMedia = this.mediaList[this.currentMediaIndex];
    this.view.renderLightboxMedia(prevMedia);
  }

  /**
   * Ferme la lightbox.
   *
   * @returns {void}
   */
  closeMediaLightbox() {
    const lightbox = document.getElementById("lightbox");

    // Vérification si la lightbox existe dans le DOM
    if (!lightbox) {
      console.error(
        "Lightbox introuvable dans le DOM. Assurez-vous que l'élément HTML de la lightbox est correctement défini."
      );
      return;
    }

    // Masquer la lightbox
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
  }
}
