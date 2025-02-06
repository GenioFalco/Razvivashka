import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Создаем экземпляр приложения Vue, подключаем роутер и монтируем на элемент с id="app"
const app = createApp(App)
app.use(router)

// Дождёмся, когда router будет готов
router.isReady().then(() => {
  // Принудительно перенаправляем на домашнюю страницу
  router.push('/')
  app.mount('#app')
}) 