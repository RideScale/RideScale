function getCart() {
  return JSON.parse(localStorage.getItem("ridescaleCart") || "[]");
}

function loadCheckoutSummary() {
  const cart = getCart();
  const itemsBox = document.getElementById("checkoutItems");
  const totalBox = document.getElementById("checkoutTotal");
  const summaryInput = document.getElementById("cartSummaryInput");
  const totalInput = document.getElementById("cartTotalInput");

  if (!itemsBox || !totalBox) return;

  if (!cart.length) {
    itemsBox.innerHTML = "<p>No cart items found. You can still submit a custom request.</p>";
    totalBox.textContent = "$0";
    if (summaryInput) summaryInput.value = "No cart items found.";
    if (totalInput) totalInput.value = "$0";
    return;
  }

  let total = 0;

  const summaryLines = cart.map((item, index) => {
    total += Number(item.price);
    return `${index + 1}. ${item.product} - ${item.size} - ${item.dimensions} - $${item.price}`;
  });

  itemsBox.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.product} - ${item.size}</span>
      <strong>$${item.price}</strong>
    </div>
  `).join("");

  totalBox.textContent = `$${total}`;

  if (summaryInput) summaryInput.value = summaryLines.join("\n");
  if (totalInput) totalInput.value = `$${total}`;
}

document.addEventListener("DOMContentLoaded", loadCheckoutSummary);
