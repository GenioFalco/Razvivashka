<template>
  <div class="photo-album-view">
    <h1>Фотоальбом</h1>
    <!-- Пример простой галереи: добавьте остальные изображения аналогичным образом -->
    <div class="gallery">
      <img src="@/assets/images/sample.jpg" alt="Sample Photo" />
    </div>
    <!-- Пример использования компонента ежедневных наград -->
    <DailyRewardsPanel />
  </div>
</template>

<script>
import DailyRewardsPanel from '../components/DailyRewardsPanel.vue'

export default {
  name: "PhotoAlbumView",
  components: {
    DailyRewardsPanel
  }
};
</script>

<style scoped>
@import "../assets/css/adaptive.css";

/* Стили для фотоальбома */
.photo-album-view {
  padding: 20px;
}
.gallery {
  display: flex;
  flex-wrap: wrap;
}
.gallery img {
  max-width: 100%;
  height: auto;
  margin: 10px;
}
</style> 