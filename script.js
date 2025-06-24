
// Basitleştirilmiş örnek: kullanıcı, ürün ve doğrulama sistemi
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

if (document.getElementById("profile-username")) {
  document.getElementById("profile-username").textContent = currentUser.username || "Bilinmiyor";
  document.getElementById("profile-email").textContent = currentUser.email || "Bilinmiyor";
  document.getElementById("profile-verified").textContent = currentUser.verified ? "Doğrulandı ✅" : "Doğrulanmadı ❌";
}

if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

if (document.getElementById("productForm")) {
  document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Ürün eklendi (simülasyon)");
  });
}

// Kullanıcı kayıt formu
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.email === email)) {
      alert("Bu e-posta adresi zaten kayıtlı.");
      return;
    }

    users.push({ username, email, password, verified: true });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({ username, email, verified: true }));

    alert("Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...");
    window.location.href = "index.html";
  });
}
