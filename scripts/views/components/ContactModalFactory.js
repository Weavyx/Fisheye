export function createContactModal(photographerName) {
  const modalElement = document.createElement("div");
  modalElement.setAttribute("id", "contact_modal");
  modalElement.setAttribute("aria-hidden", "true");
  modalElement.style.display = "none";

  modalElement.innerHTML = `
    <div class="modal">
      <header>
        <h2>Contactez-moi ${photographerName}</h2>
        <img src="assets/icons/close.svg" alt="Fermer la modale" class="close-modal" tabindex="0" />
      </header>
      <form>
        <div class="form-group">
          <label for="first-name">Prénom</label>
          <input type="text" id="first-name" name="first-name" required />
        </div>
        <div class="form-group">
          <label for="last-name">Nom</label>
          <input type="text" id="last-name" name="last-name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="form-group">
          <label for="message">Votre message</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" class="submit-button">Envoyer</button>
      </form>
    </div>
  `;

  return modalElement;
}
