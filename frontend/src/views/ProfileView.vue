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

    <!-- Верхняя панель статистики (монеты, жетоны, трофеи) -->
    <div class="stats-bar">
      <div class="token-item">
        <img src="@/assets/coin-icon.png" alt="Coins" class="token-icon" />
        <span>{{ coins }}</span>
      </div>
      <div class="token-item">
        <img :src="currentTokenIcon" alt="Current Token" class="token-icon" />
        <span>{{ currentTokenCount }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/trophy-icon.png" alt="Trophies" class="token-icon" />
        <span>{{ trophies }}</span>
      </div>
    </div>

    <!-- Индикатор прогресса уровня -->
    <div class="level-info">
      <span>Уровень {{ level }}</span>
      <div class="xp-container">
      <div class="xp-bar">
        <div class="xp-progress" :style="{ width: xpProgress + '%' }"></div>
        </div>
        <button class="add-xp-button" @click="addTestXP">+10 XP</button>
      </div>
      <span class="xp-text">XP {{ currentLevelXP }}/{{ nextLevelXP }}</span>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="loading" class="loading-indicator">
      Загрузка...
    </div>

    <!-- Контейнер с персонажем и кнопкой прокачки -->
    <div v-else class="character-container">
      <img 
        :src="profileIcon" 
        alt="Character" 
        class="character-image"
        @error="handleImageError"
      />
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
      :current-nickname="nickname"
      @close="toggleSettings"
      @update:nickname="updateNickname"
      @update:character="updateCharacter"
    />

    <!-- Компонент панели прокачки -->
    <UpgradePanel 
      :is-visible="isUpgradePanelVisible"
      :character="character"
      :tokens="tokens"
      :max-parameter-value="5"
      @close="toggleUpgradePanel"
      @upgrade="handleUpgrade"
    />

    <!-- Компонент наград -->
    <LevelRewardPanel 
      :is-visible="isLevelRewardVisible"
      :level="levelRewards?.level"
      :coins="levelRewards?.coins"
      :trophy-tokens="levelRewards?.trophyTokens"
      :character="levelRewards?.character"
      @collect="collectRewards"
    />
  </div>
</template>

<script setup>
// Импорт необходимых компонентов и изображений
import { ref, onMounted, computed } from "vue";
import axios from 'axios';
import { useRouter } from 'vue-router';
import gearIcon from '@/assets/gear-icon.png'
import coinIcon from '@/assets/coin-icon.png'
import dailyIcon from '@/assets/daily.png'
import trophyIcon from '@/assets/trophy-icon.png'
import dailyIcon2 from '@/assets/daily.png'
import neuroIcon from '@/assets/neuro.png'
import creativityIcon from '@/assets/creativity.png'
import rebusIcon from '@/assets/rebus.png'
import riddlesIcon from '@/assets/riddles.png'
import tongueTwisterIcon from '@/assets/tonguetwisters.png'
import articulationIcon from '@/assets/articulation.png'
import SettingsPanel from '@/components/SettingsPanel.vue'
import UpgradePanel from '@/components/UpgradePanel.vue'
import LevelRewardPanel from '@/components/LevelRewardPanel.vue'
import profileImage from '@/assets/profile.png';
import { API_URL } from '@/config';

// Состояние для уровня и опыта
const router = useRouter();
const level = ref(1);
const xp = ref(0);
const coins = ref(0);
const dailyTasks = ref(0);
const trophies = ref(0);
const nickname = ref('');
const loading = ref(true);
const error = ref(null);
const profileIcon = ref(profileImage);

// Состояние для жетонов
const tokens = ref({
  daily: 5,
  creativity: 5,
  rebus: 5,
  riddles: 5,
  tongueTwister: 5,
  neuro: 5,
  articulation: 5
});

// Массив кнопок для нижней панели
const actions = ref([
  { name: "Ежедневные задания", icon: dailyIcon2, token: 'daily' },
  { name: "Творчество", icon: creativityIcon, token: 'creativity' },
  { name: "Ребусы", icon: rebusIcon, token: 'rebus' },
  { name: "Загадки", icon: riddlesIcon, token: 'riddles' },
  { name: "Скороговорки", icon: tongueTwisterIcon, token: 'tongueTwister' },
  { name: "Нейрогимнастика", icon: neuroIcon, token: 'neuro' },
  { name: "Артикулярная гимнастика", icon: articulationIcon, token: 'articulation' },
]);

// Состояние для активной кнопки и попапа
const activeButtonIndex = ref(0);
const selectedToken = ref(null);

// Состояние для настроек
const isSettingsVisible = ref(false);

// Состояние для панели прокачки
const isUpgradePanelVisible = ref(false);

// Добавляем состояние для наград
const levelRewards = ref(null);
const isLevelRewardVisible = ref(false);

// Добавляем состояние для требований уровней
const nextLevelRequirements = ref({});

// Обновляем вычисляемые свойства для XP
const currentLevelXP = computed(() => xp.value);
const nextLevelXP = computed(() => {
  // Получаем требуемый опыт для следующего уровня из таблицы levels
  const nextLevel = level.value + 1;
  return nextLevelRequirements.value[nextLevel] || 100;
});

const xpProgress = computed(() => {
  const currentLevelReq = nextLevelRequirements.value[level.value] || 0;
  const nextLevelReq = nextLevelRequirements.value[level.value + 1] || 100;
  const levelXP = xp.value - currentLevelReq;
  const requiredXP = nextLevelReq - currentLevelReq;
  return (levelXP / requiredXP) * 100;
});

// Вычисляемые свойства для текущего токена
const currentTokenIcon = computed(() => {
  return actions.value[activeButtonIndex.value]?.icon || dailyIcon;
});

const currentTokenCount = computed(() => {
  const tokenType = actions.value[activeButtonIndex.value]?.token;
  return tokens.value[tokenType] || 0;
});

// Функция для изменения активной кнопки
const setActiveButton = (index) => {
  activeButtonIndex.value = index;
  const token = actions.value[index].token;
  selectedToken.value = token;
};

// Функции для работы с настройками
function toggleSettings() {
  isSettingsVisible.value = !isSettingsVisible.value;
}

function updateCharacter(newCharacterUrl) {
  profileIcon.value = newCharacterUrl;
}

function toggleUpgradePanel() {
  isUpgradePanelVisible.value = !isUpgradePanelVisible.value;
}

function handleUpgrade(data) {
  if (data.character) {
    profileIcon.value = data.character.image_url;
  }
  if (data.tokens) {
    tokens.value = {
      ...tokens.value,
      ...data.tokens
    };
  }
  // Обновляем другие значения, если они есть
  if (data.coins) {
    coins.value = data.coins;
  }
  if (data.trophies) {
    trophies.value = data.trophies;
  }
  console.log('Updated character:', profileIcon.value);
  console.log('Updated tokens:', tokens.value);
}

// Функция обновления никнейма
async function updateNickname(newNickname) {
  try {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) return;
    
    const response = await axios.put(`${API_URL}/profile/${guestId}/username`, {
      username: newNickname
    });
    
    nickname.value = response.data.username;
  } catch (err) {
    console.error('Error updating nickname:', err);
    error.value = 'Ошибка при обновлении имени';
  }
}

