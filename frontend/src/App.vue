<template>
  <div id="app">
    <!-- Место для отображения дочерних компонентов -->
    <router-view />
  </div>

</template>

<script>
export default {
  name: "App",
  // Здесь можно добавить глобальные переменные или методы
};

import { ref, onMounted, computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isInitialized = ref(false)
const isDarkTheme = computed(() => {
  console.log('Checking theme:', window.Telegram?.WebApp?.colorScheme)
  return window.Telegram?.WebApp?.colorScheme === 'dark'
})

onMounted(() => {
  console.log('App mounted')
  
  // Эмулируем объект Telegram WebApp для тестирования в браузере
  if (!window.Telegram) {
    window.Telegram = {
      WebApp: {
        ready: () => console.log('WebApp ready called'),
        expand: () => console.log('WebApp expand called'),
        MainButton: {
          show: () => console.log('MainButton show called'),
          hide: () => console.log('MainButton hide called')
        },
        colorScheme: 'dark',
        backgroundColor: '#1f1f1f',
        textColor: '#ffffff',
        linkColor: '#64b5f6',
        buttonColor: '#64b5f6',
        buttonTextColor: '#ffffff'
      }
    }
  }

  // Проверяем, запущено ли приложение в Telegram
  if (window.Telegram?.WebApp) {
    console.log('Telegram WebApp found, initializing...')
    try {
      // Инициализируем Telegram WebApp
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
      
      // Настраиваем MainButton
      window.Telegram.WebApp.MainButton.hide()
      
      // Получаем тему
      const colorScheme = window.Telegram.WebApp.colorScheme
      console.log('Color scheme:', colorScheme)
      document.documentElement.className = colorScheme
      
      // Устанавливаем цвета из Telegram WebApp
      const colors = {
        backgroundColor: window.Telegram.WebApp.backgroundColor,
        textColor: window.Telegram.WebApp.textColor,
        linkColor: window.Telegram.WebApp.linkColor,
        buttonColor: window.Telegram.WebApp.buttonColor,
        buttonTextColor: window.Telegram.WebApp.buttonTextColor
      }
      console.log('Colors:', colors)
      
      document.documentElement.style.setProperty('--tg-theme-bg-color', colors.backgroundColor)
      document.documentElement.style.setProperty('--tg-theme-text-color', colors.textColor)
      document.documentElement.style.setProperty('--tg-theme-hint-color', colors.backgroundColor)
      document.documentElement.style.setProperty('--tg-theme-link-color', colors.linkColor)
      document.documentElement.style.setProperty('--tg-theme-button-color', colors.buttonColor)
      document.documentElement.style.setProperty('--tg-theme-button-text-color', colors.buttonTextColor)
      
      console.log('WebApp initialized successfully')
    } catch (error) {
      console.error('Error initializing WebApp:', error)
    }
    
    // Помечаем, что инициализация завершена
    isInitialized.value = true
    console.log('Initialization complete')
  } else {
    console.log('Not running in Telegram WebApp, showing content directly')
    // Если запущено не в Telegram, просто показываем контент
    isInitialized.value = true
  }
})
</script>

<style scoped>
@import './assets/css/adaptive.css';
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap');

/* Глобальные стили */
* {
  font-family: 'Ubuntu', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  touch-action: none;
  -ms-touch-action: none;
  overflow: hidden !important;
  position: fixed;
  width: 100%;
  height: 100%;
  overscroll-behavior: none;
  background-color: var(--tg-theme-bg-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  height: 100%;
  touch-action: none;
  -ms-touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  -webkit-overflow-scrolling: touch;
}

.app {
  width: 100vw;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
}

:root {
  --tg-theme-bg-color: var(--tg-theme-bg-color, #fff);
  --tg-theme-text-color: var(--tg-theme-text-color, #000);
  --tg-theme-hint-color: var(--tg-theme-hint-color, #999);
  --tg-theme-link-color: var(--tg-theme-link-color, #2678b6);
  --tg-theme-button-color: var(--tg-theme-button-color, #2678b6);
  --tg-theme-button-text-color: var(--tg-theme-button-text-color, #fff);
  --tg-theme-secondary-bg-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--tg-theme-text-color);
}

.dark {
  --tg-theme-bg-color: #1f1f1f;
  --tg-theme-text-color: #fff;
  --tg-theme-hint-color: #aaa;
  --tg-theme-link-color: #64b5f6;
  --tg-theme-button-color: #64b5f6;
  --tg-theme-secondary-bg-color: #2f2f2f;
}

</style> 