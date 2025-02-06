import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory('/MiniAppRazvivashka/'),
  routes,
})

export default router 