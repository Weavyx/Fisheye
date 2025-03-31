async function getPhotographers() {
  try {
    const response = await fetch("data/photographers.json");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des données");
    }
    const data = await response.json();
    return data; // Retourne directement les données du fichier JSON
  } catch (error) {
    console.error(error);
    return { photographers: [] }; // Retourne un tableau vide en cas d'erreur
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
