<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from './config';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const historyStack = ref([]);
    let backButton = null;

    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const WebApp = window.Telegram.WebApp;
      WebApp.ready();
      WebApp.expand();
      backButton = WebApp.BackButton;

      // Настройка обработчика маршрутов
      router.afterEach((to, from) => {
        console.log('Route changed:', { from: from.path, to: to.path });
        
        if (from.path && from.path !== to.path) {
          historyStack.value.push(from.path);
          console.log('History stack updated:', historyStack.value);
        }

        if (to.path === "/") {
          historyStack.value = [];
          backButton.hide();
          console.log('On main page, hiding back button');
        } else {
          backButton.show();
          console.log('Showing back button');
        }
      });

      // Настройка обработчика кнопки "Назад"
      backButton.onClick(() => {
        console.log('Back button clicked, current history:', historyStack.value);
        if (historyStack.value.length > 0) {
          const previousPath = historyStack.value.pop();
          console.log('Navigating to previous path:', previousPath);
          router.push(previousPath);
        } else {
          console.log('No history, returning to main page');
          router.push("/");
        }
      });

      // Инициализация начального состояния кнопки
      const currentPath = router.currentRoute.value.path;
      if (currentPath === "/") {
        backButton.hide();
        console.log('Initially hiding back button on main page');
      } else {
        backButton.show();
        console.log('Initially showing back button');
      }
    }

    onMounted(async () => {
      let userId;

      if (window.Telegram && window.Telegram.WebApp) {
        const WebApp = window.Telegram.WebApp;
        const initDataUnsafe = WebApp.initDataUnsafe;
        if (initDataUnsafe && initDataUnsafe.user && initDataUnsafe.user.id) {
          userId = initDataUnsafe.user.id.toString();
          console.log('Got Telegram user ID:', userId);
        } else {
          console.error('Failed to get Telegram user ID');
          return;
        }
      } else {
        userId = 'browser_' + Math.random().toString(36).substr(2, 9);
        console.log('Generated browser ID:', userId);
      }

      const existingUserId = localStorage.getItem('userId');
      if (existingUserId && !existingUserId.startsWith('browser_') && userId.startsWith('browser_')) {
        console.log('Keeping existing non-browser ID:', existingUserId);
        userId = existingUserId;
      } else {
        localStorage.setItem('userId', userId);
      }

      try {
        await axios.post(`${API_URL}/profile/register`, { userId });
      } catch (error) {
        console.error('Error registering user:', error);
      }
    });

    return {
      historyStack
    };
  },
};
</script>

<style>
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
  width: 100%;
  min-height: 100vh;
  overscroll-behavior: none;
  background-color: var(--tg-theme-bg-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  width: 100%;
  min-height: 100vh;
  user-select: none;
  display: flex;
  flex-direction: column;
  background: var(--tg-theme-bg-color);
}

/* Адаптивные стили для мобильных устройств */
@media screen and (max-width: 390px) {
  #app {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
  .router-view-container {
    width: 100%;
    min-height: 100vh;
  }
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