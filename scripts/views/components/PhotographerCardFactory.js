export function createPhotographerCard(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const cardElement = document.createElement("article");
  cardElement.classList.add("photographer-section__article");
  const picturePath = `assets/photographers/${portrait}`;

  cardElement.setAttribute("tabindex", "0");

  const imgElement = document.createElement("img");
  imgElement.src = picturePath;
  imgElement.alt = `Portrait de ${name}`;
  imgElement.onload = () => {
    const ratio = imgElement.width / imgElement.height;
    if (ratio > 1) {
      imgElement.classList.add("portrait--horizontal");
    } else {
      imgElement.classList.add("portrait--vertical");
    }
    imgElement.classList.add("photographer-section__img");
  };

  cardElement.innerHTML = `
    <div class="photographer-section__frame"></div>
    <h2 class="photographer-section__name">${name}</h2>
    <p class="photographer-section__location">${city}, ${country}</p>
    <p class="photographer-section__tagline">${tagline}</p>
    <p class="photographer-section__price">${price}€/jour</p>
  `;

  cardElement
    .querySelector(".photographer-section__frame")
    .appendChild(imgElement);

  return cardElement;
}
