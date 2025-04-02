export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.controller = this;
    this.view.model = this.model;
  }

  RenderIndex() {
    this.model.getPhotographers().then((photographers) => {
      const photographersSection = document.querySelector(
        ".photographer_section"
      );
      photographers.forEach((photographer) => {
        photographersSection.appendChild(
          this.view.createPhotographerIndexCard(photographer)
        );
      });
    });
  }

  RenderPhotographer(id) {
    this.model.getPhotographer(id).then((photographer) => {
      // Récupérer et afficher la bannière du photographe
      this.view.renderPhotographerBanner(photographer);

      // Charger les médias du photographe
      this.model.getPhotographerMediaAndTotalLikes(id).then((data) => {
        // Mettre à jour le total des likes du photographe
        const { media, totalLikes } = data;
        this.model.updatePhotographerTotalLikesParam(photographer, totalLikes);
        // Charger les informations de prix et de likes totaux
        this.view.renderStickyInfoBox(
          photographer.price,
          photographer.totalLikes
        );

        // Charger et afficher les médias du photographe
        this.view.renderPhotographerMedia(media, photographer);

        // Ajouter un evenement de tri
        this.view.addSortEvent(media, photographer);

        // Ajouter un evement pour la modale
        this.view.addModalEvent();
      });
    });
  }
}
