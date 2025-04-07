/**
 * Classe représentant le contrôleur de l'application.
 * Gère la logique entre le modèle et la vue.
 */
export class AppController {
  /**
   * Crée une instance de Controller.
   *
   * @param {Model} model - L'instance du modèle.
   * @param {View} view - L'instance de la vue.
   * @param {EventManager} eventManager - L'instance du gestionnaire d'événements.
   */
  constructor(model, view, eventManager) {
    if (AppController.instance) {
      return AppController.instance;
    }
    this.model = model;
    this.view = view;
    this.eventManager = eventManager;

    this.view.eventManager = this.eventManager;

    this.eventManager.controller = this;
    this.eventManager.view = this.view;

    AppController.instance = this;
  }

  // Section: Méthodes de rendu des pages
  /**
   * Rend la page d'accueil avec la liste des photographes.
   *
   * @method
   * @returns {void}
   */
  renderHomePage() {
    this.model
      .fetchPhotographers()
      .then((photographerList) => {
        const photographersSectionElement = document.querySelector(
          ".photographer_section"
        );
        photographerList.forEach((photographerInfo) => {
          photographersSectionElement.appendChild(
            this.view.createPhotographerCard(photographerInfo)
          );
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors du rendu de la page d'accueil :",
          error.message
        );
        this.view.displayErrorMessage(
          "Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard."
        );
      });
  }

  /**
   * Rend la page d'un photographe avec ses détails et ses médias.
   *
   * @method
   * @param {number|string} id - L'ID du photographe.
   * @returns {void}
   */
  renderPhotographerPage(photographerId) {
    this.model
      .fetchPhotographerById(photographerId)
      .then((photographerInfo) => {
        this.view.displayPhotographerBanner(photographerInfo);

        return this.model
          .fetchPhotographerMediaAndLikes(photographerId)
          .then(({ media: mediaList, totalLikes }) => {
            // Stocker la liste des médias dans le contrôleur
            this.mediaList = mediaList;

            this.model.updatePhotographerLikes(photographerInfo, totalLikes);

            this.view.displayStickyInfoBox(
              photographerInfo.price,
              photographerInfo.totalLikes
            );

            this.view.displayPhotographerMedia(mediaList, photographerInfo);
            this.eventManager.attachSortEvent(mediaList, photographerInfo);
            this.initializeLightboxEvents();
          });
      })
      .catch((error) => {
        console.error(
          "Erreur lors du rendu de la page photographe :",
          error.message
        );
      });
  }

  // Section: Méthodes de gestion de la lightbox
  /**
   * Ouvre la lightbox pour afficher un média.
   *
   * @param {Object} mediaData - Les données du média à afficher.
   * @returns {void}
   */
  openMediaLightbox(mediaData) {
    const lightbox = document.getElementById("lightbox");

    if (!lightbox) {
      console.error("Lightbox introuvable dans le DOM.");
      return;
    }

    if (!this.mediaList || this.mediaList.length === 0) {
      console.error("La liste des médias n'est pas définie ou vide.");
      return;
    }

    this.view.renderLightboxMedia(mediaData);

    this.currentMediaIndex = this.mediaList.findIndex(
      (media) => media.id === mediaData.id
    );
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

  /**
   * Initialise les événements globaux pour la lightbox.
   *
   * @returns {void}
   */
  initializeLightboxEvents() {
    const lightboxElement = document.getElementById("lightbox");
    if (!lightboxElement) {
      console.error("Lightbox introuvable dans le DOM.");
      return;
    }

    this.eventManager.addEvent(lightboxElement, "keydown", (event) => {
      switch (event.key) {
        case "Escape":
          this.closeMediaLightbox();
          break;
        case "ArrowRight":
          this.showNextMedia();
          break;
        case "ArrowLeft":
          this.showPreviousMedia();
          break;
      }
    });
  }

  /**
   * Initialise les événements pour la page photographer.html.
   *
   * @returns {void}
   */
  initializePhotographerPageEvents() {
    // Evénements pour la lightbox
    this.eventManager.on("openLightbox", (mediaData) => {
      this.openMediaLightbox(mediaData);
    });

    this.eventManager.on("closeLightbox", () => {
      this.closeMediaLightbox();
    });

    this.eventManager.on("showNextMedia", () => {
      this.showNextMedia();
    });

    this.eventManager.on("showPreviousMedia", () => {
      this.showPreviousMedia();
    });

    // Enregistrement de l'événement toggleLike
    this.eventManager.on("toggleLike", (data) => {
      this.eventManager.handleToggleLike(data);
    });

    this.eventManager.on("likeMedia", (data) => {
      this.handleLikeMedia(data);
    });
  }

  /**
   * Gère l'événement de like sur un média.
   *
   * @param {Object} data - Les données transmises par l'événement.
   * @returns {void}
   */
  handleLikeMedia(data) {
    const { mediaCard } = data;
    const mediaId = mediaCard.dataset.id; // Supposons que l'ID du média est stocké dans un attribut data-id

    const medium = this.mediaList.find(
      (media) => media.id === parseInt(mediaId)
    );
    if (!medium) {
      console.error("Média introuvable pour l'ID :", mediaId);
      return;
    }

    const photographer = this.model.photographers.find(
      (p) => p.id === medium.photographerId
    );
    if (!photographer) {
      console.error(
        "Photographe introuvable pour l'ID :",
        medium.photographerId
      );
      return;
    }

    this.model.toggleMediaLike(medium, photographer);

    const mediaLikesContainer = mediaCard.querySelector(".likes");
    const totalLikesContainer = document.querySelector(".total-likes");

    this.view.updateLikesDisplay(
      mediaLikesContainer,
      medium.likes,
      totalLikesContainer,
      photographer.totalLikes
    );
  }
}
