export interface Book {
  id: number
  title: string
  author: string
  published: string
  category: string
  stock: number
}

export type CreateBook = Omit<Book, 'id'>
export type UpdateBook = Partial<CreateBook> & { id: number }
