import { TemplateManager } from "../utils/TemplateManager.js";
import { photographerCardTemplate } from "./templates/photographerCardTemplate.js";
import { mediaCardTemplate } from "./templates/mediaCardTemplate.js";
import { photographerHeaderTemplate } from "./templates/photographerHeaderTemplate.js";
import { stickyInfoBoxTemplate } from "./templates/stickyInfoBoxTemplate.js";
import { lightboxTemplate } from "./templates/lightboxTemplate.js";
import { contactModalTemplate } from "./templates/contactModalTemplate.js";
import { dropdownTemplate } from "./templates/dropdownTemplate.js";

/**
 * Classe représentant la vue de l'application.
 * Gère l'affichage des données et les interactions utilisateur.
 */
export class AppView {
  /**
   * Crée une instance unique de AppView.
   * @returns {void}
   */
  constructor() {
    if (AppView.instance) {
      return AppView.instance;
    }
    this.eventManager = null;
    this.currentLightboxMedia = null; // Pour stocker le média actuel dans la lightbox
    AppView.instance = this;

    const templateManager = new TemplateManager();

    // Enregistrement des templates
    templateManager.registerFactory(
      "photographerCard",
      photographerCardTemplate
    );
    templateManager.registerFactory("mediaCard", mediaCardTemplate);
    templateManager.registerFactory(
      "photographerHeader",
      photographerHeaderTemplate
    );
    templateManager.registerFactory("stickyInfoBox", stickyInfoBoxTemplate);
    templateManager.registerFactory("lightbox", lightboxTemplate);
    templateManager.registerFactory("contactModal", contactModalTemplate);
    templateManager.registerFactory("dropdown", dropdownTemplate);

    this.templateManager = templateManager;
  }

  // Section: Méthodes de rendu
  /**
   * Ajoute un gestionnaire générique pour les interactions clavier.
   *
   * @param {HTMLElement} element - L'élément HTML cible.
   * @param {Function} action - La fonction à exécuter lorsque la touche Enter est pressée.
   */
  addKeyboardInteraction(element, action) {
    element.setAttribute("tabindex", "0");
    this.eventManager.addEvent(element, "keydown", (event) => {
      if (event.key === "Enter") {
        action();
      }
    });
  }

  /**
   * Affiche la carte d'un photographe sur la page d'accueil.
   *
   * @param {Object} photographerInfo - Les données du photographe.
   * @param {HTMLElement} photographersSectionElement - L'élément HTML de la section des photographes.
   * @returns {void}
   */
  displayPhotographerCard(photographerInfo, photographersSectionElement) {
    const photographerCardTemplate = this.templateManager.create(
      "photographerCard",
      photographerInfo
    );

    const photographerCard = photographerCardTemplate.getCardDOM();
    photographersSectionElement.appendChild(photographerCard);

    // Ajout des événements via l'eventManager
    const photographerCardSectionHeader = photographerCard.querySelector(
      ".photographer-section__header"
    );

    this.eventManager.addEvent(photographerCardSectionHeader, "click", () => {
      window.location.href = `photographer.html?id=${photographerInfo.id}`;
    });
    this.eventManager.addEvent(
      photographerCardSectionHeader,
      "keydown",
      (event) => {
        if (event.key === "Enter" || event.key === " ") {
          window.location.href = `photographer.html?id=${photographerInfo.id}`;
        }
      }
    );
  }

  /**
   * Affiche la bannière d'un photographe sur sa page de détails.
   *
   * @param {Object} photographerInfo - Les données du photographe.
   * @returns {void}
   */
  displayPhotographerHeader(photographerInfo) {
    const photographerHeaderElement = document.getElementById(
      "photographer-header"
    );
    photographerHeaderElement.innerHTML = "";

    const headerTemplate = this.templateManager.create("photographerHeader", {
      photographerInfo,
    });
    photographerHeaderElement.appendChild(headerTemplate.getHeaderDOM());

    const contactButtonElement = photographerHeaderElement.querySelector(
      ".photographer-header__contact-button"
    );
    this.eventManager.addEvent(contactButtonElement, "click", () => {
      this.showContactModal(photographerInfo.name);
    });
  }

