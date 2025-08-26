let cart = [];

// Fetch books from backend and render
async function renderBooks() {
  const tbody = document.getElementById('bookList');
  tbody.innerHTML = '';
  const search = document.getElementById('searchInput').value.toLowerCase();

  try {
    const response = await fetch('https://online-bookstore-backend-hdd7.onrender.com/books');
    const books = await response.json();

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
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

// Add a new book to backend
async function addBook() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const price = parseFloat(document.getElementById('bookPrice').value);

  if (!title || !author || isNaN(price)) {
    alert('Please fill all fields correctly.');
    return;
  }

  try {
    const response = await fetch('https://online-bookstore-backend-hdd7.onrender.com/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, price })
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      renderBooks(); // refresh book list
    } else {
      alert('Failed to add book.');
    }
  } catch (error) {
    console.error('Error adding book:', error);
  }

  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookPrice').value = '';
}

// Cart functions (no changes)
function addToCart(bookId) {
  // fetch book details from backend first
  fetch(`https://online-bookstore-backend-hdd7.onrender.com/books/${bookId}`)
    .then(res => res.json())
    .then(book => {
      cart.push(book);
      renderCart();
    })
    .catch(err => console.error(err));
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

// Initial render
renderBooks();
