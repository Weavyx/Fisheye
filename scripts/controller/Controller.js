/**
 * Classe représentant le contrôleur de l'application.
 * Gère la logique entre le modèle et la vue.
 */
export class AppController {
  /**
   * Crée une instance unique de Controller.
   *
   * @param {Model} model - L'instance du modèle.
   * @param {View} view - L'instance de la vue.
   * @param {EventManager} eventManager - L'instance du gestionnaire d'événements.
   *
   * @returns {void}
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
          ".photographer-section"
        );
        photographerList.forEach((photographerInfo) => {
          this.view.displayPhotographerCard(
            photographerInfo,
            photographersSectionElement
          );
        });
      })
      .catch((error) => {
        console.error(
          "Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.",
          error.message
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
        this.view.displayPhotographerHeader(photographerInfo);

        return this.model
          .fetchPhotographerMediaAndLikes(photographerId)
          .then(({ media: mediaList, totalLikes }) => {
            // Stocker la liste des médias dans le contrôleur
            this.model.mediaList = mediaList;

            this.model.updatePhotographerLikes(photographerInfo, totalLikes);

            this.view.displayStickyInfoBox(
              photographerInfo.price,
              photographerInfo.totalLikes
            );
            this.view.displayPhotographerMedia(mediaList, photographerInfo);
            this.eventManager.attachSortEvent(mediaList, photographerInfo);

            document.title = `${photographerInfo.name} – ${photographerInfo.tagline} | Fisheye`;

            this.eventManager.attachLightboxEvents(
              document.querySelector(".lightbox")
            );

            // Evénements pour la lightbox
            this.eventManager.on("openLightbox", (mediaData) => {
              this.eventManager.openMediaLightbox(mediaData);
            });

            this.eventManager.on("closeLightbox", () => {
              this.eventManager.closeMediaLightbox();
            });

            this.eventManager.on("showNextMedia", () => {
              this.eventManager.showNextMedia();
            });

            this.eventManager.on("showPreviousMedia", () => {
              this.eventManager.showPreviousMedia();
            });

            // Enregistrement de l'événement toggleLike
            this.eventManager.on("toggleLike", (data) => {
              this.eventManager.handleToggleLike(data);
            });

            this.eventManager.on("likeMedia", (data) => {
              this.eventManager.handleLikeMedia(data);
            });
          });
      })
      .catch((error) => {
        console.error(
          "Erreur lors du rendu de la page photographe :",
          error.message
        );
      });
  }
}