  /**
   * Affiche une boîte d'informations fixe avec le prix et les likes totaux.
   *
   * @param {number} photographerPrice - Le prix par jour du photographe.
   * @param {number} photographerTotalLikes - Le nombre total de likes.
   * @returns {void}
   */
  displayStickyInfoBox(photographerPrice, photographerTotalLikes) {
    const stickyInfoBoxTemplate = this.templateManager.create("stickyInfoBox", {
      photographerPrice,
      photographerTotalLikes,
    });
    document.body.appendChild(stickyInfoBoxTemplate.getStickyInfoBoxDOM());
  }

  /**
   * Affiche les médias d'un photographe.
   *
   * @param {Array<Object>} mediaList - Les médias du photographe.
   * @param {Object} photographerInfo - Les données du photographe.
   * @returns {void}
   */
  displayPhotographerMedia(mediaList, photographerInfo) {
    const worksContainerElement = document.querySelector(
      ".photographer-work__container"
    );
    worksContainerElement.innerHTML = ""; // Vider le conteneur avant d'ajouter les nouveaux médias
    mediaList.forEach((mediaData) => {
      const mediaCardTemplate = this.templateManager.create(
        "mediaCard",
        mediaData
      );
      const mediaCardElement = mediaCardTemplate.getMediaCardDOM();

      worksContainerElement.appendChild(mediaCardElement); // Ajouter le média à la section des travaux
      // Ajouter un gestionnaire d'événements pour les likes
      this.attachLikeEvent(mediaData, mediaCardElement, photographerInfo);
      // Utiliser attachMediaEvents pour gérer les clics et les interactions clavier
      const mediaElement = mediaCardElement.querySelector(".media");
      if (mediaElement) {
        this.eventManager.attachMediaEvents(mediaElement, () => {
          this.eventManager.trigger("openLightbox", mediaData);
        });
      }
    });

    // S'assurer que les médias sont accessibles avec Tab
    const mediaElements = worksContainerElement.querySelectorAll(".media");
    mediaElements.forEach((media) => {
      media.setAttribute("tabindex", "0");
    });
  }

  // Section: Méthodes de gestion des événements
  /**
   * Ajoute un événement pour ouvrir la lightbox sur un média.
   *
   * @param {Object} mediaData - Les données du média.
   * @param {HTMLElement} mediaCardElement - L'élément HTML de la carte du média.
   * @returns {void}
   */
  attachLightboxEvent(mediaData, mediaCardElement) {
    const mediaElement = mediaCardElement.querySelector(".media");

    mediaElement.setAttribute("alt", mediaData.title);
    mediaElement.setAttribute("tabindex", "0");

    // Ajout des événements de clic et de clavier
    this.eventManager.addEvent(mediaElement, "click", () => {
      this.eventManager.trigger("openLightbox", mediaData);
    });

    this.eventManager.addEvent(mediaElement, "keydown", (event) => {
      if (event.key === "Enter") {
        this.eventManager.trigger("openLightbox", mediaData);
      }
    });
  }

  /**
   * Ajoute un événement pour gérer les likes sur un média
   *
   * @param {Object} medium - Les données du média.
   * @param {HTMLElement} mediaCard - L'élément HTML de la carte du média.
   * @param {Object} photographer - Les données du photographe.
   * @returns {void}
   */
  attachLikeEvent(medium, mediaCard, photographer) {
    const likeButton = mediaCard.querySelector(
      ".photographer-work__likes-container"
    );
    const mediaLikesContainer = likeButton.querySelector(
      ".photographer-work__likes"
    );
    const heartIcon = mediaCard.querySelector(".photographer-work__heart-icon");

    this.eventManager.addEvent(likeButton, "click", () => {
      this.eventManager.trigger("toggleLike", {
        medium,
        mediaLikesContainer,
        heartIcon,
        photographer,
      });
    });

    this.eventManager.addEvent(likeButton, "keydown", (event) => {
      if (event.key === "Enter") {
        this.eventManager.trigger("toggleLike", {
          medium,
          mediaLikesContainer,
          heartIcon,
          photographer,
        });
      }
    });
  }

  /**
   * Ajoute un événement pour trier les médias.
   *
   * @param {Array<Object>} media - Les médias du photographe.
   * @param {Object} photographer - Les données du photographe.
   * @returns {void}
   */
  attachSortEvent(media, photographer) {
    this.eventManager.attachSortEvent(media, photographer);
  }

  // Section: Méthodes de gestion de la modale

