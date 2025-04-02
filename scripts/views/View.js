export class View {
  constructor() {
    this.controller = null;
    this.model = null;
  }

  createPhotographerIndexCard(photographer) {
    const { name, id, city, country, tagline, price, portrait } = photographer;
    const picture = `assets/photographers/${portrait}`;

    // Créer un template d'article pour le photographe
    const article = document.createElement("article");
    article.classList.add("photographer-card");
    article.innerHTML = `
      <article class="photographer-card" id="${id}">
        <div class="cadre">
         <img src="${picture}" alt="${name}">
        </div>
        <h2>${name}</h2>
        <p class="location">${city}, ${country}</p>
        <p class="tagline">${tagline}</p>
        <p class="price">${price}€/jour</p>
      </article>
    `;

    // Ajouter un événement de redirection
    article.addEventListener("click", () => {
      window.location.href = `photographer.html?id=${id}`;
    });

    return article;
  }

  renderPhotographerBanner(photographer) {
    const photographerBanner = document.querySelector(".photograph-header");
    photographerBanner.innerHTML = `
      <div class="left-component"></div>
      <button class="contact_button">
        Contactez-moi
      </button>
      <div class="right-component"></div>
    `;

    // Créer et ajouter les composants gauche et droit de la bannière
    photographerBanner
      .querySelector(".left-component")
      .append(this.createPhotographerBannerLeftComponent(photographer));
    photographerBanner
      .querySelector(".right-component")
      .append(this.createPhotographerBannerRightComponent(photographer));

    // Ajouter un événement de clic sur le bouton "Contactez-moi"
    const contactButton = photographerBanner.querySelector(".contact_button");
    contactButton.addEventListener("click", () => {
      this.displayModal(photographer.name);
    });
  }
  displayModal(photographerName) {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";
    const modalTitle = document.querySelector(".photographer-name");
    modalTitle.innerHTML = `Contactez-moi <br>${photographerName}`;
  }

  closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
  }

  createPhotographerBannerLeftComponent(photographer) {
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

  createPhotographerBannerRightComponent(photographer) {
    const { name, portrait } = photographer;
    const picture = `assets/photographers/${portrait}`;

    const rightComponent = document.createElement("div");
    rightComponent.classList.add("right-component");
    rightComponent.innerHTML = `
      <img src="${picture}" alt="${name}">
    `;

    return rightComponent;
  }

  renderStickyInfoBox(photographerPrice, PhotographerTotalLikes) {
    document
      .querySelector("body")
      .append(
        this.createStickyInfoBox(photographerPrice, PhotographerTotalLikes)
      );
  }

  createStickyInfoBox(photographerPrice, PhotographerTotalLikes) {
    const stickyInfoBox = document.createElement("div");
    stickyInfoBox.setAttribute("id", "sticky-info-box");
    stickyInfoBox.innerHTML = `
      <div class="likes-container">
        <span class="total-likes">${PhotographerTotalLikes}</span>
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.125 18.35L7.85625 17.03C3.35 12.36 0.375 9.28 0.375 5.5C0.375 2.42 2.4925 0 5.1875 0C6.71 0 8.17125 0.81 9.125 2.09C10.0787 0.81 11.54 0 13.0625 0C15.7575 0 17.875 2.42 17.875 5.5C17.875 9.28 14.9 12.36 10.3938 17.04L9.125 18.35Z" fill="black"/>
        </svg>
      </div>
      <p class="photographer-price">${photographerPrice}€/jour</p>
    `;

    return stickyInfoBox;
  }

  updateLikesCounter(media, photographer, mediaLikesContainer) {
    const globalLikesContainer = document.querySelector(".total-likes");

    // Mettre à jour le compteur de likes
    mediaLikesContainer.textContent = parseInt(media.likes);
    globalLikesContainer.textContent = parseInt(photographer.totalLikes); // Met à jour le compteur total de likes
  }

  renderPhotographerMedia(media, photographer) {
    const worksContainer = document.querySelector(".work-container");
    worksContainer.innerHTML = ""; // Vider le conteneur avant d'ajouter les nouveaux médias
    media.forEach((medium) => {
      const mediaCard = this.createPhotographerMediaCard(medium);
      worksContainer.appendChild(mediaCard); // Ajouter le média à la section des travaux

      // Ajouter un gestionnaire d'événements pour les likes
      this.addLikeEvent(medium, photographer, mediaCard);

      // Ajouter un gestionnaire d'événements pour la lightbox
      this.addLightboxEvent(medium, mediaCard);
    });
  }

  addLightboxEvent(medium, mediaCard) {
    const mediaElement = mediaCard.querySelector(".media");
    mediaElement.addEventListener("click", () => {
      // this.controller.openLightbox(medium, mediaCard);
    });
  }

  addLikeEvent(medium, photographer, mediaCard) {
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
      this.updateLikesCounter(medium, photographer, mediaLikesContainer);
    });
  }

  createPhotographerMediaCard(media) {
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

  addSortEvent(media, photographer) {
    const sortSelect = document.querySelector("#sort-select");
    sortSelect.addEventListener("change", (event) => {
      const selectedOption = event.target.value;
      const sortedMedia = this.model.sortMedia(media, selectedOption);
      this.renderPhotographerMedia(sortedMedia, photographer);
    });
  }

  addModalEvent() {
    const modal = document.getElementById("contact_modal");
    const closeButton = modal.querySelector(".close-button");
    const contactForm = document.getElementById("contact_form");
    const contactButton = modal.querySelector(".contact_button");

    closeButton.addEventListener("click", () => {
      this.closeModal();
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.closeModal();
      } else if (
        event.target === contactForm ||
        event.target === contactButton
      ) {
        event.preventDefault(); // Empêche le rechargement de la page
        this.closeModal();
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
}
