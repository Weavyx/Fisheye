import { FactoryManager } from "../utils/FactoryManager.js";
import { createPhotographerCard } from "./components/PhotographerCardFactory.js";
import { createMediaCard } from "./components/MediaCardFactory.js";
import { createPhotographerBanner } from "./components/PhotographerBannerFactory.js";
import { createStickyInfoBox } from "./components/StickyInfoBoxFactory.js";
import { createLightbox } from "./components/LightboxFactory.js";
import { createContactModal } from "./components/ContactModalFactory.js";
import { createDropdown } from "./components/DropdownFactory.js";

/**
 * Classe représentant la vue de l'application.
 * Gère l'affichage des données et les interactions utilisateur.
 */
export class AppView {
  constructor() {
    if (AppView.instance) {
      return AppView.instance;
    }
    this.eventManager = null;
    AppView.instance = this;

    const factoryManager = new FactoryManager();

    // Enregistrement des factories
    factoryManager.registerFactory("photographerCard", createPhotographerCard);
    factoryManager.registerFactory("mediaCard", createMediaCard);
    factoryManager.registerFactory(
      "photographerBanner",
      createPhotographerBanner
    );
    factoryManager.registerFactory("stickyInfoBox", createStickyInfoBox);
    factoryManager.registerFactory("lightbox", createLightbox);
    factoryManager.registerFactory("contactModal", createContactModal);
    factoryManager.registerFactory("dropdown", createDropdown);

    // Remplacement des appels directs par le FactoryManager
    this.factoryManager = factoryManager;
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
   * Affiche la bannière d'un photographe sur sa page de détails.
   *
   * @param {Object} photographerInfo - Les données du photographe.
   * @returns {void}
   */
  displayPhotographerBanner(photographerInfo) {
    const photographerBannerElement = this.factoryManager.create(
      "photographerBanner",
      photographerInfo
    );
    const bannerContainer = document.querySelector(".photograph-header");
    bannerContainer.innerHTML = "";
    bannerContainer.appendChild(photographerBannerElement);

    const contactButtonElement =
      bannerContainer.querySelector(".contact_button");
    contactButtonElement.addEventListener("click", () => {
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
    const stickyInfoBoxElement = this.factoryManager.create("stickyInfoBox", {
      photographerPrice,
      photographerTotalLikes,
    });
    document.body.appendChild(stickyInfoBoxElement);
  }

  /**
   * Affiche les médias d'un photographe.
   *
   * @param {Array<Object>} mediaList - Les médias du photographe.
   * @param {Object} photographerInfo - Les données du photographe.
   * @returns {void}
   */
  displayPhotographerMedia(mediaList, photographerInfo) {
    const worksContainerElement = document.querySelector(".work-container");
    worksContainerElement.innerHTML = ""; // Vider le conteneur avant d'ajouter les nouveaux médias
    mediaList.forEach((mediaData) => {
      const mediaCardElement = this.factoryManager.create(
        "mediaCard",
        mediaData
      );
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
   * Ajoute un événement pour gérer les likes sur un média via le contrôleur.
   *
   * @param {Object} medium - Les données du média.
   * @param {HTMLElement} mediaCard - L'élément HTML de la carte du média.
   * @param {Object} photographer - Les données du photographe.
   * @returns {void}
   */
  attachLikeEvent(medium, mediaCard, photographer) {
    const likeButton = mediaCard.querySelector(".likes-container");
    const mediaLikesContainer = likeButton.querySelector(".likes");
    const heartIcon = mediaCard.querySelector(".heart-icon");

    this.eventManager.addEvent(likeButton, "click", () => {
      this.eventManager.trigger("toggleLike", {
        medium,
        mediaLikesContainer,
        heartIcon,
        photographer, // Ajout du photographe
      });
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
    const modalTitle = document.querySelector(".photographer-name");
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modalTitle.textContent = `Contactez-moi ${photographerName}`;
    this.eventManager.attachModalEvents();
    const firstInput = modal.querySelector("input, textarea, select");
    if (firstInput) {
      firstInput.focus();
    }
  }

  /**
   * Ferme la modale de contact.
   *
   * @returns {void}
   */
  hideContactModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
  }

  displayContactModal(photographerName) {
    const contactModalElement = this.factoryManager.create(
      "contactModal",
      photographerName
    );
    document.body.appendChild(contactModalElement);

    const closeModalButton = contactModalElement.querySelector(".close-modal");
    closeModalButton.addEventListener("click", () => {
      contactModalElement.style.display = "none";
      contactModalElement.setAttribute("aria-hidden", "true");
    });

    contactModalElement.style.display = "flex";
    contactModalElement.setAttribute("aria-hidden", "false");
  }

  displayDropdown(options, defaultOption, onChangeCallback) {
    const dropdownElement = this.factoryManager.create("dropdown", {
      options,
      defaultOption,
      onChangeCallback,
    });
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
    const lightboxElement = this.factoryManager.create("lightbox", mediaData);
    const lightboxContainer = document.getElementById("lightbox-container");
    lightboxContainer.innerHTML = "";
    lightboxContainer.appendChild(lightboxElement);
    lightboxContainer.style.display = "flex";
    lightboxContainer.setAttribute("aria-hidden", "false");
  }

  /**
   * Ferme la lightbox.
   *
   * @returns {void}
   */
  closeLightbox() {
    const lightboxElement = document.getElementById("lightbox");

    // Vérification si la lightbox existe dans le DOM
    if (!lightboxElement) {
      console.error(
        "Lightbox introuvable dans le DOM. Assurez-vous que l'élément HTML de la lightbox est correctement défini."
      );
      return;
    }

    // Masquer la lightbox
    lightboxElement.style.display = "none";
    lightboxElement.setAttribute("aria-hidden", "true");

    // Réactiver le focus en dehors de la lightbox
    this.toggleLightboxFocus(false);
  }

  /**
   * Gère le focus pour restreindre la navigation au clavier aux éléments de la lightbox.
   *
   * @param {boolean} isOpen - Indique si la lightbox est ouverte.
   * @returns {void}
   */
  toggleLightboxFocus(isOpen) {
    const lightboxElement = document.getElementById("lightbox");
    const focusableElements = lightboxElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (isOpen) {
      // Sauvegarder les éléments focusables en dehors de la lightbox
      this.previousFocusableElements = Array.from(
        document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !lightboxElement.contains(el));

      // Désactiver le focus pour les éléments en dehors de la lightbox
      this.previousFocusableElements.forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });

      // Ajouter un gestionnaire pour boucler le focus dans la lightbox
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      lightboxElement.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
          if (event.shiftKey) {
            // Si Shift + Tab, revenir au dernier élément si on est sur le premier
            if (document.activeElement === firstFocusable) {
              event.preventDefault();
              lastFocusable.focus();
            }
          } else {
            // Si Tab, aller au premier élément si on est sur le dernier
            if (document.activeElement === lastFocusable) {
              event.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      });

      // Mettre le focus sur le premier élément focusable
      firstFocusable.focus();
    } else {
      // Réactiver le focus pour les éléments en dehors de la lightbox
      if (this.previousFocusableElements) {
        this.previousFocusableElements.forEach((el) => {
          el.removeAttribute("tabindex");
        });
      }
    }
  }
}
