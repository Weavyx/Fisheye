export function createLightbox(mediaData) {
  const mediaType = mediaData.image ? "img" : "video";
  const mediaPath = mediaData.image
    ? `assets/media/image/${mediaData.image}`
    : `assets/media/video/${mediaData.video}`;

  const mediaElement = document.createElement(mediaType);
  mediaElement.setAttribute("src", mediaPath);
  mediaElement.setAttribute("alt", mediaData.title);
  mediaElement.setAttribute("aria-label", "Vue rapprochée du media");
  mediaElement.classList.add("lightbox__media");

  if (mediaType === "video") {
    mediaElement.setAttribute("controls", "true");
  }

  const titleElement = document.createElement("p");
  titleElement.classList.add("lightbox__title");
  titleElement.setAttribute("aria-label", "Titre du média: " + mediaData.title);
  titleElement.setAttribute("tabindex", "0");
  titleElement.textContent = mediaData.title;

  const container = document.createElement("div");
  container.appendChild(mediaElement);
  container.appendChild(titleElement);

  return container;
}
