function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const cadre = document.createElement("div");
    cadre.classList.add("cadre");
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.classList.add("location");
    const taglineElement = document.createElement("p");
    taglineElement.textContent = tagline;
    taglineElement.classList.add("tagline");
    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;
    priceElement.classList.add("price");
    cadre.appendChild(img);
    article.appendChild(cadre);
    article.appendChild(h2);
    article.appendChild(location);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);
    // Pas de lien sur image mais un event ?
    article.addEventListener(
      "click",
      () => {
        // Redirection vers la page du photographe
        window.location.href = `photographer.html?id=${id}`;
      },
      false
    );
    return article;
  }
  return { getUserCardDOM };

  function getPhotographerFromId(id) {
    const photographer = data.find((photographer) => photographer.id === id);
    return photographer;
  }
}
