import { nanoid } from 'nanoid';
import LibraryItems from './library.data.js';
import Response from '../libs/api.response.js';

const LibraryService = {
  getBooks: function (request, h) {
    const { name, reading, finished } = request.query;
    let filteredBooks = LibraryItems.filter((book) => {
      let match = true;
      if (name) {
        match = match && new RegExp(name, 'gi').test(book.name);
      }
      if (reading !== undefined) {
        const readingBool = Number(reading) === 1;
        match = match && (book.reading === readingBool);
      }
      if (finished !== undefined) {
        const finishedBool = Number(finished) === 1;
        match = match && (book.finished === finishedBool);
      }
      return match;
    });
    return Response.dataOnly(h, 200, {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    });
  },
  getBookById: function (request, h) {
    const { bookId } = request.params;
    const book = LibraryItems.filter((book) => book.id === bookId)[0];
    if (book) return Response.dataOnly(h, 200, { book });
    return Response.message(h, 404, 'Buku tidak ditemukan');
  },
  postBook: function (request, h) {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if (!name) return Response.message(h, 400, 'Gagal menambahkan buku. Mohon isi nama buku');
    if (readPage > pageCount) return Response.message(h, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
    LibraryItems.push(newBook);
    const isSuccess = LibraryItems.filter((book) => book.id === id).length > 0;
    if (isSuccess)
      return Response.data(h, 201, 'Buku berhasil ditambahkan', {
        bookId: id,
      });
    return Response.message(h, 500, 'Buku gagal ditambahkan');
  },
  putBook: function (request, h) {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if (!name) return Response.message(h, 400, 'Gagal memperbarui buku. Mohon isi nama buku');
    if (readPage > pageCount) return Response.message(h, 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    const index = LibraryItems.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      LibraryItems[index] = { ...LibraryItems[index], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt };
      return Response.message(h, 200, 'Buku berhasil diperbarui');
    }
    return Response.message(h, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
  },
  deleteBook: function (request, h) {
    const { bookId } = request.params;
    const index = LibraryItems.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      LibraryItems.splice(index, 1);
      return Response.message(h, 200, 'Buku berhasil dihapus');
    }
    return Response.message(h, 404, 'Buku gagal dihapus. Id tidak ditemukan');
  },
};

export default LibraryService;