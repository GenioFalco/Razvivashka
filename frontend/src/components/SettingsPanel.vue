<template>
    <Transition name="slide-up">
      <div v-if="isVisible" class="settings-panel">
        <div class="settings-header">
          <h2>Настройки</h2>
          <button class="close-button" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        
        <div class="settings-content">
          <div class="setting-group">
            <label>Никнейм</label>
            <div class="nickname-input">
              <input type="text" v-model="nickname" placeholder="Введите никнейм" />
              <button class="save-button" @click="saveNickname">Сохранить</button>
            </div>
          </div>
  
          <div class="setting-group">
            <label>Персонаж</label>
            <div class="character-selection">
              <div class="character-preview">
                <img :src="currentCharacter" alt="Current character" />
              </div>
              <div class="character-list">
                <div 
                  v-for="(char, index) in availableCharacters" 
                  :key="index"
                  class="character-option"
                  :class="{ 'selected': char === currentCharacter }"
                  @click="selectCharacter(char)"
                >
                  <img :src="char" alt="Character option" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import profileIcon from '@/assets/profile.png';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    }
  });
  
  defineEmits(['close', 'update:nickname', 'update:character']);
  
  const nickname = ref('ТИМА#564');
  const currentCharacter = ref(profileIcon);
  const availableCharacters = ref([
    profileIcon, // Текущий персонаж
    // Здесь будут добавляться новые персонажи из магазина
  ]);
  
  function saveNickname() {
    // Здесь будет логика сохранения никнейма
  }
  
  function selectCharacter(char) {
    currentCharacter.value = char;
    // Здесь будет логика сохранения выбранного персонажа
  }
  </script>
  
  <style scoped>
  .settings-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 85vh;
    background: #4C7C94;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 1.5rem 1.5rem 2rem 1.5rem;
    color: white;
    z-index: 1000;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    position: sticky;
    top: 0;
    background: #4C7C94;
    padding: 0.5rem 0;
    z-index: 2;
  }
  
  .settings-header h2 {
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
  
  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: calc(100% - 4rem);
    overflow-y: scroll;
    padding-bottom: 4rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  /* Скрываем скроллбар для Chrome, Safari и Opera */
  .settings-content::-webkit-scrollbar {
    display: none;
  }
  
  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .setting-group label {
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  .nickname-input {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    align-items: center;
  }
  
  .nickname-input input {
    flex: 1;
    min-width: 0;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
  }
  
  .nickname-input input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .save-button {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
    min-width: fit-content;
  }
  
  .save-button:hover {
    background: #2563eb;
  }
  
  .character-selection {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .character-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
  }
  
  .character-preview img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }
  
  .character-list {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem;
  }
  
  .character-option {
    width: 80px;
    height: 80px;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .character-option.selected {
    background: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 2px #3b82f6;
  }
  
  .character-option img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  
  /* Стили для мобильных устройств */
  @media (max-width: 768px) {
    .settings-content {
      scroll-snap-type: y proximity;
    }
  
    .setting-group {
      scroll-snap-align: start;
    }
  }
  </style> 