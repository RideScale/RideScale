function getCart() {
  return JSON.parse(localStorage.getItem("ridescaleCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("ridescaleCart", JSON.stringify(cart));
}

function setupSizePicker(productName) {
  const buttons = document.querySelectorAll(".size-option");
  const imageButtons = document.querySelectorAll(".image-choice");
  const priceText = document.getElementById("selectedPrice");
  const modelText = document.getElementById("selectedModel");
  const addBtn = document.getElementById("addToCartBtn");

  let selected = null;
  let selectedModel = imageButtons.length ? imageButtons[0].dataset.model : "";

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

      if (modelText) {
        modelText.innerHTML = `Selected Model: <strong>${selectedModel}</strong>`;
      }

      showMessage("");
    });
  });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      selected = {
        product: productName,
        model: selectedModel,
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

    selected.model = selectedModel;

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
