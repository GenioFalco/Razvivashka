<template>
    <!-- Основной контейнер профиля -->
    <div class="profile">
      <!-- Верхняя панель с именем пользователя и кнопкой настроек -->
      <header>
        <div class="header-content">
          <div class="user-info">
            <img :src="profileIcon" alt="Profile" class="profile-mini" />
            <span class="username">{{ nickname }}</span>
          </div>
          <button class="settings-button" @click="toggleSettings">
            <img :src="gearIcon" alt="Settings" />
          </button>
        </div>
      </header>
  
      <!-- Верхняя панель статистики (монеты, ежедневные задания, трофеи) -->
      <div class="stats-bar">
        <div class="stat-item">
          <img :src="coinIcon" alt="Coins" />
          <span>1,555,000</span>
        </div>
        <div class="stat-item">
          <img :src="dailyIcon" alt="Daily" />
          <span>25</span>
        </div>
        <div class="stat-item">
          <img :src="trophyIcon" alt="Trophies" />
          <span>3</span>
        </div>
      </div>
  
      <!-- Индикатор прогресса уровня -->
      <div class="level-info">
        <span>Уровень 7</span>
        <div class="xp-bar">
          <div class="xp-progress" :style="{ width: xpProgress + '%' }"></div>
        </div>
        <span class="xp-text">XP {{ xp }}/100</span>
      </div>
  
      <!-- Контейнер с персонажем и кнопкой прокачки -->
      <div class="character-container">
        <img :src="profileIcon" alt="Character" class="character-image" />
        <div class="character-level">{{ level }}</div>
        <button class="exchange-button" @click="toggleUpgradePanel">ПРОКАЧАТЬ</button>
      </div>
  
      <!-- Нижняя панель с кнопками действий -->
      <div class="bottom-actions-container">
        <div class="bottom-actions">
          <button 
            v-for="(action, index) in actions" 
            :key="index" 
            class="action-button"
            :class="{ 'active': activeButtonIndex === index }"
            @click="setActiveButton(index)"
          >
            <img :src="action.icon" :alt="action.name" />
          </button>
        </div>
      </div>
  
      <!-- Компонент настроек -->
      <SettingsPanel 
        :is-visible="isSettingsVisible"
        @close="toggleSettings"
        @update:nickname="updateNickname"
        @update:character="updateCharacter"
      />
  
      <!-- Компонент панели прокачки -->
      <UpgradePanel 
        :is-visible="isUpgradePanelVisible"
        @close="toggleUpgradePanel"
        @upgrade="handleUpgrade"
      />
    </div>
  </template>
  
  <script setup>
  // Импорт необходимых компонентов и изображений
  import { ref, onMounted } from "vue";
  import gearIcon from '@/assets/gear-icon.png'
  import coinIcon from '@/assets/coin-icon.png'
  import dailyIcon from '@/assets/daily.png'
  import trophyIcon from '@/assets/trophy-icon.png'
  import profileIcon from '@/assets/profile.png'
  import dailyIcon2 from '@/assets/daily.png'
  import neuroIcon from '@/assets/neuro.png'
  import creativityIcon from '@/assets/creativity.png'
  import rebusIcon from '@/assets/rebus.png'
  import riddlesIcon from '@/assets/riddles.png'
  import tongueTwisterIcon from '@/assets/tonguetwisters.png'
  import articulationIcon from '@/assets/articulation.png'
  import SettingsPanel from '@/components/SettingsPanel.vue'
  import UpgradePanel from '@/components/UpgradePanel.vue'
  
  // Состояние для уровня и опыта
  const level = ref(7);
  const xp = ref(25);
  const xpProgress = ref((xp.value / 100) * 100); // Вычисление процента прогресса
  
  // Массив кнопок для нижней панели
  const actions = ref([
    { name: "Ежедневные задания", icon: dailyIcon2 },
    { name: "Творчество", icon: creativityIcon },
    { name: "Ребусы", icon: rebusIcon },
    { name: "Загадки", icon: riddlesIcon },
    { name: "Скороговорки", icon: tongueTwisterIcon },
    { name: "Нейрогимнастика", icon: neuroIcon },
    { name: "Артикулярная гимнастика", icon: articulationIcon },
  ]);
  
  // Состояние для активной кнопки
  const activeButtonIndex = ref(0); // Первая кнопка активна по умолчанию
  
  // Состояние для настроек
  const isSettingsVisible = ref(false);
  const nickname = ref('ТИМА#564');
  
  // Состояние для панели прокачки
  const isUpgradePanelVisible = ref(false);
  
  // Функция для изменения активной кнопки
  function setActiveButton(index) {
    activeButtonIndex.value = index;
  }
  
  // Функция обмена (пока не реализована)
  function exchange() {
    alert("Функция обмена не реализована!");
  }
  
  // Функции для работы с настройками
  function toggleSettings() {
    isSettingsVisible.value = !isSettingsVisible.value;
  }
  
  function updateNickname(newNickname) {
    nickname.value = newNickname;
  }
  
  function updateCharacter(newCharacter) {
    profileIcon.value = newCharacter;
  }
  
  function toggleUpgradePanel() {
    isUpgradePanelVisible.value = !isUpgradePanelVisible.value;
  }
  
  function handleUpgrade(data) {
    // Здесь будет логика обработки прокачки
    console.log('Upgrade data:', data);
  }
  
  onMounted(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const BackButton = window.Telegram.WebApp.BackButton;
      BackButton.show();
      BackButton.onClick(() => {
        // Перенаправляем на главное меню
        router.push({ name: 'home' });
      });
      window.Telegram.WebApp.onEvent('backButtonClicked', () => {
        // Перенаправляем на главное меню
        router.push({ name: 'home' });
      });
    }
  });
  </script>
  
  <style scoped>
  /* Основной контейнер */
  .profile {
    background: linear-gradient(180deg, #4a90e2, #003f7f);
    min-height: 100%;
    color: white;
    padding: 0;
    display: flex;
    flex-direction: column;
    width: 100vw;
    max-width: 100vw;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0;
    left: 0;
    right: 0;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Стили для верхней панели */
  header {
    background: rgba(0, 0, 0, 0.2);
    padding: clamp(0.5rem, 2vh, 1rem);
    flex-shrink: 0;
    width: 100%;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Стили для информации о пользователе */
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .profile-mini {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  
  .user-info .username {
    font-family: 'Ubuntu', sans-serif;
    font-weight: 700;
    font-size: clamp(1rem, 2.5vh, 1.4rem);
  }
  
  /* Стили для кнопки настроек */
  .settings-button {
    background: none;
    border: none;
    padding: 0.5rem;
  }
  
  .settings-button img {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  /* Стили для верхней панели статистики */
  .stats-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: clamp(0.5rem, 2vh, 1rem);
    border-radius: 1rem;
    margin: clamp(0.5rem, 2vh, 1rem);
    flex-shrink: 0;
    width: calc(100% - clamp(2rem, 4vh, 4rem));
    margin-left: auto;
    margin-right: auto;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-item img {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  /* Стили для индикатора прогресса уровня */
  .level-info {
    text-align: center;
    margin: clamp(0.5rem, 2vh, 1rem);
    padding: clamp(0.25rem, 1vh, 0.5rem);
    flex-shrink: 0;
    width: calc(100% - clamp(2rem, 4vh, 4rem));
    margin-left: auto;
    margin-right: auto;
  }
  
  .xp-bar {
    width: 100%;
    height: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    margin: 0.5rem 0;
    overflow: hidden;
  }
  
  .xp-progress {
    height: 100%;
    background: #3b82f6;
    border-radius: 1rem;
    transition: width 0.3s ease;
  }
  
  /* Стили для контейнера с персонажем */
  .character-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 0;
    flex: 1;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 20;
    margin-top: -15vh;
    pointer-events: none;
  }
  
  .character-image {
    width: clamp(12rem, 40vh, 20rem);
    height: auto;
    object-fit: contain;
    position: relative;
    z-index: 20;
    margin-bottom: -5%;
    pointer-events: none;
  }
  
  /* Стили для кружка с уровнем */
  .character-level {
    position: absolute;
    top: 35%;
    right: calc(50% - clamp(5rem, 18vh, 9rem));
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    color: white;
    pointer-events: none;
    z-index: 21;
  }
  
  /* Стили для кнопки обмена */
  .exchange-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: clamp(0.75rem, 2.5vh, 1.5rem) clamp(2rem, 5vh, 4rem);
    border-radius: 2rem;
    font-weight: bold;
    font-size: clamp(1.1rem, 2.5vh, 1.4rem);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    position: relative;
    z-index: 20;
    margin-top: -8%;
    letter-spacing: 0.05em;
    cursor: pointer;
    pointer-events: auto;
  }
  
  .exchange-button:active {
    transform: scale(0.98);
  }
  
  /* Стили для нижней панели с кнопками */
  .bottom-actions-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: clamp(1rem, 3vh, 2rem);
    background: rgba(0, 0, 0, 0.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: clamp(40vh, 55vh, 60vh);
    width: 100vw;
    margin: 0;
    z-index: 10;
  }
  
  /* Контейнер с кнопками внизу панели */
  .bottom-actions {
    position: absolute;
    bottom: clamp(1rem, 3vh, 2rem);
    left: clamp(1rem, 3vh, 2rem);
    right: clamp(1rem, 3vh, 2rem);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    padding: clamp(0.5rem, 2vh, 1rem);
    border-radius: 1rem;
    z-index: 11;
  }
  
  /* Стили для кнопок действий */
  .action-button {
    background: none;
    border: none;
    padding: clamp(0.25rem, 1vh, 0.5rem);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: clamp(2rem, 6vh, 3rem);
    min-height: clamp(2rem, 6vh, 3rem);
    position: relative;
    z-index: 12;
    cursor: pointer;
    pointer-events: auto;
  }
  
  /* Стили для активной кнопки */
  .action-button.active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* Индикатор активной кнопки (точка снизу) */
  .action-button.active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: #3b82f6;
    border-radius: 50%;
    z-index: 3;
  }
  
  /* Эффект при наведении на кнопку */
  .action-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* Размеры иконок в кнопках */
  .action-button img {
    width: clamp(1rem, 3vh, 1.5rem);
    height: clamp(1rem, 3vh, 1.5rem);
    pointer-events: none;
  }
  
  @media (min-width: 768px) {
    .profile {
      width: 100vw;
      max-width: 100vw;
      margin: 0;
    }
  
    .bottom-actions-container {
      width: 100vw;
      margin: 0;
    }
  
    .character-container {
      margin-top: -15vh;
    }
  
    .character-image {
      width: clamp(16rem, 45vh, 24rem);
      margin-bottom: -2%;
    }
  
    .exchange-button {
      padding: clamp(1rem, 3vh, 2rem) clamp(3rem, 6vh, 5rem);
      font-size: clamp(1.2rem, 3vh, 1.6rem);
      margin-top: -4%;
    }
  
    .character-level {
      width: 3rem;
      height: 3rem;
      font-size: 1.4rem;
      right: calc(50% - clamp(6rem, 20vh, 10rem));
    }
  }
  
  @media (min-width: 1200px) {
    .character-container {
      margin-top: -20vh;
    }
  
    .character-image {
      width: clamp(20rem, 50vh, 28rem);
      margin-bottom: -1%;
    }
  
    .bottom-actions-container {
      height: clamp(45vh, 50vh, 55vh);
    }
  
    .exchange-button {
      margin-top: -2%;
    }
  
    .character-level {
      width: 3.5rem;
      height: 3.5rem;
      font-size: 1.6rem;
      right: calc(50% - clamp(7rem, 22vh, 11rem));
    }
  }
  
  @media (max-height: 600px) {
    .character-container {
      margin-top: -3vh;
    }
  
    .character-image {
      width: clamp(10rem, 35vh, 18rem);
    }
  
    .exchange-button {
      padding: clamp(0.5rem, 2vh, 1rem) clamp(1.5rem, 4vh, 3rem);
      font-size: clamp(1rem, 2vh, 1.2rem);
    }
  
    .bottom-actions-container {
      height: 50vh;
    }
  
    .character-level {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.2rem;
      right: calc(50% - clamp(5rem, 18vh, 9rem));
    }
  }
  </style>
  