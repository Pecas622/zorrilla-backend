const socket = io();

const productListEl = document.getElementById("product-list");
const addProductForm = document.getElementById("add-product-form");

function renderProducts(products) {
  productListEl.innerHTML = "";

  if (!products.length) {
    productListEl.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.dataset.id = product.id;

    card.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p><strong>Codigo:</strong> ${product.code}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Categoria:</strong> ${product.category}</p>
      <button class="delete-btn" data-id="${product.id}">Eliminar</button>
    `;

    productListEl.appendChild(card);
  });
}

socket.on("products", (products) => {
  renderProducts(products);
});

socket.on("error", (message) => {
  alert(message);
});

addProductForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(addProductForm);
  const productData = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
  };

  socket.emit("addProduct", productData);
  addProductForm.reset();
});

productListEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    socket.emit("deleteProduct", id);
  }
});
