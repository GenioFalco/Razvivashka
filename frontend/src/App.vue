<template>
  <div id="app">
    <div v-if="logs.length" class="debug-logs">
      <div v-for="(log, index) in logs" :key="index" class="log-item">
        {{ log }}
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const historyStack = ref([]); // История маршрутов
    const logs = ref([]); // Массив для хранения логов

    // Функция для добавления логов
    const addLog = (message) => {
      logs.value.push(`${new Date().toLocaleTimeString()}: ${message}`);
      if (logs.value.length > 10) logs.value.shift(); // Храним только последние 10 логов
    };

    onMounted(() => {
      addLog("App mounted, checking for Telegram WebApp...");
      addLog("window.Telegram: " + (window.Telegram ? "Available" : "Not available"));
      
      if (!window.Telegram || !window.Telegram.WebApp) {
        addLog("Telegram WebApp is not available");
        return;
      }

      const WebApp = window.Telegram.WebApp;
      addLog("WebApp object initialized");
      
      // Инициализация WebApp
      WebApp.ready();
      WebApp.expand();

      // Инициализация кнопки "Назад"
      const BackButton = WebApp.BackButton;
      addLog("BackButton object initialized");

      // Следим за изменением маршрута
      router.afterEach((to, from) => {
        addLog(`Route changed from ${from.path} to ${to.path}`);
        addLog(`History stack: ${JSON.stringify(historyStack.value)}`);

        if (from.path && from.path !== to.path) {
          historyStack.value.push(from.path);
        }

        if (to.path === "/") {
          historyStack.value = [];
          addLog("Hiding back button on home page");
          BackButton.hide();
        } else {
          addLog(`Showing back button on page: ${to.path}`);
          BackButton.show();
        }
      });

      // Обработчик нажатия на кнопку "Назад"
      BackButton.onClick(() => {
        addLog("Back button clicked");
        addLog(`Current history stack: ${JSON.stringify(historyStack.value)}`);
        
        if (historyStack.value.length > 0) {
          const previousPath = historyStack.value.pop();
          addLog(`Navigating to previous path: ${previousPath}`);
          router.push(previousPath);
        } else {
          addLog("No history, returning to home");
          router.push("/");
        }
      });

      // Проверяем начальный маршрут
      const currentPath = router.currentRoute.value.path;
      addLog(`Initial route: ${currentPath}`);
      
      if (currentPath === "/") {
        addLog("Initial route is home, hiding back button");
        BackButton.hide();
      } else {
        addLog("Initial route is not home, showing back button");
        BackButton.show();
      }
    });

    return {
      logs
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

.debug-logs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
}

.log-item {
  margin: 5px 0;
  text-align: left;
  font-family: monospace;
}
</style> 