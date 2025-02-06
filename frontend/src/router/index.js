import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import PhotoAlbumView from '../views/PhotoAlbumView.vue'

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
    path: '/photo-album',
    name: 'PhotoAlbum',
    component: PhotoAlbumView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 