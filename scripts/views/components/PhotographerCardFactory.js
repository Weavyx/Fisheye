export function createPhotographerCard(data) {
  console.log("Creating Photographer Card with data:", data);
  const { name, id, city, country, tagline, price, portrait } = data;
  const cardElement = document.createElement("article");
  cardElement.classList.add("photographer-card");
  const picturePath = `assets/photographers/${portrait}`;

  cardElement.innerHTML = `
    <div class="cadre">
      <img src="${picturePath}" alt="Portrait de ${name}" />
    </div>
    <h2>${name}</h2>
    <p class="location">${city}, ${country}</p>
    <p class="tagline">${tagline}</p>
    <p class="price">${price}€/jour</p>
  `;

  const navigateToPhotographer = () => {
    window.location.href = `photographer.html?id=${id}`;
  };

  cardElement.addEventListener("click", navigateToPhotographer);
  return cardElement;
}
