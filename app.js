// 1. Fetch books from backend
fetch("http://127.0.0.1:5000/books")
  .then(response => response.json())
  .then(data => {
    console.log("Books from backend:", data);
    // Replace local books array with backend data
    books = data;
    renderBooks();
  })
  .catch(err => console.error("Error:", err));

let books = [];
let cart = [];

// 2. Function to add new book (connects to backend)
function addBookToBackend(title, author, price) {
  fetch("http://127.0.0.1:5000/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, price })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data.message);
    // Refresh books from backend after adding
    return fetch("http://127.0.0.1:5000/books");
  })
  .then(res => res.json())
  .then(data => {
    books = data;
    renderBooks();
  })
  .catch(err => console.error("Error:", err));
}

// 3. Handle form submission
function handleAddBookForm() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const price = parseFloat(document.getElementById('bookPrice').value);

  if (!title || !author || isNaN(price)) {
    alert('Please fill all fields correctly.');
    return;
  }

  addBookToBackend(title, author, price);

  // Clear form
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookPrice').value = '';
}

// --------- Book rendering + cart --------- //
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

function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  cart.push(book);
  renderCart();
}

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

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  alert(`Checkout successful! Total: $${cart.reduce((sum, b) => sum + b.price, 0).toFixed(2)}`);
  cart = [];
  renderCart();
}

  


