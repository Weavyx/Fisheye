export function createMediaCard(data) {
  const { title, image, video, likes, isLiked } = data;
  const cardElement = document.createElement("article");
  cardElement.classList.add("photograph-work__media-card");
  cardElement.setAttribute("role", "listitem");
  const mediaPath = image
    ? `assets/media/image/${image}`
    : `assets/media/video/${video}`;
  const mediaType = image ? "image" : "video";
  const likedClass = isLiked ? "liked" : "";

  cardElement.innerHTML = `
    <${mediaType} class="media" src="${mediaPath}" alt="${title}" tabindex="0"></${mediaType}>
    <div class="photograph-work__media-info">
      <p class="photograph-work__media-title" tabindex='0' aria-label="${title}">${title}</p>
      <span class="photograph-work__likes-container" tabindex='0' aria-label="Nombre de likes du média : ${likes}">
        <p class="photograph-work__likes">${likes}</p>
        <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="photograph-work__heart-icon ${likedClass}">
          <path d="M9.5 18.35L8.23125 17.03C3.725 12.36 0.75 9.28 0.75 5.5C0.75 2.42 2.8675 0 5.5625 0C7.085 0 8.54625 0.81 9.5 2.09C10.4537 0.81 11.915 0 13.4375 0C16.1325 0 18.25 2.42 18.25 5.5C18.25 9.28 15.275 12.36 10.7688 17.04L9.5 18.35Z" stroke="#911C1C"/>
        </svg>
      </span>
    </div>
  `;

  return cardElement;
}
