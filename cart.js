function getCart() {
  return JSON.parse(localStorage.getItem("ridescaleCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("ridescaleCart", JSON.stringify(cart));
}

function setupSizePicker(productName) {
  const buttons = document.querySelectorAll(".size-option");
  const priceText = document.getElementById("selectedPrice");
  const addBtn = document.getElementById("addToCartBtn");
  let selected = null;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      selected = {
        product: productName,
        size: button.dataset.size,
        dimensions: button.dataset.dimensions,
        price: Number(button.dataset.price)
      };
      priceText.innerHTML = `Selected: <strong>${selected.size}</strong> - $${selected.price}`;
      addBtn.disabled = false;
    });
  });

  addBtn.addEventListener("click", () => {
    if (!selected) {
      alert("Choose a size first.");
      return;
    }
    const cart = getCart();
    cart.push(selected);
    saveCart(cart);
    alert(`${selected.product} ${selected.size} added to cart.`);
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
    return `
      <div class="cart-item">
        <div>
          <strong>${item.product}</strong><br>
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