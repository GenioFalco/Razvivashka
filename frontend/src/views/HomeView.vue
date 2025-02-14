<template>
    <div class="main-menu">
      <!-- Верхнее меню -->
      <div class="top-menu container">
        <!-- Профиль слева -->
        <router-link to="/profile" class="profile-card clickable">
          <img src="@/assets/profile.png" alt="Профиль" class="menu-icon" />
          <span class="profile-text">Профиль</span>
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
            router.push({ name: 'Profile' })
            break;
          case 'shop':
            router.push({ name: 'shop' })
            break;
          case 'photoalbum':
            router.push({ name: 'photoalbum' })
            break;
          case 'subscription':
            router.push({ name: 'subscription' })
            break;
          case 'daily':
            router.push({ name: 'daily' });
            break;
          case 'riddles':
            router.push({ name: 'riddles' });
            break;
          case 'tonguetwisters':
            router.push({ name: 'tonguetwister' });
            break;
          case 'rebus':
            router.push({ name: 'rebus' });
            break;
          case 'neuro':
            router.push({ name: 'neuro' });
            break;
          case 'articulation':
            router.push({ name: 'articulation' });
            break;
          case 'creativity':
            router.push({ name: 'creativity' });
            break;
          default:
            // Для категорий внизу
            router.push({ name: 'tasks', query: { category } })
        }
      }, 150)
    } catch (error) {
      console.error('Error in handleClick:', error)
      if (category === 'profile') {
        router.push({ name: 'Profile' })
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
    gap: 50px;
    align-items: center;
    background: linear-gradient(180deg, #4a90e2, #003f7f);
    padding: 20px;
    min-height: 100vh;
    box-sizing: border-box;
    margin: 0;
    color: white;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    font-family: 'Arial', sans-serif;
  }
  
  .top-menu {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 0;
    width: 100%;
    box-sizing: border-box;
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
    flex-shrink: 0;
  }
  
  .profile-card span {
    font-family: 'Ubuntu', sans-serif;
    font-weight: 500;
    color: white;
    text-decoration: none;
  }
  
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    flex-grow: 1;
    box-sizing: border-box;
    min-width: 0;
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
    padding-bottom: 80px; /* Отступ снизу для последнего элемента */
    box-sizing: border-box;
    margin-top: 50px !important;
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
  
  /* Добавляем стили для мобильных устройств */
  @media screen and (max-width: 600px) {
    .main-menu {
      padding: 10px;
    }
  
    .top-menu {
      flex-direction: row;
      gap: 15px;
      flex-wrap: nowrap;
      padding: 0 15px;
    }
  
    .menu-grid {
      gap: 15px;
    }
  
    .categories {
      width: 100%;
      padding: 0 10px;
    }
  }
  
  /* Добавляем явное определение flex для корректного позиционирования элементов в .top-menu */
  .top-menu .profile-card {
    flex: 0 0 120px; /* Фиксированная ширина для профиля */
  }
  
  .top-menu .menu-grid {
    flex: 1 1 auto;
    min-width: 0;
    width: 100% !important;
  }
  
  /* Добавляем правило transform-origin для интерактивных элементов */
  .profile-card,
  .menu-card,
  .category-item {
    transform-origin: center;
  }
  
  /* Media query для больших экранов */
  @media screen and (min-width: 1024px) {
    .main-menu {
      width: 100%;
      margin: 0;
    }
    .top-menu {
      gap: 15px;
    }
    .menu-grid {
      gap: 15px;
    }
  }
  
  /* Переопределяем стиль контейнеров внутри главного меню для полного растягивания */
  .main-menu .container {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    overflow: visible !important;
  }
  </style>
  