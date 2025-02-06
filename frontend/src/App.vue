<template>
  <div class="app" :class="{ 'dark': isDarkTheme }">
    <RouterView v-if="isInitialized" />
    <div v-else class="loading">Загрузка...</div>
  </div>
</template>

<script>

import { ref, computed,} from 'vue'
import { RouterView} from 'vue-router'

const isInitialized = ref(false)
const isDarkTheme = computed(() => {
  console.log('Checking theme:', window.Telegram?.WebApp?.colorScheme)
  return window.Telegram?.WebApp?.colorScheme === 'dark'
})
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

</script>

<style scoped>

/* Глобальные стили для App.vue (при необходимости) */
@import './assets/css/adaptive.css';

html {
  touch-action: none; /* Отключаем жесты масштабирования на мобильных */
  -ms-touch-action: none;
  overflow: hidden;
}

body {
  touch-action: none;
  -ms-touch-action: none;
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  min-height: 100vh;
  touch-action: none; /* Отключаем жесты масштабирования */
  -ms-touch-action: none;
  user-select: none; /* Запрещаем выделение текста */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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

.app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
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