const myLibrary = [];

function Book(id, title, author, pages, read) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    const book = new Book();
    book.id = crypto.randomUUID();
    book.title = title;
    book.author = author;
    book.pages = pages;
    book.read = Boolean(read);
    myLibrary.push(book);
    return book;
}

addBookToLibrary("LotR", "Tolkien", 300, 1)
addBookToLibrary("LotR", "Tolkien", 300, 1)
addBookToLibrary("Harry Potter", "Rowling", 350, 0)
addBookToLibrary("Harry Potter", "Rowling", 350, 0)
addBookToLibrary("Harry Potter", "Rowling", 350, 0)


showBooks();

function removeBook(id) {
    const index = myLibrary.findIndex(book => book.id === id);
    if (index === -1) return;
    myLibrary.splice(index, 1);
    showBooks();
}

function changeRead(id) {
    const book = myLibrary.find(book => book.id === id);
    if (!book) return;
    book.read = !book.read;
    showBooks();
}

function showBooks() {
    const container = document.getElementById('library-container') || document.body;
    container.innerHTML = '';

    myLibrary.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.id = book.id;

        card.innerHTML = `
            <div class="book-info">
                <h3>${book.title}</h3>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Pages:</strong> ${book.pages}</p>
                <p><strong>Read:</strong> ${book.read ? 'Yes' : 'No'}</p>
            </div>
            <div class="book-settings">
                <button class="remove-btn" data-book-id="${book.id}">Remove</button>
                <button class="change-read" data-book-id="${book.id}">Change Read</button>
            </div>
        `;

        container.appendChild(card);
    });
}


// Modal wiring for adding a book
const addBtn = document.getElementById('add-book');
const cardsContainer = document.getElementById('library-container');
const modal = document.getElementById('form-modal');
const form = document.getElementById('book-form');
const cancelBtn = document.getElementById('cancel-form');

function openModal() {
    if (!modal || !form) return;
    form.reset();
    modal.classList.remove('hidden');
}

function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
}

addBtn?.addEventListener('click', openModal);

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const title = (formData.get('title') || '').toString().trim();
    const author = (formData.get('author') || '').toString().trim();
    const pages = Number(formData.get('pages')) || 0;
    const read = formData.get('read') === 'on';

    if (!title || !author || pages <= 0) return;

    addBookToLibrary(title, author, pages, read);
    showBooks();
    closeModal();
});

cancelBtn?.addEventListener('click', closeModal);

// Card actions (remove)
cardsContainer?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains('remove-btn')) {
        const id = target.dataset.bookId;
        if (id) removeBook(id);
    }

    if (target.classList.contains('change-read')) {
        const id = target.dataset.bookId;
        if (id) changeRead(id);
    }
});