  /**
   * Affiche la modale de contact pour un photographe.
   *
   * @param {string} photographerName - Le nom du photographe.
   * @returns {void}
   */
  showContactModal(photographerName) {
    const modalTitle = document.querySelector(
      ".contact-modal__photographer-name"
    );
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modalTitle.textContent = `Contactez-moi ${photographerName}`;
    const firstInput = modal.querySelector("input, textarea, select");
    if (firstInput) {
      firstInput.focus();
    }
    this.eventManager.attachModalEvents();
  }

  /**
   * Ferme la modale de contact.
   *
   * @returns {void}
   */
  hideContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    document.querySelector(".photographer-header__contact-button").focus();
  }

  displayContactModal(photographerName) {
    const contactModalTemplate = this.templateManager.create("contactModal", {
      photographerName,
    });
    const contactModalElement = contactModalTemplate.getModalDOM();
    document.body.appendChild(contactModalElement);

    const closeModalButton = contactModalElement.querySelector(
      ".contact-modal__close"
    );
    this.eventManager.addEvent(closeModalButton, "click", () => {
      contactModalElement.style.display = "none";
      contactModalElement.setAttribute("aria-hidden", "true");
    });

    contactModalElement.style.display = "flex";
    contactModalElement.setAttribute("aria-hidden", "false");
  }

  displayDropdown(options, defaultOption, onChangeCallback) {
    const dropdownTemplate = this.templateManager.create("dropdown", {
      options,
      defaultOption,
      onChangeCallback,
    });
    const dropdownElement = dropdownTemplate.getDropdownDOM();
    const dropdownContainer = document.querySelector(".dropdown-container");
    dropdownContainer.innerHTML = "";
    dropdownContainer.appendChild(dropdownElement);
  }

  // Section: Méthodes utilitaires

  /**
   * Met à jour l'affichage des likes pour un média et les likes totaux.
   *
   * @param {HTMLElement} mediaLikesContainer - L'élément HTML du compteur de likes du média.
   * @param {number} mediaLikes - Le nouveau nombre de likes pour le média.
   * @param {HTMLElement} totalLikesContainer - L'élément HTML du compteur de likes totaux.
   * @param {number} totalLikes - Le nouveau nombre de likes totaux.
   */
  updateLikesDisplay(
    mediaLikesContainer,
    mediaLikes,
    totalLikesContainer,
    totalLikes
  ) {
    mediaLikesContainer.textContent = mediaLikes;
    totalLikesContainer.textContent = totalLikes;
  }

  /**
   * Crée et affiche la lightbox pour un média.
   *
   * @param {Object} mediaData - Les données du média.
   * @returns {void}
   */
  renderLightboxMedia(mediaData) {
    this.currentLightboxMedia = mediaData; // Stocker le média actuel pour la navigation dans la lightbox

    const lightbox = document.getElementById("lightbox");
    if (!lightbox) {
      console.error("Lightbox introuvable dans le DOM.");
      return;
    }

    const lightboxContainer = lightbox.querySelector(".lightbox__content");
    if (!lightboxContainer) {
      console.error("Conteneur de contenu de la lightbox introuvable.");
      return;
    }

    lightboxContainer.innerHTML = ""; // Vider le contenu existant
    const lightboxTemplate = this.templateManager.create("lightbox", mediaData);
    lightboxContainer.appendChild(lightboxTemplate.getLightboxDOM());

    lightbox.style.display = "flex";
    lightbox.removeAttribute("inert"); // Supprime l'attribut inert pour rendre la lightbox interactive
    lightbox.setAttribute("aria-hidden", "false"); // Rend la lightbox visible pour les technologies d'assistance

    this.toggleLightboxFocus(); // Restreindre le focus à la lightbox
  }

  /**
   * Gère le focus pour restreindre la navigation au clavier aux éléments de la lightbox.
   *
   * @returns {void}
   */
  toggleLightboxFocus() {
    const lightboxElement = document.getElementById("lightbox");

    // Ajouter un gestionnaire pour boucler le focus dans la lightbox
    const firstFocusable = lightboxElement.querySelector(".lightbox__next");
    const lastFocusable = lightboxElement.querySelector(".lightbox__close");

    this.eventManager.addEvent(lightboxElement, "keydown", (event) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Si Shift + Tab, revenir au premier élément si on est sur le dernier
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        } else {
          // Si Tab, aller au dernier élément si on est sur le premier
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        }
      }
    });

    // Mettre le focus sur le bouton .lightbox__next
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }
}
