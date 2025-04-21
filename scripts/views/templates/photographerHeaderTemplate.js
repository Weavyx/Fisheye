/**
 * Génère un modèle pour afficher l'en-tête d'un photographe.
 * @param {Object} data - Les données nécessaires pour le modèle.
 * @param {Object} data.photographerInfo - Les informations du photographe.
 * @param {string} data.photographerInfo.name - Le nom du photographe.
 * @param {string} data.photographerInfo.city - La ville du photographe.
 * @param {string} data.photographerInfo.country - Le pays du photographe.
 * @param {string} data.photographerInfo.tagline - Le slogan du photographe.
 * @param {string} data.photographerInfo.portrait - Le chemin vers le portrait du photographe.
 * @returns {Object} Un objet contenant une méthode pour obtenir le DOM de l'en-tête.
 */
export function photographerHeaderTemplate(data) {
  const { photographerInfo } = data;
  const { name, city, country, tagline, portrait } = photographerInfo;

  function getHeaderDOM() {
    const picturePath = `assets/photographers/${portrait}`;

    const leftContainer = document.createElement("div");
    leftContainer.className = "photographer-header__left";

    const nameElement = document.createElement("h1");
    nameElement.id = "photographer-name";
    nameElement.className = "photographer-header__name";
    nameElement.textContent = name;

    const locationElement = document.createElement("p");
    locationElement.id = "photographer-location";
    locationElement.className = "photographer-header__location";
    locationElement.textContent = `${city}, ${country}`;

    const taglineElement = document.createElement("p");
    taglineElement.id = "photographer-tagline";
    taglineElement.className = "photographer-header__tagline";
    taglineElement.textContent = tagline;

    leftContainer.appendChild(nameElement);
    leftContainer.appendChild(locationElement);
    leftContainer.appendChild(taglineElement);

    const contactButton = document.createElement("button");
    contactButton.className = "photographer-header__contact-button";
    contactButton.setAttribute(
      "aria-label",
      `Contactez le photographe ${name}`
    );
    contactButton.tabIndex = 0;
    contactButton.textContent = "Contactez-moi";

    const rightContainer = document.createElement("div");
    rightContainer.className = "photographer-header__right";
    rightContainer.id = "photographer-description";

    const imageElement = document.createElement("img");
    imageElement.src = picturePath;
    imageElement.alt = "";
    imageElement.loading = "lazy";

    rightContainer.appendChild(imageElement);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(leftContainer);
    fragment.appendChild(contactButton);
    fragment.appendChild(rightContainer);

    return fragment;
  }

  return { getHeaderDOM };
}
