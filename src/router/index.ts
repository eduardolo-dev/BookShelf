import { createRouter, createWebHistory } from 'vue-router'
import Books from '../views/BooksList.vue'
import BookNew from '../views/BookNew.vue'
import BookEdit from '../views/BookEdit.vue'
import BookDetail from '../views/BookDetail.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/books',
    },
    {
      path: '/books',
      name: 'books',
      component: Books,
      meta: { breadcrumb: 'Books' },
    },
    {
      path: '/books/new',
      name: 'book-new',
      component: BookNew,
      meta: { breadcrumb: 'New Book' },
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookEdit,
      meta: { breadcrumb: 'Edit Book' },
      props: true,
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: BookDetail,
      meta: { breadcrumb: 'Book Detail' },
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound,
    },
  ],
})

export default router
