/**
 * Génère un modèle pour afficher une carte de photographe.
 * @param {Object} data - Les données nécessaires pour le modèle.
 * @param {string} data.name - Le nom du photographe.
 * @param {string} data.city - La ville du photographe.
 * @param {string} data.country - Le pays du photographe.
 * @param {string} data.tagline - Le slogan du photographe.
 * @param {number} data.price - Le prix par jour du photographe.
 * @param {string} data.portrait - Le chemin vers le portrait du photographe.
 * @returns {Object} Un objet contenant une méthode pour obtenir le DOM de la carte.
 */
export function photographerCardTemplate(data) {
  const { name, city, country, tagline, price, portrait } = data;

  function getCardDOM() {
    const cardElement = document.createElement("article");
    cardElement.classList.add("photographer-section__article");

    const imgElement = document.createElement("img");
    imgElement.classList.add("photographer-section__img");
    imgElement.src = `assets/photographers/${portrait}`;
    imgElement.alt = "";
    imgElement.setAttribute("loading", "lazy");

    cardElement.innerHTML = `
      <div class="photographer-section__header" tabindex="0" aria-label="${name}">
        <div class="photographer-section__frame"></div>
        <h2 class="photographer-section__name">${name}</h2>
      </div>
      <div class="photographer-section__details">
        <p class="photographer-section__location">${city}, ${country}</p>
        <p class="photographer-section__tagline">${tagline}</p>
        <p class="photographer-section__price">${price}€/jour</p>
      </div>
    `;

    cardElement
      .querySelector(".photographer-section__frame")
      .appendChild(imgElement);

    return cardElement;
  }

  return { getCardDOM };
}