// Функция для загрузки данных о жетонах
async function loadTokens() {
  try {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) return;
    
    const response = await axios.get(`${API_URL}/profile/${guestId}`);
    const { user } = response.data;
    
    tokens.value = {
      daily: user.tokens.daily,
      creativity: user.tokens.creativity,
      rebus: user.tokens.wit,
      riddles: user.tokens.intelligence,
      tongueTwister: user.tokens.focus,
      neuro: user.tokens.energy,
      articulation: user.tokens.articulation
    };
  } catch (err) {
    console.error('Error loading tokens:', err);
  }
}

// Функция для загрузки требований уровней
async function loadLevelRequirements() {
  try {
    const response = await axios.get(`${API_URL}/levels`);
    const levels = response.data;
    nextLevelRequirements.value = levels.reduce((acc, level) => {
      acc[level.level] = level.exp_required;
      return acc;
    }, {});
  } catch (err) {
    console.error('Error loading level requirements:', err);
  }
}

// Добавляем обработчик для предотвращения множественных загрузок
let isLoading = false;

// Обновляем функцию loadProfile
async function loadProfile() {
  if (isLoading) return;
  
  try {
    isLoading = true;
    console.log('Loading profile...');
    loading.value = true;
    error.value = null;
    
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = Math.floor(Math.random() * 1000000).toString();
      localStorage.setItem('guestId', guestId);
    }
    
    const response = await axios.get(`${API_URL}/profile/${guestId}`);
    const { user, character } = response.data;
    
    nickname.value = user.username;
    level.value = user.level;
    xp.value = user.xp;
    coins.value = user.tokens.coins;
    trophies.value = user.tokens.trophy;
    
    if (character && character.image_url) {
      profileIcon.value = character.image_url;
    }
    
    // Обновляем токены из того же ответа
    tokens.value = {
      daily: user.tokens.daily,
      creativity: user.tokens.creativity,
      rebus: user.tokens.wit,
      riddles: user.tokens.intelligence,
      tongueTwister: user.tokens.focus,
      neuro: user.tokens.energy,
      articulation: user.tokens.articulation
    };
    
    console.log('Profile loaded successfully');
  } catch (err) {
    console.error('Error loading profile:', err);
    error.value = 'Ошибка при загрузке профиля';
  } finally {
    loading.value = false;
    isLoading = false;
  }
}

