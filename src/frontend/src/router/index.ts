import { createRouter, createWebHistory } from 'vue-router'
import LayoutSidebarModern from '@/layouts/LayoutSidebarModern.vue'
import AllTopic from '@/pages/allTopic.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutSidebarModern
    },
    {
      path: '/all-topic',
      name: 'allTopic',
      component: AllTopic
    }
  ]
})

export default router
