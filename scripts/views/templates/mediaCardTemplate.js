/**
 * Génère un modèle pour afficher une carte média (image ou vidéo).
 * @param {Object} data - Les données nécessaires pour le modèle.
 * @param {string} data.title - Le titre du média.
 * @param {string} [data.image] - Le chemin vers l'image (si applicable).
 * @param {string} [data.video] - Le chemin vers la vidéo (si applicable).
 * @param {number} data.likes - Le nombre de likes du média.
 * @param {boolean} data.isLiked - Indique si le média est déjà liké.
 * @returns {Object} Un objet contenant une méthode pour obtenir le DOM de la carte média.
 */
export function mediaCardTemplate(data) {
  const { title, image, video, likes, isLiked } = data;

  function getMediaCardDOM() {
    const cardElement = document.createElement("div");
    cardElement.setAttribute("role", "listitem");

    let mediaElement;
    if (image) {
      mediaElement = document.createElement("img");
      mediaElement.classList.add("media");
      mediaElement.src = `assets/media/image/${image}`;
      mediaElement.alt = title;
      mediaElement.setAttribute("loading", "lazy");
      mediaElement.setAttribute("tabindex", "0");
    } else if (video) {
      mediaElement = document.createElement("video");
      mediaElement.classList.add("media");
      // mediaElement.setAttribute("controls", "");
      mediaElement.setAttribute("width", "640");
      mediaElement.setAttribute("height", "360");

      const sourceElement = document.createElement("source");
      sourceElement.src = `assets/media/video/${video}`;
      sourceElement.type = "video/webm; codecs=av01.0.05M.08,opus";

      mediaElement.appendChild(sourceElement);
      mediaElement.insertAdjacentHTML(
        "beforeend",
        "Votre navigateur ne supporte pas la balise vidéo HTML5."
      );
    }

    const likedClass = isLiked ? "liked" : "";

    cardElement.innerHTML = `
    <article class="photographer-work__media-card">
      <div class="photographer-work__media-info">
        <h2 class="photographer-work__media-title">${title}</h2>
        <div class="photographer-work__likes-container" tabindex='0' -label=aria"Nombre de likes du média : ${likes}">
          <p class="photographer-work__likes">${likes}</p>
          <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="photographer-work__heart-icon ${likedClass}">
            <path d="M9.5 18.35L8.23125 17.03C3.725 12.36 0.75 9.28 0.75 5.5C0.75 2.42 2.8675 0 5.5625 0C7.085 0 8.54625 0.81 9.5 2.09C10.4537 0.81 11.915 0 13.4375 0C16.1325 0 18.25 2.42 18.25 5.5C18.25 9.28 15.275 12.36 10.7688 17.04L9.5 18.35Z" stroke="#911C1C"/>
          </svg>
        </div>
      </div>
    </article>
    `;

    // Insérer l'élément média dans la div .photographer-work__media-info
    const mediaContainer = cardElement.querySelector(
      ".photographer-work__media-card"
    );
    mediaContainer.insertAdjacentElement("afterbegin", mediaElement);

    return cardElement;
  }

  return { getMediaCardDOM };
}
