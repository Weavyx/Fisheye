export class View {
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
        <span>
        <p class="likes">${likes}</p>
        <svg  viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 18.35L8.23125 17.03C3.725 12.36 0.75 9.28 0.75 5.5C0.75 2.42 2.8675 0 5.5625 0C7.085 0 8.54625 0.81 9.5 2.09C10.4537 0.81 11.915 0 13.4375 0C16.1325 0 18.25 2.42 18.25 5.5C18.25 9.28 15.275 12.36 10.7688 17.04L9.5 18.35Z" fill="#911C1C"/>
        </svg>
        </span>
      </div>
    `;

    return mediaCard;
  }

  createStickyInfoBox(price, totalLikes) {
    const stickyInfoBox = document.createElement("div");
    stickyInfoBox.setAttribute("id", "sticky-info-box");
    stickyInfoBox.innerHTML = `
      <span class="total-likes">
        ${totalLikes}
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.125 18.35L7.85625 17.03C3.35 12.36 0.375 9.28 0.375 5.5C0.375 2.42 2.4925 0 5.1875 0C6.71 0 8.17125 0.81 9.125 2.09C10.0787 0.81 11.54 0 13.0625 0C15.7575 0 17.875 2.42 17.875 5.5C17.875 9.28 14.9 12.36 10.3938 17.04L9.125 18.35Z" fill="black"/>
        </svg>
      </span>
      <p class="photographer-price">${price}€/jour</p>
    `;

    return stickyInfoBox;
  }
}
