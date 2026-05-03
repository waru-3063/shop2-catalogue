const products = [
    { id: 1, name: "Laptop", category: "electronics", price: 800, img: "https://picsum.photos/seed/laptop/400/300" },
    { id: 2, name: "Headphones", category: "electronics", price: 100, img: "https://picsum.photos/seed/headphones/400/300" },
    { id: 3, name: "T-Shirt", category: "fashion", price: 25, img: "https://picsum.photos/seed/tshirt/400/300" },
    { id: 4, name: "Sneakers", category: "fashion", price: 60, img: "https://picsum.photos/seed/sneakers/400/300" },
    { id: 5, name: "Pizza", category: "food", price: 10, img: "https://picsum.photos/seed/pizza/400/300" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateUI();
}

function addToCart(id) {
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({ id, qty: 1 });
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
}

function clearCart() {
    cart = [];
    saveCart();
}

function updateUI() {
    renderCart();
    renderProducts();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById("cartCount").innerText = count;
}

function renderProducts(filter="all", search="") {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products
    .filter(p => (filter==="all" || p.category===filter) && p.name.toLowerCase().includes(search.toLowerCase()))
    .forEach(p => {
        list.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="addToCart(${p.id})">Add</button>
            <button onclick="viewProduct(${p.id})">View</button>
        </div>`;
    });
}

function renderCart() {
    const div = document.getElementById("cartItems");
    div.innerHTML = "";

    if (cart.length === 0) {
        div.innerHTML = "<p>Cart is empty</p>";
        document.getElementById("totalPrice").innerText = 0;
        return;
    }

    let total = 0;

    cart.forEach((item, i) => {
        const p = products.find(p => p.id === item.id);
        if (!p) return;

        total += p.price * item.qty;

        div.innerHTML += `
        <div>
            ${p.name} ($${p.price}) x ${item.qty}
            <button onclick="changeQty(${i},1)">+</button>
            <button onclick="changeQty(${i},-1)">-</button>
            <button onclick="removeFromCart(${i})">❌</button>
        </div>`;
    });

    document.getElementById("totalPrice").innerText = total;
}

function viewProduct(id) {
    localStorage.setItem("selectedProduct", id);
    window.location.href = "product.html";
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

// Filters
document.getElementById("search").oninput = e => {
    renderProducts(document.getElementById("category").value, e.target.value);
};

document.getElementById("category").onchange = e => {
    renderProducts(e.target.value, document.getElementById("search").value);
};

// Init
updateUI();