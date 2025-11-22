const nomorWA = "6282146212007";

// ===============================
// FORMAT BERAT (GRAM → KG OTOMATIS)
// ===============================
function formatBerat(gram) {
  if (gram >= 1000) {
    let kg = gram / 1000;
    return (kg % 1 === 0 ? kg : kg.toFixed(2)) + " kg";
  }
  return gram + " gr";
}

// ===============================
// DATA PRODUK + STOK + BERAT
// ===============================
const produkList = [
  // PRODUK PAPIR / KERTAS LINTING
  {
    nama:"Papir Linting Brown Natural 50 Lembar",
    harga:5000,
    stok:100,
    berat:20,
    kategori:"PAPIR / KERTAS LINTING",
    gambar:"gambar/gambar produk/papir-brown.jpg",
    deskripsi:"Kertas linting natural warna coklat. Tebal, tidak mudah robek."
  },
  {
    nama:"Papir Linting Transparan Ultra Thin",
    harga:7000,
    stok:100,
    berat:15,
    kategori:"PAPIR / KERTAS LINTING",
    gambar:"../tahap1/gambar/gambar produk/papir-anak.jpg",
    deskripsi:"Ultra tipis, pembakaran halus, tanpa bahan kimia tambahan."
  },
  {
    nama:"OCB Brown Paper Slim Long",
    harga:12000,
    stok:50,
    berat:25,
    kategori:"PAPIR / KERTAS LINTING",
    gambar:"../tahap1/gambar/gambar produk/ocb-slim.jpg",
    deskripsi:"OCB premium slim panjang • 32 lembar • Tebal merata."
  },
  {
    nama:"RAW Classic Rolling Paper",
    harga:15000,
    stok:70,
    berat:30,
    kategori:"PAPIR / KERTAS LINTING",
    gambar:"../tahap1/gambar/gambar produk/raw-classic.jpg",
    deskripsi:"RAW original import • 50 lembar • Natural unbleached."
  },
  // ALAT LINTING
  {
    nama:"Linting Brown Natural 50 Lembar",
    harga:5000,
    stok:100,
    berat:22,
    kategori:"ALAT LINTING",
    gambar:"../tahap1/gambar/gambar produk/papir-brown.jpg",
    deskripsi:"Kertas linting natural warna coklat. Tebal, tidak mudah robek."
  }
];

let cart = [];
const container = document.getElementById("productGrid");

function updateCartCount(){ 
  document.getElementById("cart-count").textContent = cart.length; 
}

// ===============================
// BUKA KATEGORI PRODUK
// ===============================
function openKategori(kat) {
  document.getElementById("judulKategori").style.display = "block";
  document.getElementById("judulKategori").textContent = kat;
  container.style.display = "grid";
  renderProdukKategori(kat);
}

