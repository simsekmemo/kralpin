const defaultProducts = [
  {
    title: "Valorant VP",
    image: "img/valorant.png",
    icon: "img/valorant.png",
    options: [
      { label: "130 VP", price: "60 TL" },
      { label: "475 VP", price: "130 TL" },
      { label: "1000 VP", price: "248 TL" },
      { label: "2050 VP", price: "500 TL" },
      { label: "3650 VP", price: "830 TL" }
    ]
  },
  {
    title: "League of Legends RP",
    image: "img/lol.png",
    icon: "img/lol.png",
    options: [
      { label: "575 RP", price: "130 TL" },
      { label: "1380 RP", price: "250 TL" },
      { label: "2800 RP", price: "490 TL" }
    ]
  },
  {
    title: "Steam Random Key",
    image: "img/steamkey.png",
    icon: "img/steamkey.png",
    options: [
      { label: "1 Adet", price: "20 TL" }
    ],
    isQuantityBased: true
  },
  {
    title: "Google Play Kod",
    image: "img/googleplay.png",
    icon: "img/googleplay.png",
    options: [
      { label: "50 TL Kod", price: "50 TL" },
      { label: "100 TL Kod", price: "100 TL" }
    ]
  }
];

function getProducts() {
  const stored = localStorage.getItem("products");
  return stored ? JSON.parse(stored) : defaultProducts;
}

function renderProducts() {
  const products = getProducts();
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";

  products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "bg-gray-800 p-4 rounded shadow";

    const selectId = `select-${index}`;
    const priceId = `price-${index}`;
    const quantityId = `quantity-${index}`;

    const optionsHTML = p.options.map(
      (opt, i) => `<option value="${i}">${opt.label}</option>`
    ).join("");

    const isQuantity = p.isQuantityBased;

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="mb-4 rounded w-full h-40 object-cover bg-black p-1">
      <h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
        <img src="${p.icon}" alt="icon" class="w-6 h-6 rounded"> ${p.title}
      </h3>
      <div class="mb-2">
        <select id="${selectId}" class="p-2 w-full bg-gray-700 text-white rounded">
          ${optionsHTML}
        </select>
      </div>
      ${isQuantity ? `
        <div class="flex items-center justify-between mb-2">
          <button class="bg-gray-700 text-white px-3 py-1 rounded" onclick="updateQuantity(${index}, -1)">−</button>
          <span id="${quantityId}" class="font-bold text-white">1</span>
          <button class="bg-gray-700 text-white px-3 py-1 rounded" onclick="updateQuantity(${index}, 1)">+</button>
        </div>` : ''}
      <p id="${priceId}" class="mb-2 text-green-400 font-bold">${p.options[0].price}</p>
      <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded add-to-cart">Sepete Ekle</button>
    `;

    container.appendChild(card);

    const select = card.querySelector(`#${selectId}`);
    const priceText = card.querySelector(`#${priceId}`);
    const addBtn = card.querySelector(".add-to-cart");

    let quantity = 1;

    if (isQuantity) {
      window[`updateQuantity`] = (idx, delta) => {
        if (idx !== index) return;
        quantity = Math.max(1, quantity + delta);
        card.querySelector(`#${quantityId}`).textContent = quantity;

        const basePrice = parseFloat(p.options[select.value].price.replace(" TL", ""));
        priceText.textContent = `${(basePrice * quantity).toFixed(2)} TL`;
      };
    }

    select.addEventListener("change", () => {
      const selected = p.options[select.value];
      const basePrice = parseFloat(selected.price.replace(" TL", ""));
      priceText.textContent = isQuantity ? `${(basePrice * quantity).toFixed(2)} TL` : selected.price;
    });

    addBtn.addEventListener("click", () => {
      const selected = p.options[select.value];
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.push({
        title: p.title,
        option: isQuantity ? `${quantity} Adet` : selected.label,
        price: isQuantity ? `${(parseFloat(selected.price.replace(" TL", "")) * quantity).toFixed(2)} TL` : selected.price
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${p.title} (${isQuantity ? quantity + " Adet" : selected.label}) sepete eklendi!`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) renderProducts();
});
