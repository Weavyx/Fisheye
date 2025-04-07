export function createPhotographerBanner(photographer) {
  const { name, city, country, tagline, portrait } = photographer;
  const bannerElement = document.createElement("div");
  bannerElement.classList.add("photograph-header");

  const picturePath = `assets/photographers/${portrait}`;

  bannerElement.innerHTML = `
    <div class="left-component">
      <h1>${name}</h1>
      <p class="location">${city}, ${country}</p>
      <p class="tagline">${tagline}</p>
    </div>
    <button class="contact_button">Contactez-moi</button>
    <div class="right-component">
      <img src="${picturePath}" alt="Portrait de ${name}" />
    </div>
  `;

  return bannerElement;
}
