export function createContactModal(photographerName) {
  const modalElement = document.createElement("div");
  modalElement.setAttribute("id", "contact_modal");
  modalElement.setAttribute("aria-hidden", "true");
  modalElement.style.display = "none";

  modalElement.innerHTML = `
    <div class="contact-modal">
      <header class="contact-modal__header">
        <h2 class="contact-modal__title">Contactez-moi ${photographerName}</h2>
        <img src="assets/icons/close.svg" aria-label="Fermer la modale" class="contact-modal__close" tabindex="0">
      </header>
      <form class="contact-modal__form">
        <div class="contact-modal__form-group">
          <label for="first-name" class="contact-modal__label">Prénom</label>
          <input type="text" id="first-name" name="first-name" class="contact-modal__input" required aria-label="Prénom"/>
        </div>
        <div class="contact-modal__form-group">
          <label for="last-name" class="contact-modal__label">Nom</label>
          <input type="text" id="last-name" name="last-name" class="contact-modal__input" required aria-label="Nom"/>
        </div>
        <div class="contact-modal__form-group">
          <label for="email" class="contact-modal__label">Email</label>
          <input type="email" id="email" name="email" class="contact-modal__input" required aria-label="Email"/>
        </div>
        <div class="contact-modal__form-group">
          <label for="message" class="contact-modal__label">Votre message</label>
          <textarea id="message" name="message" rows="5" class="contact-modal__textarea" required aria-label="Votre message"></textarea>
        </div>
        <button type="submit" class="contact-modal__submit-button"aria-label="Envoyer le formulaire">Envoyer</button>
      </form>
    </div>
  `;

  return modalElement;
}
