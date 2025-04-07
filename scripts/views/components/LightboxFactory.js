export function createLightbox(mediaData) {
  const lightboxElement = document.createElement("div");
  lightboxElement.setAttribute("id", "lightbox");
  lightboxElement.setAttribute("aria-hidden", "true");
  lightboxElement.style.display = "none";

  const lightboxContentElement = document.createElement("div");
  lightboxContentElement.classList.add("lightbox-content");

  const mediaType = mediaData.image ? "img" : "video";
  const mediaPath = mediaData.image
    ? `assets/media/image/${mediaData.image}`
    : `assets/media/video/${mediaData.video}`;

  const mediaElement = document.createElement(mediaType);
  mediaElement.setAttribute("src", mediaPath);
  mediaElement.setAttribute("alt", mediaData.title);
  mediaElement.classList.add("lightbox-media");

  if (mediaType === "video") {
    mediaElement.setAttribute("controls", "true");
  }

  const titleElement = document.createElement("p");
  titleElement.classList.add("lightbox-title");
  titleElement.textContent = mediaData.title;

  lightboxContentElement.appendChild(mediaElement);
  lightboxContentElement.appendChild(titleElement);

  lightboxElement.appendChild(lightboxContentElement);

  return lightboxElement;
}
