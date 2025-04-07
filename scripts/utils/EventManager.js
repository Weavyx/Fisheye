/*
 * EventManager.js
 * Gestionnaire d'événements pour l'application.
 * Gère les interactions utilisateur et la communication entre le modèle et la vue.
 */
export class EventManager {
  /**
   * Crée une instance de EventManager.
   *
   * @param {Controller} controller - L'instance du contrôleur.
   * @param {View} view - L'instance de la vue.
   */
  constructor() {
    if (EventManager.instance) {
      return EventManager.instance;
    }
    this.controller = null;
    this.view = null;
    EventManager.instance = this;
  }

  /**
   * Ajoute un gestionnaire d'événements générique.
   *
   * @param {HTMLElement} element - L'élément cible.
   * @param {string} eventType - Le type d'événement (par ex. "click", "keydown").
   * @param {Function} callback - La fonction à exécuter lors de l'événement.
   */
  addEvent(element, eventType, callback) {
    element.addEventListener(eventType, callback);
  }

  /**
   * Ajoute un gestionnaire d'événements personnalisé.
   *
   * @param {string} eventName - Le nom de l'événement.
   * @param {Function} callback - La fonction à exécuter lorsque l'événement est déclenché.
   */
  on(eventName, callback) {
    if (!this.events) {
      this.events = {};
    }
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * Déclenche un événement personnalisé.
   *
   * @param {string} eventName - Le nom de l'événement.
   * @param {any} data - Les données à transmettre aux gestionnaires d'événements.
   */
  trigger(eventName, data) {
    if (this.events && this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
    }
  }

  attachSortEvent(media, photographer) {
    const sortSelect = document.querySelector("#sort-select");
    if (!sortSelect) {
      console.error("Élément #sort-select introuvable.");
      return;
    }

    this.addEvent(sortSelect, "change", (event) => {
      const selectedOption = event.target.value;
      const sortedMedia = this.controller.model.sortMediaByCriteria(
        media,
        selectedOption
      );
      this.view.displayPhotographerMedia(sortedMedia, photographer);
    });

    this.addEvent(sortSelect, "keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sortSelect.size = sortSelect.options.length;
        this.addEvent(sortSelect, "blur", () => {
          sortSelect.size = 0;
        });
      }
    });

