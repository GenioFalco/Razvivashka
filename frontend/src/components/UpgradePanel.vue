<template>
    <Transition name="slide-up">
      <div v-if="isVisible" class="upgrade-panel">
        <div class="upgrade-header">
          <h2>Прокачка персонажа</h2>
          <button class="close-button" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        
        <div class="upgrade-content">
          <!-- Превью персонажа -->
          <div class="character-preview">
            <img :src="characterImage" alt="Character" />
          </div>
  
          <!-- Параметры персонажа -->
          <div class="parameters-list">
            <div v-for="param in parameters" :key="param.id" class="parameter-item">
              <div class="parameter-header">
                <span class="parameter-name">{{ param.name }}</span>
                <span class="parameter-level">Ур. {{ param.level }}</span>
              </div>
              
              <div class="parameter-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (param.progress / param.maxProgress) * 100 + '%' }"></div>
                  <span class="progress-text">{{ param.progress }}/{{ param.maxProgress }}</span>
                </div>
                <button class="exchange-token-button" @click="exchangeToken(param.id)">
                  <img :src="param.tokenIcon" alt="Token" class="token-icon" />
                  <span>+1</span>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Кнопка повышения уровня -->
          <button 
            class="level-up-button"
            :disabled="!canLevelUp"
            @click="levelUp"
          >
            ПОВЫСИТЬ УРОВЕНЬ
          </button>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import profileIcon from '@/assets/profile.png';
  import creativityIcon from '@/assets/creativity.png';
  import dailyIcon from '@/assets/daily.png';
  import riddlesIcon from '@/assets/riddles.png';
  import neuroIcon from '@/assets/neuro.png';
  import articulationIcon from '@/assets/articulation.png';
  import tongueTwistersIcon from '@/assets/tonguetwisters.png';
  import rebusIcon from '@/assets/rebus.png';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    },
    characterImage: {
      type: String,
      default: profileIcon
    }
  });
  
  defineEmits(['close', 'upgrade']);
  
  const parameters = ref([
    { 
      id: 1, 
      name: 'Креативность', 
      level: 1, 
      progress: 2, 
      maxProgress: 5,
      tokenIcon: creativityIcon 
    },
    { 
      id: 2, 
      name: 'Интеллект', 
      level: 1, 
      progress: 3, 
      maxProgress: 5,
      tokenIcon: riddlesIcon 
    },
    { 
      id: 3, 
      name: 'Остроумие', 
      level: 1, 
      progress: 1, 
      maxProgress: 5,
      tokenIcon: rebusIcon 
    },
    { 
      id: 4, 
      name: 'Энергичность', 
      level: 1, 
      progress: 4, 
      maxProgress: 5,
      tokenIcon: dailyIcon 
    },
    { 
      id: 5, 
      name: 'Фокусировка', 
      level: 1, 
      progress: 0, 
      maxProgress: 5,
      tokenIcon: neuroIcon 
    },
    { 
      id: 6, 
      name: 'Артикуляция', 
      level: 1, 
      progress: 2, 
      maxProgress: 5,
      tokenIcon: articulationIcon 
    },
    { 
      id: 7, 
      name: 'Активность', 
      level: 1, 
      progress: 3, 
      maxProgress: 5,
      tokenIcon: tongueTwistersIcon 
    }
  ]);
  
  const canLevelUp = computed(() => {
    return parameters.value.every(param => param.progress === param.maxProgress);
  });
  
  function exchangeToken(parameterId) {
    const parameter = parameters.value.find(p => p.id === parameterId);
    if (parameter && parameter.progress < parameter.maxProgress) {
      parameter.progress++;
    }
  }
  
  function levelUp() {
    if (canLevelUp.value) {
      // Здесь будет логика повышения уровня
      alert('Функция повышения уровня будет доступна позже');
    }
  }
  </script>
  
  <style scoped>
  .upgrade-panel {
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
  
  .upgrade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .upgrade-header h2 {
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
  
  .upgrade-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: calc(100% - 4rem);
    overflow-y: auto;
    padding-bottom: 2rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .upgrade-content::-webkit-scrollbar {
    display: none;
  }
  
  .character-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
  
  .character-preview img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }
  
  .parameters-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .parameter-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1rem;
  }
  
  .parameter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .parameter-name {
    font-weight: 500;
  }
  
  .parameter-level {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .parameter-progress {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .progress-bar {
    flex: 1;
    height: 0.75rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
  }
  
  .progress-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 1rem;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .exchange-token-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .exchange-token-button:hover {
    background: #2563eb;
  }
  
  .token-icon {
    width: 1.2rem;
    height: 1.2rem;
  }
  
  .level-up-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 1rem;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: auto;
  }
  
  .level-up-button:disabled {
    background: rgba(59, 130, 246, 0.5);
    cursor: not-allowed;
  }
  
  .level-up-button:not(:disabled):hover {
    background: #2563eb;
    transform: translateY(-1px);
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
  </style> 