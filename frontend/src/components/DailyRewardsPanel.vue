<template>
    <Transition name="slide-up">
      <div v-if="isVisible" class="daily-rewards-panel">
        <div class="rewards-header">
          <h2>Ежедневные награды</h2>
          <button class="close-button" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        
        <div class="rewards-content">
          <div class="rewards-grid">
            <!-- Основные награды (2x3 сетка) -->
            <div v-for="(reward, index) in dailyRewards.slice(0, 6)" 
                 :key="index" 
                 class="reward-item"
                 :class="{ 'locked': !reward.isAvailable }"
                 @click="claimReward(index)">
              <div class="reward-icon">
                <img :src="reward.icon" :alt="reward.name" />
                <span class="reward-amount">+{{ reward.amount }}</span>
              </div>
              <div class="day-label">День {{ index + 1 }}</div>
            </div>
          </div>
  
          <!-- Главная награда (7-й день) -->
          <div class="main-reward"
               :class="{ 'locked': !dailyRewards[6].isAvailable }"
               @click="claimReward(6)">
            <div class="reward-icon">
              <img :src="dailyRewards[6].icon" :alt="dailyRewards[6].name" />
              <span class="reward-amount">+{{ dailyRewards[6].amount }}</span>
            </div>
            <div class="day-label">День 7</div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import coinIcon from '@/assets/coin-icon.png';
  import trophyIcon from '@/assets/trophy-icon.png';
  import subscriptionIcon from '@/assets/subscription.png';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    }
  });
  
  defineEmits(['close', 'claim-reward']);
  
  const dailyRewards = ref([
    { icon: trophyIcon, amount: 3, name: 'Жетоны', isAvailable: true },
    { icon: coinIcon, amount: 500, name: 'Монеты', isAvailable: false },
    { icon: subscriptionIcon, amount: 1, name: 'День подписки', isAvailable: false },
    { icon: trophyIcon, amount: 3, name: 'Жетоны', isAvailable: false },
    { icon: coinIcon, amount: 500, name: 'Монеты', isAvailable: false },
    { icon: subscriptionIcon, amount: 1, name: 'День подписки', isAvailable: false },
    { icon: coinIcon, amount: 10000, name: 'Монеты', isAvailable: false }, // Главная награда
  ]);
  
  function claimReward(index) {
    if (dailyRewards.value[index].isAvailable) {
      // Здесь будет логика получения награды
      console.log(`Получена награда за день ${index + 1}`);
    }
  }
  </script>
  
  <style scoped>
  .daily-rewards-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 85vh;
    background: #4C7C94;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 1.5rem;
    color: white;
    z-index: 1000;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .rewards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .rewards-header h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
  }
  
  .rewards-content {
    display: flex;
    gap: 2rem;
    height: calc(100% - 5rem);
    overflow-y: auto;
    padding: 1rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .rewards-content::-webkit-scrollbar {
    display: none;
  }
  
  .rewards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1rem;
    flex: 2;
  }
  
  .reward-item, .main-reward {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .reward-item:hover:not(.locked),
  .main-reward:hover:not(.locked) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .main-reward {
    flex: 1;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .reward-icon {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .reward-icon img {
    width: 3rem;
    height: 3rem;
    object-fit: contain;
  }
  
  .reward-amount {
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .day-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .locked {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
  }
  
  .locked:hover {
    transform: none;
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* Анимация появления снизу */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.3s ease-out;
  }
  
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
  
  @media (max-width: 768px) {
    .rewards-content {
      flex-direction: column;
    }
  
    .main-reward {
      height: 150px;
    }
  }
  </style> 