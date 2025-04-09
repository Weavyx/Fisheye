export function createDropdown(options, defaultOption, onChangeCallback) {
  const dropdownElement = document.createElement("div");
  dropdownElement.classList.add("dropdown");

  const selectedElement = document.createElement("button");
  selectedElement.classList.add("dropdown__selected");
  selectedElement.textContent = defaultOption;
  selectedElement.setAttribute("aria-haspopup", "listbox");
  selectedElement.setAttribute("aria-expanded", "false");

  const optionsList = document.createElement("ul");
  optionsList.classList.add("dropdown__options");
  optionsList.setAttribute("role", "listbox");

  options.forEach((option) => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("dropdown__option");
    optionElement.textContent = option;
    optionElement.setAttribute("role", "option");
    optionElement.setAttribute("tabindex", "0");

    optionElement.addEventListener("click", () => {
      selectedElement.textContent = option;
      selectedElement.setAttribute("aria-expanded", "false");
      optionsList.style.display = "none";
      onChangeCallback(option);
    });

    optionsList.appendChild(optionElement);
  });

  selectedElement.addEventListener("click", () => {
    const isExpanded = selectedElement.getAttribute("aria-expanded") === "true";
    selectedElement.setAttribute("aria-expanded", !isExpanded);
    optionsList.style.display = isExpanded ? "none" : "block";
  });

  dropdownElement.appendChild(selectedElement);
  dropdownElement.appendChild(optionsList);

  return dropdownElement;
}
