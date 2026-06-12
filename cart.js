function getCart() {
  return JSON.parse(localStorage.getItem("ridescaleCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("ridescaleCart", JSON.stringify(cart));
}

function setupSizePicker(productName) {
  const buttons = document.querySelectorAll(".size-option");
  const imageButtons = document.querySelectorAll(".image-choice");
  const fidgetRadios = document.querySelectorAll('input[name="fidgetType"]');
  const keychainRadios = document.querySelectorAll('input[name="keychainType"]');

  const customFidgetBox = document.getElementById("customFidgetBox");
  const customFidgetText = document.getElementById("customFidgetText");
  const customKeychainBox = document.getElementById("customKeychainBox");
  const customKeychainText = document.getElementById("customKeychainText");
  const nameKeychainBox = document.getElementById("nameKeychainBox");
  const keychainNameInput = document.getElementById("keychainNameInput");
  const keychainQuantityInput = document.getElementById("keychainQuantityInput");

  const priceText = document.getElementById("selectedPrice");
  const modelText = document.getElementById("selectedModel");
  const addBtn = document.getElementById("addToCartBtn");

  let selected = null;
  let selectedModel = imageButtons.length ? imageButtons[0].dataset.model : "";

  function getQuantity() {
    if (productName !== "Keychains" || !keychainQuantityInput) return 1;
    const qty = Number(keychainQuantityInput.value);
    return qty && qty > 0 ? qty : 1;
  }

  function getFidgetType() {
    const checked = document.querySelector('input[name="fidgetType"]:checked');
    if (!checked) return "";
    if (checked.value === "Custom Fidget") {
      const customText = customFidgetText ? customFidgetText.value.trim() : "";
      return customText ? `Custom Fidget: ${customText}` : "Custom Fidget";
    }
    return checked.value;
  }

  function getKeychainType() {
    const checked = document.querySelector('input[name="keychainType"]:checked');
    if (!checked) return "";

    if (checked.value === "Name Keychain") {
      const name = keychainNameInput ? keychainNameInput.value.trim() : "";
      return name ? `Name Keychain: ${name}` : "Name Keychain";
    }

    if (checked.value === "Custom Keychain") {
      const customText = customKeychainText ? customKeychainText.value.trim() : "";
      return customText ? `Custom Keychain: ${customText}` : "Custom Keychain";
    }

    return checked.value;
  }

  function getCurrentModel() {
    if (productName === "Fidgets") return getFidgetType();
    if (productName === "Keychains") return getKeychainType();
    return selectedModel;
  }

  function showMessage(message, isWarning = false) {
    let messageBox = document.getElementById("cartMessage");
    if (!messageBox) {
      messageBox = document.createElement("p");
      messageBox.id = "cartMessage";
      messageBox.className = "cart-message";
      addBtn.parentElement.insertAdjacentElement("afterend", messageBox);
    }

    messageBox.textContent = message;
    messageBox.classList.toggle("small-quality-warning", isWarning);
  }

  function showSmallQualityWarning(size) {
    if ((productName === "Fidgets" || productName === "Keychains") && size === "Small") {
      showMessage("Note: Small size is cheaper, but it may be lower quality and more likely to break because it is very small.", true);
    } else {
      showMessage("");
    }
  }

  function updateKeychainBoxes() {
    const checked = document.querySelector('input[name="keychainType"]:checked');
    if (!checked) return;

    if (nameKeychainBox) {
      nameKeychainBox.style.display = checked.value === "Name Keychain" ? "block" : "none";
    }

    if (customKeychainBox) {
      customKeychainBox.style.display = checked.value === "Custom Keychain" ? "block" : "none";
    }
  }

  imageButtons.forEach(button => {
    button.addEventListener("click", () => {
      imageButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      selectedModel = button.dataset.model;
      if (modelText) modelText.innerHTML = `Selected Model: <strong>${selectedModel}</strong>`;
      showMessage("");
    });
  });

  fidgetRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (customFidgetBox) customFidgetBox.style.display = radio.value === "Custom Fidget" && radio.checked ? "block" : "none";
      if (selected && productName === "Fidgets") selected.model = getFidgetType();
      showMessage("");
    });
  });

  keychainRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      updateKeychainBoxes();
      if (selected && productName === "Keychains") {
        selected.model = getKeychainType();
        selected.quantity = getQuantity();
        selected.price = Number(selected.unitPrice || selected.price) * selected.quantity;
      }
      showMessage("");
    });
  });

  if (keychainNameInput) {
    keychainNameInput.addEventListener("input", () => {
      if (selected && productName === "Keychains") selected.model = getKeychainType();
    });
  }

  if (keychainQuantityInput) {
    keychainQuantityInput.addEventListener("input", () => {
      if (selected && productName === "Keychains") {
        selected.quantity = getQuantity();
        selected.price = Number(selected.unitPrice) * selected.quantity;
        priceText.innerHTML = `Selected Size: <strong>${selected.size}</strong> - $${selected.unitPrice} each × ${selected.quantity} = $${selected.price}`;
      }
    });
  }

  if (customFidgetText) {
    customFidgetText.addEventListener("input", () => {
      if (selected && productName === "Fidgets") selected.model = getFidgetType();
    });
  }

  if (customKeychainText) {
    customKeychainText.addEventListener("input", () => {
      if (selected && productName === "Keychains") selected.model = getKeychainType();
    });
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const unitPrice = Number(button.dataset.price);
      const qty = getQuantity();

      selected = {
        product: productName,
        model: getCurrentModel(),
        size: button.dataset.size,
        dimensions: button.dataset.dimensions,
        unitPrice: unitPrice,
        quantity: qty,
        price: productName === "Keychains" ? unitPrice * qty : unitPrice
      };

      if (productName === "Keychains") {
        priceText.innerHTML = `Selected Size: <strong>${selected.size}</strong> - $${unitPrice} each × ${qty} = $${selected.price}`;
      } else {
        priceText.innerHTML = `Selected Size: <strong>${selected.size}</strong> - $${selected.price}`;
      }

      addBtn.disabled = false;
      showSmallQualityWarning(selected.size);
    });
  });

  addBtn.addEventListener("click", () => {
    if (!selected) {
      showMessage("Choose a size first.");
      return;
    }

    selected.model = getCurrentModel();

    if (productName === "Keychains") {
      selected.quantity = getQuantity();
      selected.price = Number(selected.unitPrice) * selected.quantity;
    }

    const cart = getCart();
    cart.push(selected);
    saveCart(cart);

    const displayName = selected.model ? `${selected.product} - ${selected.model}` : selected.product;
    const qtyText = selected.quantity && selected.quantity > 1 ? ` Quantity: ${selected.quantity}.` : "";
    showMessage(`${displayName} ${selected.size} added to cart.${qtyText}`);
  });

  updateKeychainBoxes();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "$0";
    return;
  }

  let total = 0;

  container.innerHTML = cart.map((item, index) => {
    total += Number(item.price);

    const modelLine = item.model ? `<br>${item.model}` : "";
    const qtyLine = item.quantity && item.quantity > 1 ? `<br>Quantity: ${item.quantity}` : "";
    const unitLine = item.unitPrice && item.quantity && item.quantity > 1 ? `<br>$${item.unitPrice} each` : "";

    return `
      <div class="cart-item">
        <div>
          <strong>${item.product}</strong>${modelLine}<br>
          ${item.size} - ${item.dimensions}${qtyLine}${unitLine}
        </div>
        <div>$${item.price}</div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = `$${total}`;
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}