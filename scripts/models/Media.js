export class Media {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.likes = data.likes;
    this.date = data.date;
    this.price = data.price;

    // On vérifie si l'élément contient une image ou une vidéo
    if (data.image) {
      this.image = data.image;
      this.isImage = true;
      this.isVideo = false;
    } else if (data.video) {
      this.video = data.video;
      this.isImage = false;
      this.isVideo = true;
    }
    this.isLiked = false; // État de like par défaut
  }
}
