<template>
    <div class="main-menu">
      <!-- Верхнее меню -->
      <div class="top-menu container">
        <!-- Профиль слева -->
        <router-link to="/profile" class="profile-card clickable">
          <img src="@/assets/profile.png" alt="Профиль" class="menu-icon" />
          <span>Профиль</span>
        </router-link>
        
        <!-- Сетка 2x2 справа -->
        <div class="menu-grid">
          <div class="menu-card clickable" @click="handleClick('subscription')">
            <img src="@/assets/subscription.png" alt="Подписка" class="menu-icon" />
            <span>Подписка</span>
          </div>
          <div class="menu-card clickable" @click="handleClick('photoalbum')">
            <img src="@/assets/photoalbum.png" alt="Фотоальбом" class="menu-icon" />
            <span>Фотоальбом</span>
          </div>
          <div class="menu-card clickable" @click="handleClick('shop')">
            <img src="@/assets/shop.png" alt="Магазин" class="menu-icon" />
            <span>Магазин</span>
          </div>
          <div class="menu-card clickable" @click="toggleDailyRewards">
            <img src="@/assets/daily_admission.png" alt="Ежедневный вход" class="menu-icon" />
            <span>Ежедневный вход</span>
          </div>
        </div>
      </div>
  
      <!-- Список категорий -->
      <div class="categories container">
        <div class="category-item clickable" @click="handleClick('creativity')">
          <img src="@/assets/creativity.png" alt="Творчество" class="category-icon" />
          <span>Творчество</span>
        </div>
        <div class="category-item clickable" @click="handleClick('daily')">
          <img src="@/assets/daily.png" alt="Задания на день" class="category-icon" />
          <span>Задания на день</span>
        </div>
        <div class="category-item clickable" @click="handleClick('riddles')">
          <img src="@/assets/riddles.png" alt="Загадки" class="category-icon" />
          <span>Загадки</span>
        </div>
        <div class="category-item clickable" @click="handleClick('tonguetwisters')">
          <img src="@/assets/tonguetwisters.png" alt="Скороговорки" class="category-icon" />
          <span>Скороговорки</span>
        </div>
        <div class="category-item clickable" @click="handleClick('rebus')">
          <img src="@/assets/rebus.png" alt="Ребусы" class="category-icon" />
          <span>Ребусы</span>
        </div>
        <div class="category-item clickable" @click="handleClick('articulation')">
          <img src="@/assets/articulation.png" alt="Артикулярная гимнастика" class="category-icon" />
          <span>Артикулярная гимнастика</span>
        </div>
        <div class="category-item clickable" @click="handleClick('neuro')">
          <img src="@/assets/neuro.png" alt="Нейрогимнастика" class="category-icon" />
          <span>Нейрогимнастика</span>
        </div>
      </div>
  
      <!-- Добавляем компонент панели ежедневных наград -->
      <DailyRewardsPanel 
        :is-visible="isDailyRewardsVisible"
        @close="toggleDailyRewards"
        @claim-reward="handleClaimReward"
      />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import DailyRewardsPanel from '@/components/DailyRewardsPanel.vue'
  import { ref } from 'vue'
  
  const router = useRouter()
  
  // Добавляем состояние для панели ежедневных наград
  const isDailyRewardsVisible = ref(false);
  
  function toggleDailyRewards() {
    isDailyRewardsVisible.value = !isDailyRewardsVisible.value;
  }
  
  function handleClaimReward(data) {
    // Здесь будет логика обработки получения награды
    console.log('Claim reward data:', data);
  }
  
  const handleClick = async (category) => {
    try {
      // Простая вибрация через Web Vibration API
      if ('vibrate' in navigator) {
        navigator.vibrate(100)
      }
      
      // Эффект нажатия
      const elements = document.querySelectorAll('.category-item, .menu-card, .profile-card')
      elements.forEach(el => {
        if (el.contains(event.target)) {
          el.classList.add('press-down')
          setTimeout(() => el.classList.remove('press-down'), 150)
        }
      })
  
      setTimeout(() => {
        // Обработка разных типов кнопок
        switch(category) {
          case 'profile':
            router.push({ name: 'profile' })
            break;
          case 'photoalbum':
            router.push({ name: 'photoalbum' })
            break;
          case 'subscription':
          case 'shop':
            // Для верхних кнопок меню
            router.push({ name: 'tasks', query: { category } })
            break;
          default:
            // Для категорий внизу
            router.push({ name: 'tasks', query: { category } })
        }
      }, 150)
    } catch (error) {
      console.error('Error in handleClick:', error)
      if (category === 'profile') {
        router.push({ name: 'profile' })
      } else if (category === 'photoalbum') {
        router.push({ name: 'photoalbum' })
      } else {
        router.push({ name: 'tasks', query: { category } })
      }
    }
  }

  </script>
  
  <style scoped>
  .main-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #4a90e2, #003f7f);
    padding: 20px;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    color: white;
    font-family: 'Arial', sans-serif;
  }
  
  .top-menu {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    width: 100%;
  }
  
  .profile-card {
    font-family: 'Ubuntu', sans-serif;
    width: 120px;
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  
  .profile-card span {
    font-family: 'Ubuntu', sans-serif;
    font-weight: 500;
  }
  
  .menu-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .menu-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    height: 80px;
  }
  
  /* Размеры иконок */
  .menu-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }
  
  .profile-card .menu-icon {
    width: 70px;
    height: 70px;
    margin-bottom: 15px;
  }
  
  .category-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }
  
  /* Стили для текста */
  span {
    font-size: 14px;
    line-height: 1.2;
  }
  
  .categories {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }
  
  .category-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  
  /* Эффекты при наведении и нажатии */
  @media (hover: hover) {
    .profile-card:hover,
    .menu-card:hover,
    .category-item:hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  @media (hover: none) {
    .profile-card:active,
    .menu-card:active,
    .category-item:active {
      transform: scale(0.95);
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
  }
  
  /* Анимация вдавливания */
  @keyframes pressDownSimple {
    to { 
      transform: scale(0.95);
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    }
  }
  
  .press-down {
    animation: pressDownSimple 0.15s ease-out forwards;
  }
  
  /* Отключаем анимации для устройств с отключенной анимацией */
  @media (prefers-reduced-motion: reduce) {
    .category-item,
    .menu-card {
      transition: none;
    }
    .press-down {
      animation: none;
    }
  }
  </style>
  