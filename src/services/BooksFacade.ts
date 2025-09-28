import api from './ApiFacade'
import type { Book, CreateBook, UpdateBook } from '../types/book'

export class BooksFacade {
  async getBooks(params?: Record<string, unknown>) {
    const response = await api.get('/books', { params })
    const data = response.data.data
    const pages = response.data.pages
    const total = response.data.items

    return { data, pages, total }
  }

  async getBook(id: number): Promise<Book> {
    const response = await api.get(`/books/${id}`)
    return response.data
  }

  async createBook(book: CreateBook): Promise<Book> {
    const response = await api.post('/books', book)
    return response.data
  }

  async editBook(id: number, book: UpdateBook): Promise<Book> {
    const response = await api.put(`/books/${id}`, book)
    return response.data
  }

  async deleteBook(id: number): Promise<unknown> {
    const response = await api.delete(`/books/${id}`)
    return response.data
  }
}

export default new BooksFacade()
