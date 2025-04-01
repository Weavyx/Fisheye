export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
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
      const photographerBanner = document.querySelector(".photograph-header");
      photographerBanner.prepend(
        this.view.createPhotographerBannerLeftComponent(photographer)
      );
      photographerBanner.append(
        this.view.createPhotographerBannerRightComponent(photographer)
      );
    });

    this.model.getPhotographerMedia(id).then((media) => {
      const worksContainer = document.querySelector(".work-container");
      media.forEach((work) => {
        worksContainer.appendChild(this.view.createPhotographerMediaCard(work));
      });
    });

    this.model.getPhotographerPriceAndTotalLikes(id).then((data) => {
      document
        .querySelector("body")
        .append(this.view.createStickyInfoBox(data.price, data.totalLikes));
    });
  }
}
