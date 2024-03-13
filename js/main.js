document.addEventListener('DOMContentLoaded', () => {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');

    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];

    function saveBookshelf() {
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
    }

    function renderBookshelf(filteredBooks = null) {
        const booksToRender = filteredBooks ? filteredBooks : bookshelf;

        incompleteBookshelfList.innerHTML = ' ';
        completeBookshelfList.innerHTML = ' ';

        booksToRender.forEach(book => {
            const bookItem = document.createElement('article');
            bookItem.classList.add('book_item');

            const bookTitle = document.createElement('h3');
            bookTitle.textContent = book.title;

            const bookAuthor = document.createElement('p');
            bookAuthor.textContent = `Penulis: ${book.author}`;

            const bookYear = document.createElement('p');
            bookYear.textContent = `Tahun: ${book.year}`;

            const action = document.createElement('div');
            action.classList.add('action');

            const markAsCompleteButton = document.createElement('button');
            markAsCompleteButton.classList.add('green');
            markAsCompleteButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
            markAsCompleteButton.addEventListener('click', () => {
                book.isComplete = !book.isComplete;
                saveBookshelf();
                renderBookshelf(filteredBooks);
            });

            const deleteBookButton = document.createElement('button');
            deleteBookButton.classList.add('red');
            deleteBookButton.textContent = 'Hapus buku';
            deleteBookButton.addEventListener('click', () => {
                const index = bookshelf.indexOf(book);
                bookshelf.splice(index, 1);
                saveBookshelf();
                renderBookshelf(filteredBooks);
            });

            action.appendChild(markAsCompleteButton);
            action.appendChild(deleteBookButton);

            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(action);

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }

    inputBookForm.addEventListener('submit', event => {
        event.preventDefault();

        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = parseInt(document.getElementById('inputBookYear').value);
        const isComplete = document.getElementById('inputBookIsComplete').checked;
        const id = +new Date();

        bookshelf.push({id, title, author, year, isComplete});
        saveBookshelf();
        renderBookshelf();

        inputBookForm.reset();
    });

    searchBookForm.addEventListener('submit', event => {
        event.preventDefault();

        const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        const filteredBooks = bookshelf.filter(book => book.title.toLowerCase().includes(searchTitle));

        renderBookshelf(filteredBooks);
    });

    renderBookshelf();
});