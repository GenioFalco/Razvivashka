<template>
  <div class="profile-view">
    <h1>Профиль пользователя</h1>
    <!-- Пример использования компонента обновлений -->
    <UpgradePanel />
  </div>
</template>

<script>
import UpgradePanel from '../components/UpgradePanel.vue'

export default {
  name: "ProfileView",
  components: {
    UpgradePanel
  }
};
</script>

<style scoped>
@import "../assets/css/adaptive.css";

/* Стили для страницы профиля */
.profile-view {
  padding: 20px;
}
</style> 