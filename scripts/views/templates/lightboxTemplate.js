/**
 * Génère un modèle pour afficher une lightbox contenant un média (image ou vidéo).
 * @param {Object} mediaData - Les données nécessaires pour le modèle.
 * @param {string} [mediaData.image] - Le chemin vers l'image (si applicable).
 * @param {string} [mediaData.video] - Le chemin vers la vidéo (si applicable).
 * @param {string} mediaData.title - Le titre du média.
 * @returns {Object} Un objet contenant une méthode pour obtenir le DOM de la lightbox.
 */
export function lightboxTemplate(mediaData) {
  function getLightboxDOM() {
    const container = document.createElement("div");

    let mediaElement;
    if (mediaData.image) {
      mediaElement = document.createElement("img");
      mediaElement.setAttribute("src", `assets/media/image/${mediaData.image}`);
      mediaElement.setAttribute("alt", mediaData.title);
      mediaElement.setAttribute("loading", "lazy");
      mediaElement.classList.add("lightbox__media");
    } else if (mediaData.video) {
      mediaElement = document.createElement("video");
      mediaElement.setAttribute("controls", "");
      mediaElement.setAttribute("autoplay", "");
      mediaElement.classList.add("lightbox__media");

      const sourceElement = document.createElement("source");
      sourceElement.src = `assets/media/video/${mediaData.video}`;
      sourceElement.type = "video/webm; codecs=av01.0.05M.08,opus";

      mediaElement.appendChild(sourceElement);
      mediaElement.insertAdjacentHTML(
        "beforeend",
        "Votre navigateur ne supporte pas la balise vidéo HTML5."
      );
    }

    const titleElement = document.createElement("p");
    titleElement.classList.add("lightbox__title");
    titleElement.textContent = mediaData.title;

    container.appendChild(mediaElement);
    container.appendChild(titleElement);

    return container;
  }

  return { getLightboxDOM };
}
