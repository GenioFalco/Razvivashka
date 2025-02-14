<template>
  <div class="level-reward-overlay" v-if="isVisible">
    <div class="level-reward-panel">
      <h2>Новый уровень {{ level }}!</h2>
      <div class="rewards-container">
        <div v-if="coins" class="reward-item">
          <img src="@/assets/coin-icon.png" alt="Монеты" class="reward-icon" />
          <span>+{{ coins }}</span>
        </div>
        <div v-if="trophyTokens" class="reward-item">
          <img src="@/assets/trophy-icon.png" alt="Трофеи" class="reward-icon" />
          <span>+{{ trophyTokens }}</span>
        </div>
        <div v-if="character" class="reward-item">
          <img :src="character.image_url" alt="Персонаж" class="reward-icon character" />
          <span>Новый персонаж!</span>
        </div>
      </div>
      <button class="collect-button" @click="collect">Забрать</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    required: true
  },
  coins: {
    type: Number,
    default: 0
  },
  trophyTokens: {
    type: Number,
    default: 0
  },
  character: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['collect']);

const collect = () => {
  emit('collect');
};
</script>

<style scoped>
.level-reward-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.level-reward-panel {
  background: linear-gradient(180deg, #4a90e2, #003f7f);
  padding: 20px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.rewards-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.reward-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 10px;
}

.reward-icon {
  width: 30px;
  height: 30px;
}

.reward-icon.character {
  border-radius: 50%;
}

.collect-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.collect-button:hover {
  background: #2563eb;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 