    this.addEvent(sortSelect, "focus", () => {
      sortSelect.size = 0;
    });
  }

  attachModalEvents() {
    const modal = document.getElementById("contact_modal");
    if (!modal) {
      console.error("Modale de contact introuvable.");
      return;
    }
    const closeButton = modal.querySelector(".close-button");
    const contactForm = document.getElementById("contact_form");
    const contactButton = document.querySelector(".contact_button");

    if (!closeButton || !contactForm || !contactButton) {
      console.error("Éléments de la modale de contact manquants.");
      return;
    }

    this.addEvent(closeButton, "click", () => {
      this.view.hideContactModal();
    });

    this.addEvent(window, "keydown", (event) => {
      if (event.key === "Escape" && modal.style.display === "flex") {
        this.view.hideContactModal();
      } else if (
        event.key === "Enter" &&
        closeButton === document.activeElement
      ) {
        this.view.hideContactModal();
      }
    });

    this.addEvent(contactForm, "submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Formulaire soumis :", formValues);
      this.view.hideContactModal();
    });
  }

  attachLightboxEvents() {
    const lightboxElement = document.getElementById("lightbox");
    if (!lightboxElement) {
      console.error("Lightbox introuvable dans le DOM.");
      return;
    }

    const closeButton = lightboxElement.querySelector(".lightbox-close");
    const nextButton = lightboxElement.querySelector(".lightbox-next");
    const prevButton = lightboxElement.querySelector(".lightbox-prev");

    if (!closeButton || !nextButton || !prevButton) {
      console.error("Éléments de la lightbox manquants.");
      return;
    }

    this.addEvent(closeButton, "click", () => {
      this.controller.closeMediaLightbox();
    });

    this.addEvent(nextButton, "click", () => {
      this.controller.showNextMedia();
    });

    this.addEvent(prevButton, "click", () => {
      this.controller.showPreviousMedia();
    });

    const handleKeydown = (event) => {
      switch (event.key) {
        case "Escape":
          this.controller.closeMediaLightbox();
          break;
        case "ArrowRight":
          this.controller.showNextMedia();
          break;
        case "ArrowLeft":
          this.controller.showPreviousMedia();
          break;
      }
    };

    this.addEvent(lightboxElement, "keydown", handleKeydown);
  }

  /**
   * Gère les événements globaux pour la lightbox.
   *
   * @param {HTMLElement} lightboxElement - L'élément HTML de la lightbox.
   * @param {Object} controller - Le contrôleur pour gérer les actions de la lightbox.
   */
  attachLightboxGlobalEvents(lightboxElement, controller) {
    const handleKeydown = (event) => {
      switch (event.key) {
        case "Escape":
          controller.closeMediaLightbox();
          break;
        case "ArrowRight":
          controller.showNextMedia();
          break;
        case "ArrowLeft":
          controller.showPreviousMedia();
          break;
      }
    };

    lightboxElement.addEventListener("keydown", handleKeydown);
  }

  /**
   * Centralise les événements globaux pour la lightbox.
   *
   * @param {HTMLElement} lightboxElement - L'élément HTML de la lightbox.
   */
  initializeLightboxEvents(lightboxElement) {
    const closeButton = lightboxElement.querySelector(".lightbox-close");
    const nextButton = lightboxElement.querySelector(".lightbox-next");
    const prevButton = lightboxElement.querySelector(".lightbox-prev");

    if (!closeButton || !nextButton || !prevButton) {
      console.error("Éléments de la lightbox manquants.");
      return;
    }

    closeButton.addEventListener("click", () => {
      this.trigger("closeLightbox");
    });

    nextButton.addEventListener("click", () => {
      this.trigger("showNextMedia");
    });

    prevButton.addEventListener("click", () => {
      this.trigger("showPreviousMedia");
    });

    lightboxElement.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Escape":
          this.trigger("closeLightbox");
          break;
        case "ArrowRight":
          this.trigger("showNextMedia");
          break;
        case "ArrowLeft":
          this.trigger("showPreviousMedia");
          break;
      }
    });
  }

  /**
   * Gère les événements pour les médias (clic et touche Entrée).
   *
   * @param {HTMLElement} mediaElement - L'élément HTML du média.
   * @param {Function} openLightbox - La fonction pour ouvrir la lightbox.
   */
  attachMediaEvents(mediaElement, openLightbox) {
    mediaElement.setAttribute("tabindex", "0"); // Assure que l'élément est focusable

    this.addEvent(mediaElement, "click", openLightbox);

    this.addEvent(mediaElement, "keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        console.log("Touche Entrée ou Espace pressée sur le média.");
        // Ajout de la touche Espace
        event.preventDefault(); // Empêche le comportement par défaut de la touche
        openLightbox();
      }
    });
  }

  /**
   * Attache un événement pour ouvrir le formulaire de contact.
   *
   * @param {HTMLElement} button - Le bouton de contact.
   * @param {Function} openModal - La fonction pour ouvrir la modale.
   */
  attachContactButtonEvent(button, openModal) {
    button.addEventListener("click", openModal);
  }

  /**
   * Gère l'événement de basculement des likes pour un média.
   *
   * @param {Object} data - Les données contenant le média, le conteneur des likes et l'icône de cœur.
   */
  handleToggleLike(data) {
    const { medium, mediaLikesContainer, heartIcon, photographer } = data;

    // Déléguer la gestion des likes au modèle
    this.controller.model.toggleMediaLike(medium, photographer);

    // Mettre à jour l'affichage des likes
    const totalLikesContainer = document.querySelector(".total-likes");
    if (!totalLikesContainer) {
      console.error("Élément .total-likes introuvable dans le DOM.");
      return;
    }

    this.view.updateLikesDisplay(
      mediaLikesContainer,
      medium.likes,
      totalLikesContainer,
      photographer.totalLikes
    );

    // Ajouter une animation à l'icône de cœur
    if (medium.isLiked) {
      heartIcon.classList.add("liked");
    } else {
      heartIcon.classList.remove("liked");
    }
  }
}
