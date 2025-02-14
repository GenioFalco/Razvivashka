import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import ShopView from '@/views/ShopView.vue'
import DailyView from '../views/DailyView.vue'
import RiddlesView from '../views/RiddlesView.vue'
import TonguetwistersView from '../views/TonguetwistersView.vue'
import RebusView from '../views/RebusView.vue'
import NeuroView from '../views/NeuroView.vue'
import ArticulationView from '../views/ArticulationView.vue'
import CreativityView from '../views/CreativityView.vue'
import SubscriptionView from '../views/SubscriptionView.vue'

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
    path: '/shop',
    name: 'shop',
    component: ShopView
  },
  {
    path: '/daily',
    name: 'daily',
    component: DailyView
  },
  {
    path: '/riddles',
    name: 'riddles',
    component: RiddlesView
  },
  {
    path: '/tonguetwister',
    name: 'tonguetwister',
    component: TonguetwistersView
  },
  {
    path: '/rebus',
    name: 'rebus',
    component: RebusView
  },
  {
    path: '/neuro',
    name: 'neuro',
    component: NeuroView
  },
  {
    path: '/articulation',
    name: 'articulation',
    component: ArticulationView
  },
  {
    path: '/creativity',
    name: 'creativity',
    component: CreativityView
  },
  {
    path: '/subscription',
    name: 'subscription',
    component: SubscriptionView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 