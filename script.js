class Book {
    constructor({ id, title, author, pages, read }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

class LibraryApp {
    constructor() {
        this.library = [];

        this.addBtn = document.getElementById('add-book');
        this.cardsContainer = document.getElementById('library-container');
        this.modal = document.getElementById('form-modal');
        this.form = document.getElementById('book-form');
        this.cancelBtn = document.getElementById('cancel-form');

        this.bindEvents();
    }

    bindEvents() {
        this.addBtn?.addEventListener('click', () => this.openModal());
        this.cancelBtn?.addEventListener('click', () => this.closeModal());

        this.form?.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        // Vlastná validačná hláška pre autora
        const authorInput = this.form?.querySelector('input[name="author"]');
        authorInput?.addEventListener('invalid', () => {
            authorInput.setCustomValidity('The author name must be filled!');
        });
        authorInput?.addEventListener('input', () => {
            authorInput.setCustomValidity('');
        });

        this.cardsContainer?.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;

            if (target.classList.contains('remove-btn')) {
                const id = target.dataset.bookId;
                if (id) this.removeBook(id);
            }

            if (target.classList.contains('change-read')) {
                const id = target.dataset.bookId;
                if (id) this.toggleRead(id);
            }
        });
    }

    generateId() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    openModal() {
        if (!this.modal || !this.form) return;
        this.form.reset();
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.add('hidden');
    }

    handleSubmit() {
        if (!this.form) return;

        const formData = new FormData(this.form);
        const title = (formData.get('title') || '').toString().trim();
        const author = (formData.get('author') || '').toString().trim();
        const pages = Number(formData.get('pages')) || 0;
        const read = formData.get('read') === 'on';

        if (!title || !author || pages <= 0) return;

        this.addBook({ title, author, pages, read });
        this.render();
        this.closeModal();
    }

    addBook({ title, author, pages, read }) {
        const book = new Book({
            id: this.generateId(),
            title,
            author,
            pages,
            read: Boolean(read),
        });
        this.library.push(book);
        return book;
    }

    removeBook(id) {
        const index = this.library.findIndex((book) => book.id === id);
        if (index === -1) return;
        this.library.splice(index, 1);
        this.render();
    }

    toggleRead(id) {
        const book = this.library.find((b) => b.id === id);
        if (!book) return;
        book.read = !book.read;
        this.render();
    }

    seed() {
        this.addBook({ title: 'LotR', author: 'Tolkien', pages: 300, read: true });
        this.addBook({ title: 'LotR', author: 'Tolkien', pages: 300, read: true });
        this.addBook({ title: 'Harry Potter', author: 'Rowling', pages: 350, read: false });
        this.addBook({ title: 'Harry Potter', author: 'Rowling', pages: 350, read: false });
        this.addBook({ title: 'Harry Potter', author: 'Rowling', pages: 350, read: false });
    }

    render() {
        const container = this.cardsContainer || document.body;
        container.innerHTML = '';

        this.library.forEach((book) => {
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
}

const app = new LibraryApp();
// app.seed();
app.render();
