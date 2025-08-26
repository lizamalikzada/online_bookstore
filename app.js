const API_URL = "http://127.0.0.1:5000";

// Fetch and display books
async function fetchBooks() {
    const res = await fetch(`${API_URL}/books`);
    const books = await res.json();
    const list = document.getElementById("book-list");
    list.innerHTML = "";
    books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = `${book.title} by ${book.author} - $${book.price}`;
        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.onclick = () => addToCart(book);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

// Add new book
document.getElementById("add-book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const price = parseFloat(document.getElementById("price").value);

    const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, price })
    });

    if (res.ok) {
        fetchBooks();
        e.target.reset();
    }
});

// Add to cart
async function addToCart(book) {
    await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
    });
    fetchCart();
}

// Fetch cart
async function fetchCart() {
    const res = await fetch(`${API_URL}/cart`);
    const cart = await res.json();
    const list = document.getElementById("cart-list");
    list.innerHTML = "";
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.title} - $${item.price}`;
        list.appendChild(li);
    });
}

// Checkout
document.getElementById("checkout-btn").addEventListener("click", async () => {
    const res = await fetch(`${API_URL}/checkout`, { method: "POST" });
    const order = await res.json();
    alert(`Order placed! Total: $${order.total}`);
    fetchCart();
    fetchOrders();
});

// Fetch orders
async function fetchOrders() {
    const res = await fetch(`${API_URL}/orders`);
    const orders = await res.json();
    const list = document.getElementById("order-list");
    list.innerHTML = "";
    orders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `Order #${order.id} - Total: $${order.total}`;
        list.appendChild(li);
    });
}

// Initialize
fetchBooks();
fetchCart();
fetchOrders();
