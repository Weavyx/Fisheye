async function getPhotographer(id) {
  try {
    const response = await fetch("data/photographers.json");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des données");
    }
    const data = await response.json();

    // Trouve le photographe correspondant à l'ID
    const photographer = data.photographers.find((p) => p.id === parseInt(id));
    if (!photographer) {
      throw new Error("Photographe non trouvé");
    }

    // Récupère les travaux associés au photographe
    const works = data.media.filter(
      (media) => media.photographerId === parseInt(id)
    );
    return { ...photographer, works }; // Retourne les infos du photographe avec ses travaux
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function displayData(photographer) {
  if (!photographer) {
    console.error("Aucun photographe trouvé");
    return;
  }

  // Intégrer les informations du photographe
  const photographerHeader = document.querySelector(".photograph-header");
  const photographerInfos = document.createElement("div");
  const photographerName = document.createElement("h1");
  photographerName.textContent = photographer.name;
  photographerInfos.appendChild(photographerName);
  const location = document.createElement("p");
  location.textContent = `${photographer.city}, ${photographer.country}`;
  location.classList.add("location");
  photographerInfos.appendChild(location);
  const tagline = document.createElement("p");
  tagline.textContent = photographer.tagline;
  tagline.classList.add("tagline");
  photographerInfos.appendChild(tagline);
  photographerHeader.prepend(photographerInfos);

  // Intégrer la photo du photographe
  const photographerImage = document.createElement("img");
  photographerImage.setAttribute(
    "src",
    `assets/photographers/${photographer.portrait}`
  );
  photographerImage.setAttribute("alt", photographer.name);
  photographerHeader.append(photographerImage);

  // Intégrer le prix du photographe
  const encart = document.createElement("div");
  encart.setAttribute("id", "encart");
  const price = document.createElement("p");
  price.textContent = `${photographer.price}€/jour`;
  price.classList.add("price");
  encart.appendChild(price);
  document.body.appendChild(encart);

  // Intégrer son travail en fonction du tri choisi !!
  const worksContainer = document.querySelector(".work-container");
  photographer.works.forEach((work) => {
    const workModel = workTemplate(work);
    const workDOM = workModel.getWorkCardDOM();
    worksContainer.appendChild(workDOM);
  });
  // Créer le workTemplate, la manière dont on trie, le fait qu'on puisse naviguer au clavier, qu'on puisse cl=iquer sur les photos etc.
}

async function init() {
  // Récupère l'ID deu photographe dans l'URL
  const params = new URLSearchParams(window.location.search);
  const photographerId = params.get("id");
  console.log(photographerId);
  // Récupère les datas du photographe
  const photographer = await getPhotographer(photographerId);
  displayData(photographer);
}

init();
