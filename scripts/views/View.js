import { createPhotographerCard } from "./components/PhotographerCardFactory.js";
import { createMediaCard } from "./components/MediaCardFactory.js";

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

    // Remplacement des appels directs par les imports des factories
    this.createPhotographerCard = createPhotographerCard;
    this.createMediaCard = createMediaCard;
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
    const photographerBannerElement =
      document.querySelector(".photograph-header");
    photographerBannerElement.innerHTML = `
      <div class="left-component"></div>
      <button class="contact_button">
        Contactez-moi
      </button>
      <div class="right-component"></div>
    `;

    photographerBannerElement
      .querySelector(".left-component")
      .append(this.createBannerLeftComponent(photographerInfo));
    photographerBannerElement
      .querySelector(".right-component")
      .append(this.createBannerRightComponent(photographerInfo));

    const contactButtonElement =
      photographerBannerElement.querySelector(".contact_button");
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
    document
      .querySelector("body")
      .append(
        this.createStickyInfoBox(photographerPrice, photographerTotalLikes)
      );
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
      const mediaCardElement = this.createCard(mediaData, "media");
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

  /**
   * Crée le composant gauche de la bannière d'un photographe.
   *
   * @param {Object} photographer - Les données du photographe.
   * @returns {HTMLElement} L'élément HTML du composant gauche.
   */
  createBannerLeftComponent(photographer) {
    // Simplifié pour plus de clarté
    const { name, city, country, tagline } = photographer;

    const leftComponent = document.createElement("div");
    leftComponent.classList.add("left-component");
    leftComponent.innerHTML = `
      <h1>${name}</h1>
      <p class="location">${city}, ${country}</p>
      <p class="tagline">${tagline}</p>
    `;

    return leftComponent;
  }

  /**
   * Crée le composant droit de la bannière d'un photographe.
   *
   * @param {Object} photographer - Les données du photographe.
   * @returns {HTMLElement} L'élément HTML du composant droit.
   */
  createBannerRightComponent(photographer) {
    // Simplifié pour plus de clarté
    const { name, portrait } = photographer;
    const picture = `assets/photographers/${portrait}`;

    const rightComponent = document.createElement("div");
    rightComponent.classList.add("right-component");
    rightComponent.innerHTML = `
      <img src="${picture}" alt="${name}">
    `;

    return rightComponent;
  }

  /**
   * Crée une boîte d'informations fixe avec le prix et les likes totaux.
   *
   * @param {number} photographerPrice - Le prix par jour du photographe.
   * @param {number} photographerTotalLikes - Le nombre total de likes.
   * @returns {HTMLElement} L'élément HTML représentant la boîte d'informations.
   */
  createStickyInfoBox(photographerPrice, photographerTotalLikes) {
    const stickyInfoBoxElement = document.createElement("div");
    stickyInfoBoxElement.setAttribute("id", "sticky-info-box");
    stickyInfoBoxElement.innerHTML = `
      <div class="likes-container">
        <span class="total-likes">${photographerTotalLikes}</span>
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.125 18.35L7.85625 17.03C3.35 12.36 0.375 9.28 0.375 5.5C0.375 2.42 2.4925 0 5.1875 0C6.71 0 8.17125 0.81 9.125 2.09C10.0787 0.81 11.54 0 13.0625 0C15.7575 0 17.875 2.42 17.875 5.5C17.875 9.28 14.9 12.36 10.3938 17.04L9.125 18.35Z" fill="black"/>
        </svg>
      </div>
      <p class="photographer-price">${photographerPrice}€/jour</p>
    `;

    return stickyInfoBoxElement;
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
    if (!mediaElement) {
      console.error("Élément média introuvable dans la carte.");
      return;
    }

    mediaElement.setAttribute("alt", mediaData.title);
    mediaElement.setAttribute("tabindex", "0");

    // Ajout des événements de clic et de clavier
    this.eventManager.addEvent(mediaElement, "click", () => {
      console.log("Clic détecté sur le média :", mediaData.title);
      this.eventManager.trigger("openLightbox", mediaData);
    });

    this.eventManager.addEvent(mediaElement, "keydown", (event) => {
      if (event.key === "Enter") {
        console.log("Touche Entrée détectée sur le média :", mediaData.title);
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

    if (!likeButton || !mediaLikesContainer || !heartIcon) {
      console.error("Élément manquant dans la carte média :", {
        likeButton,
        mediaLikesContainer,
        heartIcon,
      });
      return;
    }

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
    if (!mediaLikesContainer || !totalLikesContainer) {
      console.error(
        "Éléments HTML introuvables pour la mise à jour des likes",
        {
          mediaLikesContainer,
          totalLikesContainer,
        }
      );
      return;
    }

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
    const lightboxElement = document.getElementById("lightbox");

    // Vérification si la lightbox existe dans le DOM
    if (!lightboxElement) {
      console.error(
        "Lightbox introuvable dans le DOM. Assurez-vous que l'élément HTML de la lightbox est correctement défini."
      );
      return;
    }

    const lightboxContentElement =
      lightboxElement.querySelector(".lightbox-content");

    // Vider le contenu précédent
    lightboxContentElement.innerHTML = "";

    // Déterminer le type de média (image ou vidéo)
    const mediaType = mediaData.image ? "img" : "video";
    const mediaPath = mediaData.image
      ? `assets/media/image/${mediaData.image}`
      : `assets/media/video/${mediaData.video}`;

    // Créer l'élément média
    const mediaElement = document.createElement(mediaType);
    mediaElement.setAttribute("src", mediaPath);
    mediaElement.setAttribute("alt", mediaData.title);
    mediaElement.setAttribute("class", "lightbox-media");
    mediaElement.setAttribute("tabindex", "0"); // Permettre la navigation au clavier

    // Ajouter des attributs spécifiques pour les vidéos
    if (mediaType === "video") {
      mediaElement.setAttribute("controls", "true");
    }

    // Ajouter le titre du média
    const titleElement = document.createElement("p");
    titleElement.setAttribute("class", "lightbox-title");
    titleElement.textContent = mediaData.title;

    // Ajouter les éléments à la lightbox
    lightboxContentElement.appendChild(mediaElement);
    lightboxContentElement.appendChild(titleElement);

    // Afficher la lightbox
    lightboxElement.style.display = "flex";
    lightboxElement.setAttribute("aria-hidden", "false");

    // Mettre le focus sur le média pour les lecteurs d'écran
    mediaElement.focus();

    // Restreindre le focus aux éléments de la lightbox
    this.toggleLightboxFocus(true);
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
