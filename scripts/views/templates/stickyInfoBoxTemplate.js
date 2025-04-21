/**
 * Génère un modèle pour afficher une boîte d'informations collante contenant les likes et le prix d'un photographe.
 * @param {Object} data - Les données nécessaires pour le modèle.
 * @param {number} data.photographerTotalLikes - Le nombre total de likes du photographe.
 * @param {number} data.photographerPrice - Le prix par jour du photographe.
 * @returns {Object} Un objet contenant les données et une méthode pour obtenir le DOM de la boîte d'informations.
 */
export function stickyInfoBoxTemplate(data) {
  const { photographerTotalLikes, photographerPrice } = data;

  function getStickyInfoBoxDOM() {
    const formattedLikes = new Intl.NumberFormat("fr-FR")
      .format(photographerTotalLikes)
      .replace(/ /g, "&nbsp;");

    const stickyInfoBoxElement = document.createElement("div");
    stickyInfoBoxElement.setAttribute("id", "sticky-info-box");
    stickyInfoBoxElement.innerHTML = `
      <div class="sticky-info-box__likes-container">
        <span class="sticky-info-box__total-likes">${formattedLikes}</span>
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.125 18.35L7.85625 17.03C3.35 12.36 0.375 9.28 0.375 5.5C0.375 2.42 2.4925 0 5.1875 0C6.71 0 8.17125 0.81 9.125 2.09C10.0787 0.81 11.54 0 13.0625 0C15.7575 0 17.875 2.42 17.875 5.5C17.875 9.28 14.9 12.36 10.3938 17.04L9.125 18.35Z" fill="black">
        </svg>
      </div>
      <p class="sticky-info-box__price">${photographerPrice}€/jour</p>
    `;

    return stickyInfoBoxElement;
  }

  return { photographerTotalLikes, photographerPrice, getStickyInfoBoxDOM };
}
