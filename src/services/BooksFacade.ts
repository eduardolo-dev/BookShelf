import api from './ApiFacade'
import type { Book, CreateBook, UpdateBook } from '../types/book'

export class BooksFacade {
  async getBooks(params?: Record<string, unknown>) {
    const response = await api.get('/books', { params })
    const data = response.data
    const total = Number(response.headers['x-total-count'])

    return { data, total }
  }

  async getBook(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`)
    return response.data
  }

  async createBook(book: CreateBook): Promise<Book> {
    const response = await api.post('/books', book)
    return response.data
  }

  async editBook(id: string, book: UpdateBook): Promise<Book> {
    const response = await api.put(`/books/${id}`, book)
    return response.data
  }

  async deleteBook(id: string): Promise<unknown> {
    const response = await api.delete(`/books/${id}`)
    return response.data
  }
}

export default new BooksFacade()
