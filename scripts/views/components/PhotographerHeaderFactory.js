export function createPhotographerHeader(data) {
  const { photographerInfo, photographerHeaderElement } = data;
  const { name, city, country, tagline, portrait } = photographerInfo;

  const picturePath = `assets/photographers/${portrait}`;

  photographerHeaderElement.innerHTML = `
    <div class="photograph-header__left" aria-labelledby="photographer-name" aria-describedby="photographer-location photographer-tagline">
      <h1 id="photographer-name" class="photograph-header__name" tabindex="0">${name}</h1>
      <p id="photographer-location" class="photograph-header__location" tabindex="0">${city}, ${country}</p>
      <p id="photographer-tagline" class="photograph-header__tagline" tabindex="0">${tagline}</p>
    </div>
    <button class="photograph-header__contact-button" aria-label="Contactez le photographe ${name}" tabindex="0">Contactez-moi</button>
    <div class="photograph-header__right" id="photographer-description"  tabindex="0" aria-label="${name}">
      <img src="${picturePath}" alt="" aria-describedby="photographer-description" />
    </div>
  `;

  return photographerHeaderElement;
}
