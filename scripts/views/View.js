/**
 * Classe représentant la vue de l'application.
 * Gère l'affichage des données et les interactions utilisateur.
 */
export class AppView {
  constructor() {
    this.controller = null;
    this.model = null;
  }

  // Section: Méthodes de rendu
  /**
   * Crée une carte pour un photographe sur la page d'accueil.
   *
   * @param {Object} photographerInfo - Les données du photographe.
   * @returns {HTMLElement} L'élément HTML représentant la carte du photographe.
   */
  createPhotographerCard(photographerInfo) {
    // Simplifié pour plus de clarté
    const { name, id, city, country, tagline, price, portrait } =
      photographerInfo;
    const picturePath = `assets/photographers/${portrait}`;

    const articleElement = document.createElement("article");
    articleElement.classList.add("photographer-card");
    articleElement.setAttribute("role", "listitem");
    articleElement.innerHTML = `
      <div class="cadre">
        <img src="${picturePath}" alt="Portrait de ${name}" />
      </div>
      <h2>${name}</h2>
      <p class="location">${city}, ${country}</p>
      <p class="tagline">${tagline}</p>
      <p class="price">${price}€/jour</p>
    `;

    articleElement.addEventListener("click", () => {
      window.location.href = `photographer.html?id=${id}`;
    });

    articleElement.setAttribute("tabindex", "0");
    articleElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        window.location.href = `photographer.html?id=${id}`;
      }
    });

    return articleElement;
  }

  /**
   * Affiche la bannière d'un photographe sur sa page de détails.
   *
   * @param {Object} photographerInfo - Les données du photographe.
   * @returns {void}
   */
  displayPhotographerBanner(photographerInfo) {
    // Renommé pour refléter son rôle
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
    // Renommé pour refléter son rôle
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
      const mediaCardElement = this.createMediaCard(mediaData);
      worksContainerElement.appendChild(mediaCardElement); // Ajouter le média à la section des travaux

      // Ajouter un gestionnaire d'événements pour les likes
      this.attachLikeEvent(mediaData, photographerInfo, mediaCardElement);

      // Ajouter un gestionnaire d'événements pour la lightbox
      this.attachLightboxEvent(mediaData, mediaCardElement);
    });

    // S'assurer que les médias sont accessibles avec Tab
    const mediaElements = worksContainerElement.querySelectorAll(".media");
    mediaElements.forEach((media) => {
      media.setAttribute("tabindex", "0");
    });
  }

  /**
   * Crée une carte pour un média.
   *
   * @param {Object} media - Les données du média.
   * @returns {HTMLElement} L'élément HTML représentant la carte du média.
   */
  createMediaCard(media) {
    // Simplifié pour plus de clarté
    const { title, image, video, likes } = media;
    const mediaPath = image
      ? `assets/media/image/${image}`
      : `assets/media/video/${video}`;
    const mediaType = image ? "image" : "video";

    const mediaCard = document.createElement("article");
    mediaCard.classList.add("media-card");
    mediaCard.innerHTML = `
      <${mediaType} class="media" src="${mediaPath}" alt="${title}" tabindex="0"></${mediaType}>
      <div class="media-title">
        <p class="title">${title}</p>
        <span class="likes-container">
        <p class="likes">${likes}</p>
        <svg  viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="heart-icon">
          <path d="M9.5 18.35L8.23125 17.03C3.725 12.36 0.75 9.28 0.75 5.5C0.75 2.42 2.8675 0 5.5625 0C7.085 0 8.54625 0.81 9.5 2.09C10.4537 0.81 11.915 0 13.4375 0C16.1325 0 18.25 2.42 18.25 5.5C18.25 9.28 15.275 12.36 10.7688 17.04L9.5 18.35Z" fill="#911C1C"/>
        </svg>
        </span>
      </div>
    `;

    return mediaCard;
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

    // Ouvrir la lightbox au clic
    mediaElement.addEventListener("click", () => {
      console.log("Clic détecté sur le média :", mediaData.title);
      if (!this.controller.mediaList) {
        console.error(
          "La liste des médias n'est pas définie dans le contrôleur. Assurez-vous que les médias sont correctement chargés."
        );
        return;
      }
      this.controller.openMediaLightbox(mediaData);
    });

    // Ouvrir la lightbox avec la touche "Entrée"
    mediaElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        console.log("Touche Entrée détectée sur le média :", mediaData.title);
        if (!this.controller.mediaList) {
          console.error(
            "La liste des médias n'est pas définie dans le contrôleur. Assurez-vous que les médias sont correctement chargés."
          );
          return;
        }
        this.controller.openMediaLightbox(mediaData);
      }
    });
  }

  /**
   * Ajoute un événement pour gérer les likes sur un média.
   *
   * @param {Object} medium - Les données du média.
   * @param {Object} photographer - Les données du photographe.
   * @param {HTMLElement} mediaCard - L'élément HTML de la carte du média.
   * @returns {void}
   */
  attachLikeEvent(medium, photographer, mediaCard) {
    // Renommé pour refléter son rôle
    const likeButton = mediaCard.querySelector(".likes-container");
    const mediaLikesContainer = likeButton.querySelector(".likes");
    const heartIcon = mediaCard.querySelector(".heart-icon");

    likeButton.addEventListener("click", () => {
      if (!medium.isLiked) {
        heartIcon.classList.add("liked");
        this.model.incrementLikes(medium, photographer);
      } else {
        heartIcon.classList.remove("liked");
        this.model.decrementLikes(medium, photographer);
      }
      this.updateLikeCounters(medium, photographer, mediaLikesContainer);
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
    const sortSelect = document.querySelector("#sort-select");
    sortSelect.addEventListener("change", (event) => {
      const selectedOption = event.target.value;
      const sortedMedia = this.model.sortMediaByCriteria(media, selectedOption);
      this.displayPhotographerMedia(sortedMedia, photographer); // Réafficher les médias triés
    });
  }

  /**
   * Ajoute un événement pour gérer la modale de contact.
   *
   * @returns {void}
   */
  attachModalEvents() {
    // Renommé pour refléter son rôle
    const modal = document.getElementById("contact_modal");
    const closeButton = modal.querySelector(".close-button");
    const contactForm = document.getElementById("contact_form");
    const contactButton = modal.querySelector(".contact_button");

    closeButton.addEventListener("click", () => {
      this.hideContactModal();
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.hideContactModal();
      } else if (
        event.target === contactForm ||
        event.target === contactButton
      ) {
        event.preventDefault(); // Empêche le rechargement de la page
        this.hideContactModal();
        // récupérer les valeurs du formulaire
        const formData = new FormData(contactForm);
        // Afficher les valeurs du formulaire dans la console
        console.log(
          "Prénom :",
          formData.get("prenom"),
          "\nNom :",
          formData.get("nom"),
          "\nEmail :",
          formData.get("email"),
          "\nMessage :",
          formData.get("message")
        );
      }
    });
  }

  // Section: Méthodes de gestion de la modale
  /**
   * Affiche la modale de contact pour un photographe.
   *
   * @param {string} photographerName - Le nom du photographe.
   * @returns {void}
   */
  showContactModal(photographerName) {
    // Renommé pour refléter son rôle
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";
    const modalTitle = document.querySelector(".photographer-name");
    modalTitle.innerHTML = `Contactez-moi <br>${photographerName}`;
  }

  /**
   * Ferme la modale de contact.
   *
   * @returns {void}
   */
  hideContactModal() {
    // Renommé pour refléter son rôle
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
  }

  // Section: Méthodes utilitaires
  /**
   * Met à jour le compteur de likes pour un média.
   *
   * @param {Object} media - Les données du média.
   * @param {Object} photographer - Les données du photographe.
   * @param {HTMLElement} mediaLikesContainer - L'élément HTML du compteur de likes.
   * @returns {void}
   */
  updateLikeCounters(media, photographer, mediaLikesContainer) {
    // Renommé pour refléter son rôle
    const globalLikesContainer = document.querySelector(".total-likes");

    // Mettre à jour le compteur de likes
    mediaLikesContainer.textContent = parseInt(media.likes);
    globalLikesContainer.textContent = parseInt(photographer.totalLikes); // Met à jour le compteur total de likes
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

    console.log("Contenu de la lightbox rendu :", {
      mediaType,
      mediaPath,
      title: mediaData.title,
    });

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

  /**
   * Ajoute les événements de navigation et de fermeture à la lightbox.
   *
   * @returns {void}
   */
  attachLightboxEvents() {
    const lightboxElement = document.getElementById("lightbox");
    const closeButton = lightboxElement.querySelector(".lightbox-close");
    const nextButton = lightboxElement.querySelector(".lightbox-next");
    const prevButton = lightboxElement.querySelector(".lightbox-prev");

    // Événement pour fermer la lightbox
    closeButton.addEventListener("click", () => {
      this.controller.closeMediaLightbox();
      this.toggleLightboxFocus(false); // Réactiver le focus en dehors de la lightbox
    });

    // Événements pour naviguer entre les médias
    nextButton.addEventListener("click", () => {
      this.controller.showNextMedia();
    });

    prevButton.addEventListener("click", () => {
      this.controller.showPreviousMedia();
    });

    // Événement pour gérer les interactions clavier uniquement dans la lightbox
    lightboxElement.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.controller.closeMediaLightbox();
        this.toggleLightboxFocus(false); // Réactiver le focus en dehors de la lightbox
      } else if (event.key === "ArrowRight") {
        this.controller.showNextMedia();
      } else if (event.key === "ArrowLeft") {
        this.controller.showPreviousMedia();
      }
    });
  }
}
