<template>
  <div class="task-reward-overlay" v-if="isVisible">
    <div class="task-reward-panel">
      <h2>Задание выполнено!</h2>
      <div class="rewards-container">
        <div v-if="rewards.coins" class="reward-item">
          <img src="@/assets/coin-icon.png" alt="Монеты" class="reward-icon" />
          <span>+{{ rewards.coins }}</span>
        </div>
        <div v-if="rewards.xp" class="reward-item">
          <img src="@/assets/xp-icon.png" alt="Опыт" class="reward-icon" />
          <span>+{{ rewards.xp }}</span>
        </div>
        <div v-if="rewards.activity_tokens" class="reward-item">
          <img src="@/assets/activity-token-icon.png" alt="Жетоны" class="reward-icon" />
          <span>+{{ rewards.activity_tokens }}</span>
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
  rewards: {
    type: Object,
    default: () => ({
      coins: 0,
      xp: 0,
      activity_tokens: 0
    })
  }
});

const emit = defineEmits(['collect']);

const collect = () => {
  emit('collect');
};
</script>

<style scoped>
.task-reward-overlay {
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

.task-reward-panel {
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