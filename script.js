/* ==============================
   ORDEN GLOBAL DE TALLAS
================================ */

const SIZE_ORDER = [
  "XXS", "XS", "S", "M", "L", "XL", "XXL", "3X",
  "28", "30", "32", "34", "36", "38", "40", "42", "44",
  "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5",
  "9", "9.5", "10", "10.5", "11", "11.5",
  "Universal"
];


/* ==============================
   ELEMENTOS DEL DOM
================================ */

const categoryFilter = document.getElementById("categoryFilter");
const genderFilter   = document.getElementById("genderFilter");
const sizeFilter     = document.getElementById("sizeFilter");
const priceFilter    = document.getElementById("priceFilter");
const resetBtn       = document.getElementById("resetFilters");

const productsContainer = document.querySelector(".products");
const products = Array.from(document.querySelectorAll(".product"));


/* ==============================
   FILTRADO PRINCIPAL
================================ */

function applyFilters() {
  const category = categoryFilter.value;
  const gender   = genderFilter.value;
  const size     = sizeFilter.value;

  products.forEach(product => {
    const productCategory = product.dataset.category || "";
    const productGender   = product.dataset.gender || "";
    const sizeElement     = product.querySelector(".size");
    const productSize     = sizeElement ? sizeElement.dataset.size : "";

    const categoryMatch = category === "all" || category === productCategory;
    const genderMatch   = gender === "all" || gender === productGender;
    const sizeMatch     = size === "all" || size === productSize;

    product.style.display =
      categoryMatch && genderMatch && sizeMatch ? "block" : "none";
  });

  updateSizeFilter();
  sortProducts();
}


/* ==============================
   ACTUALIZAR FILTRO DE TALLAS
================================ */

function updateSizeFilter() {
  const availableSizes = new Set();

  products.forEach(product => {
    if (product.style.display !== "none") {
      const sizeEl = product.querySelector(".size");
      if (sizeEl) availableSizes.add(sizeEl.dataset.size);
    }
  });

  const currentValue = sizeFilter.value;

  sizeFilter.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Todas las tallas";
  sizeFilter.appendChild(defaultOption);

  SIZE_ORDER.forEach(size => {
    if (availableSizes.has(size)) {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      sizeFilter.appendChild(option);
    }
  });

  sizeFilter.value = availableSizes.has(currentValue)
    ? currentValue
    : "all";
}


/* ==============================
   ORDENAR POR PRECIO (CORREGIDO)
================================ */

function sortProducts() {
  const order = priceFilter.value;

  if (!order || order === "none") return;

  const visibleProducts = products.filter(
    p => p.style.display !== "none"
  );

  visibleProducts.sort((a, b) => {
    const priceA = Number(a.querySelector(".price")?.dataset.price || 0);
    const priceB = Number(b.querySelector(".price")?.dataset.price || 0);

    if (order === "asc") return priceA - priceB;
    if (order === "desc") return priceB - priceA;

    return 0;
  });

  visibleProducts.forEach(p => productsContainer.appendChild(p));
}


/* ==============================
   LIMPIAR FILTROS (FIX)
================================ */

resetBtn.addEventListener("click", () => {
  categoryFilter.value = "all";
  genderFilter.value   = "all";
  sizeFilter.value     = "all";
  priceFilter.value    = "none";

  products.forEach(product => {
    product.style.display = "block";
    productsContainer.appendChild(product);
  });

  updateSizeFilter();
});


/* ==============================
   EVENTOS
================================ */

categoryFilter.addEventListener("change", applyFilters);
genderFilter.addEventListener("change", applyFilters);
sizeFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", sortProducts);


/* ==============================
   INICIO
================================ */

applyFilters();