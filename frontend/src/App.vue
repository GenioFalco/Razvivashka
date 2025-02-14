<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const historyStack = ref([]); // Храним историю маршрутов

    onMounted(() => {
      console.log("App mounted, checking for Telegram WebApp...");

      if (!window.Telegram || !window.Telegram.WebApp) {
        console.warn("Telegram WebApp is not available");
        return;
      }

      const WebApp = window.Telegram.WebApp;
      const BackButton = WebApp.BackButton;

      // Инициализация WebApp
      WebApp.ready();
      WebApp.expand();

      // Обработчик смены маршрута
      router.afterEach((to, from) => {
        console.log("Route changed:", { to, from });

        if (from.path && from.path !== to.path) {
          historyStack.value.push(from.path);
        }

        if (to.path === "/") {
          historyStack.value = [];
          BackButton.hide(); // Скрываем кнопку "Назад" на главной
        } else {
          BackButton.show(); // Показываем на всех остальных страницах
        }
      });

      // Обработчик кнопки "Назад"
      BackButton.onClick(() => {
        if (historyStack.value.length > 0) {
          const previousPath = historyStack.value.pop();
          router.push(previousPath);
        } else {
          router.push("/");
        }
      });

      // Устанавливаем начальное состояние кнопки "Назад"
      if (router.currentRoute.value.path === "/") {
        BackButton.hide();
      } else {
        BackButton.show();
      }
    });

    return {};
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