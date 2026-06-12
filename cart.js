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

  const priceText = document.getElementById("selectedPrice");
  const modelText = document.getElementById("selectedModel");
  const addBtn = document.getElementById("addToCartBtn");

  let selected = null;
  let selectedModel = imageButtons.length ? imageButtons[0].dataset.model : "";

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

  function showMessage(message) {
    let messageBox = document.getElementById("cartMessage");
    if (!messageBox) {
      messageBox = document.createElement("p");
      messageBox.id = "cartMessage";
      messageBox.className = "cart-message";
      addBtn.parentElement.insertAdjacentElement("afterend", messageBox);
    }
    messageBox.textContent = message;
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
      if (customKeychainBox) customKeychainBox.style.display = radio.value === "Custom Keychain" && radio.checked ? "block" : "none";
      if (selected && productName === "Keychains") selected.model = getKeychainType();
      showMessage("");
    });
  });

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

      selected = {
        product: productName,
        model: getCurrentModel(),
        size: button.dataset.size,
        dimensions: button.dataset.dimensions,
        price: Number(button.dataset.price)
      };

      priceText.innerHTML = `Selected Size: <strong>${selected.size}</strong> - $${selected.price}`;
      addBtn.disabled = false;
      showMessage("");
    });
  });

  addBtn.addEventListener("click", () => {
    if (!selected) {
      showMessage("Choose a size first.");
      return;
    }

    selected.model = getCurrentModel();

    const cart = getCart();
    cart.push(selected);
    saveCart(cart);

    const displayName = selected.model ? `${selected.product} - ${selected.model}` : selected.product;
    showMessage(`${displayName} ${selected.size} added to cart.`);
  });
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
    total += item.price;
    const modelLine = item.model ? `<br>${item.model}` : "";

    return `
      <div class="cart-item">
        <div>
          <strong>${item.product}</strong>${modelLine}<br>
          ${item.size} - ${item.dimensions}
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