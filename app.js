let books = [];
let cart = [];

// Fetch books from backend
async function fetchBooks() {
  try {
    const res = await fetch('https://online-bookstore-backend-hdd7.onrender.com/books');
    books = await res.json();
    renderBooks();
  } catch (err) {
    console.error('Failed to fetch books:', err);
    alert('Could not load books from backend.');
  }
}

// Add a new book (local only, does not update backend)
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

// Search filter trigger
document.getElementById('searchInput').addEventListener('input', renderBooks);

// Initial fetch & render
fetchBooks();