// ===============================
// RENDER PRODUK PER KATEGORI
// ===============================
function renderProdukKategori(kat) {
  container.innerHTML = "";
  const filtered = produkList.filter(p => p.kategori === kat);

  if (filtered.length === 0) {
    container.innerHTML = "<p>Tidak ada produk.</p>";
    return;
  }

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.gambar}" alt="${p.nama}">
        <div class="product-info">
          <h3>${p.nama}</h3>
          <p>${p.deskripsi}</p>
          <p>Berat: <b>${formatBerat(p.berat)}</b></p>
          <p class="price">Rp${p.harga.toLocaleString()}</p>
          <p>Stok: <b>${p.stok}</b></p>
          ${
            p.stok > 0
              ? `<button class="add-cart-btn" onclick="addToCart('${p.nama}',${p.harga},${p.berat})">+ Keranjang</button>`
              : `<button class="add-cart-btn" style="background:#777;" disabled>Stok Habis</button>`
          }
        </div>
      </div>`;
  });
}

// ===============================
// TAMBAH KE KERANJANG
// ===============================
function addToCart(nama,harga,berat){
  const produk = produkList.find(p => p.nama === nama);
  if (produk.stok <= 0) { alert("Stok habis!"); return; }
  produk.stok--;

  const exist = cart.find(p => p.nama === nama);
  if (exist) { exist.qty++; }
  else { cart.push({ nama, harga, berat, qty: 1 }); }

  updateCartCount();
  renderCart();
  renderProdukKategori(document.getElementById("judulKategori").textContent);
}

// ===============================
// PANEL KERANJANG
// ===============================
document.getElementById("cart-float").onclick = ()=>{
  document.getElementById("cart-panel").style.display="flex"; 
  renderCart();
};
document.getElementById("close-cart").onclick = ()=>{
  document.getElementById("cart-panel").style.display="none";
};

// ===============================
// RENDER KERANJANG
// ===============================
function renderCart(){
  const panel = document.getElementById("cart-items");
  panel.innerHTML = "";
  let total = 0;

  cart.forEach((item,i)=>{
    total += item.harga * item.qty;

    panel.innerHTML += `
      <div class="cart-item">
        <div>
          <b>${item.nama}</b><br>
          Berat total: ${formatBerat(item.berat * item.qty)}<br>
          Rp${item.harga.toLocaleString()}
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${i},-1)">-</button>
          ${item.qty}
          <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
          <button class="remove-btn" onclick="removeItem(${i})">✖</button>
        </div>
      </div>`;
  });

  document.getElementById("cart-total").textContent = total.toLocaleString();
}

// ===============================
// UBAH QTY + UPDATE STOK
// ===============================
function changeQty(i,val){
  const item = cart[i];
  const produk = produkList.find(p => p.nama === item.nama);

  if (val === 1) {
    if (produk.stok <= 0) { alert("Stok tidak cukup!"); return; }
    item.qty++; produk.stok--;
  }

  if (val === -1) {
    item.qty--; produk.stok++;
    if (item.qty <= 0) cart.splice(i,1);
  }

  updateCartCount();
  renderCart();
  renderProdukKategori(document.getElementById("judulKategori").textContent);
}

// ===============================
// HAPUS ITEM
// ===============================
function removeItem(i){
  const item = cart[i];
  const produk = produkList.find(p => p.nama === item.nama);
  produk.stok += item.qty;
  cart.splice(i,1);

  updateCartCount();
  renderCart();
  renderProdukKategori(document.getElementById("judulKategori").textContent);
}

// ===============================
// CHECKOUT KE WHATSAPP
// ===============================
document.getElementById("checkout").onclick = ()=>{
  if(cart.length===0){ alert("Keranjang masih kosong!"); return; }
  document.getElementById("cart-panel").style.display="none";
  document.getElementById("alamat-panel").style.display="flex";
};
document.getElementById("close-alamat").onclick = ()=>{
  document.getElementById("alamat-panel").style.display="none";
};

document.getElementById("confirm-alamat").addEventListener("click", () => {
  const alamat = document.getElementById("alamat-input").value.trim();
  const jenisOngkir = document.getElementById("jenis-ongkir").value.trim();
  const kurir = document.getElementById("kurir").value;
  const payment = document.getElementById("payment").value;

  if (!alamat) return alert("Alamat wajib diisi!");
  if (!jenisOngkir) return alert("Jenis ongkir wajib diisi!");

  let text = "*🛒 PESANAN BARU*\n\n*Daftar Produk:*\n";

  let totalBarang = 0;
  let totalBerat = 0;

  cart.forEach((item,i)=>{
    const subtotal = item.harga * item.qty;
    const beratTotal = item.berat * item.qty;

    totalBarang += subtotal;
    totalBerat += beratTotal;

    text += `${i+1}. ${item.nama} — ${item.qty}x\n`;
    text += `   Berat: ${formatBerat(beratTotal)}\n`;
    text += `   Rp${subtotal.toLocaleString()}\n`;
  });

  text += `\n*Total Berat:* ${formatBerat(totalBerat)}`;
  text += `\n*Total Barang:* Rp${totalBarang.toLocaleString()}`;
  text += `\n*Ongkir:* ${kurir} (${jenisOngkir}) — _(admin akan infokan)_`;
  text += `\n*Total Pembayaran:* Rp${totalBarang.toLocaleString()}`;
  text += `\n\n*Alamat:* ${alamat}`;
  text += `\n*Kurir:* ${kurir}`;
  text += `\n*Pembayaran:* ${payment}`;
  text += `\n\nMohon diproses ya 😊`;

  const waText = encodeURIComponent(text);
  window.open(`https://wa.me/${nomorWA}?text=${waText}`, "_blank");

  document.getElementById("alamat-panel").style.display = "none";
});