const handleImageError = () => {
  console.log('Image loading error in profile, using default image');
  profileIcon.value = profileImage;
};

// Обновляем функцию для добавления XP
async function addTestXP() {
  try {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
      console.error('GuestId not found');
      return;
    }

    const response = await fetch(`${API_URL}/profile/${guestId}/xp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ xp: 10 })
    });

    if (!response.ok) {
      throw new Error('Failed to add XP');
    }

    const data = await response.json();
    console.log('Получены данные:', data);

    // Обновляем XP и уровень
    xp.value = data.xp;
    level.value = data.level;

    // Если получены награды за новый уровень
    if (data.rewards) {
      console.log('Получены награды:', data.rewards);
      // Показываем панель с наградами, НО пока не начисляем их
      levelRewards.value = {
        level: data.level,
        coins: data.rewards.coins,
        trophyTokens: data.rewards.trophy_tokens,
        character: data.rewards.character
      };
      isLevelRewardVisible.value = true;
    } else {
      // Если наград нет, просто обновляем токены
      coins.value = data.tokens.coins;
      trophies.value = data.tokens.trophy_tokens;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function collectRewards() {
  console.log('Собираем награды:', levelRewards.value);
  // Начисляем награды только при нажатии кнопки "Забрать"
  if (levelRewards.value) {
    coins.value += levelRewards.value.coins;
    trophies.value += levelRewards.value.trophyTokens;
    
    // Если есть новый персонаж, устанавливаем его изображение
    if (levelRewards.value.character) {
      profileIcon.value = levelRewards.value.character.image_url;
    }
  }
  
  // Скрываем панель наград
  isLevelRewardVisible.value = false;
  levelRewards.value = null;
}

onMounted(async () => {
  console.log('Component mounted');
  await loadLevelRequirements();
});

</script>

<style scoped>
/* Основной контейнер */
.profile {
  background: linear-gradient(180deg, #4a90e2, #003f7f);
  min-height: 100vh;
  height: 100vh;
  color: white;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  max-width: 100vw;
  position: relative;
  overflow: hidden;
  margin: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

/* Стили для верхней панели */
header {
  background: rgba(0, 0, 0, 0.2);
  padding: clamp(0.5rem, 2vh, 1rem);
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
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

.username {
  font-weight: bold;
  font-size: 1.2rem;
}

/* Стили для кнопки настроек */
.settings-button {
  background: none;
  border: none;
  padding: 0.5rem;
  margin-right: -5px;
  cursor: pointer;
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

.token-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.token-icon {
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

.xp-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0.5rem 0;
}

.xp-bar {
  flex: 1;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  overflow: hidden;
}

.add-xp-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-xp-button:hover {
  background: #2563eb;
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
  border-radius: 1rem;
  padding: 1rem;
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
  width: 100%;
  margin: 0;
  z-index: 10;
  box-sizing: border-box;
  overflow: hidden;
}

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
  box-sizing: border-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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
  margin: 0 2px;
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

/* Стили для индикатора загрузки */
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  z-index: 100;
}

/* Стили для сообщений об ошибках */
.error-message {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  z-index: 100;
  text-align: center;
  max-width: 80%;
}
</style>
