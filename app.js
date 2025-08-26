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

let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 10 },
  { id: 2, title: 'Harry Potter', author: 'J.K. Rowling', price: 15 },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', price: 25 },
  { id: 4, title: 'Atomic Habits', author: 'James Clear', price: 12 },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 18 }
];

let cart = [];

// Add a new book
function addBook() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const price = parseFloat(document.getElementById('bookPrice').value);

  if (!title || !author || isNaN(price)) {
    alert('Please fill all fields correctly.');
    return;
  }

  books.push({ id: Date.now(), title, author, price });
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookPrice').value = '';
  renderBooks();
}

// Render book list with search filter
function renderBooks() {
  const tbody = document.getElementById('bookList');
  tbody.innerHTML = '';
  const search = document.getElementById('searchInput').value.toLowerCase();

  books
    .filter(b => b.title.toLowerCase().includes(search))
    .forEach(book => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>$${book.price.toFixed(2)}</td>
        <td><button onclick="addToCart(${book.id})">Add to Cart</button></td>
      `;
      tbody.appendChild(tr);
    });
}

// Add book to cart
function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  cart.push(book);
  renderCart();
}

// Render shopping cart
function renderCart() {
  const tbody = document.getElementById('cartList');
  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((book, index) => {
    total += book.price;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>$${book.price.toFixed(2)}</td>
      <td><button onclick="removeFromCart(${index})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  alert(`Checkout successful! Total: $${cart.reduce((sum, b) => sum + b.price, 0).toFixed(2)}`);
  cart = [];
  renderCart();
}

// Initial render of books
renderBooks();
