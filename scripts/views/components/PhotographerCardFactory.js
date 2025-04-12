export function createPhotographerCard(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const cardElement = document.createElement("article");
  cardElement.classList.add("photographer-section__article");

  const imgElement = document.createElement("img");
  imgElement.classList.add("photographer-section__img");
  imgElement.src = `assets/photographers/${portrait}`;
  imgElement.alt = "";

  cardElement.innerHTML = `
    <div class="photographer-section__header" tabindex="0" aria-label="${name}">
      <div class="photographer-section__frame"></div>
      <h2 class="photographer-section__name">${name}</h2>
    </div>
    <div class="photographer-section__details">
      <p class="photographer-section__location" tabindex="0">${city}, ${country}</p>
      <p class="photographer-section__tagline" tabindex="0">${tagline}</p>
      <p class="photographer-section__price" tabindex="0">${price}€/jour</p>
    </div>
  `;

  cardElement
    .querySelector(".photographer-section__frame")
    .appendChild(imgElement);

  return cardElement;
}
