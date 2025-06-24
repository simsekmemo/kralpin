// 🔐 Kullanıcı Bilgisi
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

// 🟢 Kullanıcı profili yükle
if (document.getElementById("profile-username")) {
  document.getElementById("profile-username").textContent = currentUser.username || "Bilinmiyor";
  document.getElementById("profile-email").textContent = currentUser.email || "Bilinmiyor";
  document.getElementById("profile-verified").textContent = currentUser.verified ? "Doğrulandı ✅" : "Doğrulanmadı ❌";
  renderPurchaseHistory();
}

// 🚪 Kullanıcı çıkışı
if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

// 🔐 Şifre Değiştir
if (document.getElementById("change-password-btn")) {
  document.getElementById("change-password-btn").addEventListener("click", () => {
    const newPassword = document.getElementById("new-password").value.trim();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
      users[index].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Şifre başarıyla değiştirildi.");
    }
  });
}

// 🟢 Ürünler
const defaultProducts = [
  {
    title: "Valorant VP",
    image: "img/valorant.png",
    icon: "img/valorant.png",
    options: [
      { label: "130 VP", price: "60 TL" },
      { label: "475 VP", price: "130 TL" },
      { label: "1000 VP", price: "248 TL" }
    ]
  },
  {
    title: "League of Legends RP",
    image: "img/lol.png",
    icon: "img/lol.png",
    options: [
      { label: "575 RP", price: "130 TL" },
      { label: "1380 RP", price: "250 TL" }
    ]
  },
  {
    title: "Steam Random Key",
    image: "img/steamkey.png",
    icon: "img/steamkey.png",
    options: [{ label: "1 Adet", price: "20 TL" }],
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
    const heartId = `fav-${index}`;

    const optionsHTML = p.options.map((opt, i) => `<option value="${i}">${opt.label}</option>`).join("");
    const isQuantity = p.isQuantityBased;
    const isFavorite = (JSON.parse(localStorage.getItem("favorites") || "[]")).includes(p.title);

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="mb-4 rounded w-full h-40 object-cover bg-black p-1">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <img src="${p.icon}" alt="icon" class="w-6 h-6 rounded"> ${p.title}
        </h3>
        <span id="${heartId}" onclick="toggleFavorite('${p.title}')" class="text-2xl cursor-pointer">
          ${isFavorite ? "❤️" : "🤍"}
        </span>
      </div>
      <select id="${selectId}" class="p-2 w-full bg-gray-700 text-white rounded mb-2">
        ${optionsHTML}
      </select>
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
      const cart = JSON.parse(localStorage.getItem("cart") || []);
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

function toggleFavorite(title) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const index = favorites.indexOf(title);
  if (index !== -1) favorites.splice(index, 1);
  else favorites.push(title);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderProducts();
}

// 🔐 Kayıt işlemi
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) {
      alert("Bu e-posta ile zaten kayıt var.");
      return;
    }
    const newUser = { username, email, password, verified: true, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    alert("Kayıt başarılı.");
    window.location.href = "index.html";
  });
}

// 🔑 Giriş işlemi
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      alert("Giriş başarılı!");
      window.location.href = "index.html";
    } else {
      alert("E-posta veya şifre hatalı.");
    }
  });
}

// 👑 Admin Linkini Gizle/Göster
document.addEventListener("DOMContentLoaded", () => {
  const adminLink = document.getElementById("adminLink");
  if (adminLink && currentUser.role !== "admin") {
    adminLink.style.display = "none";
  }
});

// 🛒 Sepet Sayfası
function renderCart() {
  const cartContainer = document.getElementById("cart");
  const totalText = document.getElementById("total");
  if (!cartContainer || !totalText) return;
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p class='text-gray-400'>Sepetiniz boş.</p>";
    totalText.textContent = "";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = cart.map((item, index) => {
    const priceNum = parseFloat(item.price.replace(" TL", ""));
    total += priceNum;
    return `
      <div class="bg-gray-800 p-4 rounded flex justify-between items-center">
        <div>
          <h3 class="font-bold">${item.title}</h3>
          <p>${item.option} - ${item.price}</p>
        </div>
        <button onclick="removeItem(${index})" class="text-red-400 hover:underline">Sil</button>
      </div>
    `;
  }).join("");
  totalText.textContent = `Toplam: ${total.toFixed(2)} TL`;
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) renderProducts();
  if (document.getElementById("cart")) renderCart();
});

function renderFavorites() {
  const favoritesContainer = document.getElementById("favorites-list");
  if (!favoritesContainer) return;

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const products = getProducts();

  const favoriteProducts = products.filter(p => favorites.includes(p.title));

  if (favoriteProducts.length === 0) {
    favoritesContainer.innerHTML = "<p class='text-gray-400'>Favori ürün bulunamadı.</p>";
    return;
  }

  favoritesContainer.innerHTML = favoriteProducts.map(p => `
    <div class="bg-gray-800 p-4 rounded shadow">
      <img src="${p.image}" alt="${p.title}" class="mb-4 rounded w-full h-40 object-cover bg-black p-1">
      <h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
        <img src="${p.icon}" alt="icon" class="w-6 h-6 rounded"> ${p.title}
      </h3>
      <p class="text-green-400 font-bold">${p.options[0].price}</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("favorites-list")) renderFavorites();
});
