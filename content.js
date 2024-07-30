let isPickerActive = false;

if (!window.hasRun) {
  window.hasRun = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startPicker") {
      togglePicker();
    }
  });

  function togglePicker() {
    isPickerActive = !isPickerActive;
    if (isPickerActive) {
      document.body.style.cursor = "crosshair";
      document.addEventListener("mouseover", highlightElement);
      document.addEventListener("click", selectElement, true);
      overlayClickableElements();
    } else {
      document.body.style.cursor = "default";
      document.removeEventListener("mouseover", highlightElement);
      document.removeEventListener("click", selectElement, true);
      removeAllHighlights();
    }
  }

  function hasOnClickListener(element) {
    return element.onclick !== null || element.getAttribute("onclick") !== null;
  }

  function highlightElement(e) {
    e.stopPropagation();
    if (hasOnClickListener(e.target)) {
      removeAllHighlights();
      e.target.classList.add("extension-highlight");
    }
  }

  function selectElement(e) {
    if (!isPickerActive) return;
    e.stopPropagation();
    e.preventDefault();
    if (hasOnClickListener(e.target)) {
      console.log("Selected element:", e.target);
      alert(
        `Selected clickable element: ${e.target.tagName.toLowerCase()}${
          e.target.id ? "#" + e.target.id : ""
        }`
      );
      togglePicker();
    }
  }

  function removeAllHighlights() {
    document
      .querySelectorAll(".extension-highlight, .extension-clickable-overlay")
      .forEach((el) => {
        el.classList.remove(
          "extension-highlight",
          "extension-clickable-overlay"
        );
      });
  }

  function overlayClickableElements() {
    removeAllHighlights();
    const allElements = document.getElementsByTagName("*");
    for (let element of allElements) {
      if (hasOnClickListener(element)) {
        element.classList.add("extension-clickable-overlay");
      }
    }
  }

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .extension-highlight {
      outline: 2px solid red !important;
      background-color: rgba(255, 0, 0, 0.2) !important;
    }
    .extension-clickable-overlay {
      outline: 2px dashed blue !important;
      background-color: rgba(0, 0, 255, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
}
