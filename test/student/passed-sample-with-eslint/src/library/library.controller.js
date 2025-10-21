import Routes from '../libs/route.handler.js';
import LibraryService from './library.service.js';

const LibraryController = [
  Routes('GET', '/books', LibraryService.getBooks),
  Routes('GET', '/books/{bookId}', LibraryService.getBookById),
  Routes('POST', '/books', LibraryService.postBook),
  Routes('PUT', '/books/{bookId}', LibraryService.putBook),
  Routes('DELETE', '/books/{bookId}', LibraryService.deleteBook),
];

export default LibraryController;