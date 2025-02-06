<template>
  <div class="home-view">
    <h1>Главная страница</h1>
    <!-- Пример использования компонента настроек -->
    <SettingsPanel />
  </div>
</template>

<script>
import SettingsPanel from '../components/SettingsPanel.vue'

export default {
  name: "HomeView",
  components: {
    SettingsPanel
  }
};
</script>

<style scoped>
@import "../assets/css/adaptive.css";

/* Стили, специфичные для главной страницы */
.home-view {
  padding: 20px;
}
</style> 