<template>
  <div class="creativity-container">
    <header class="creativity-header">
      <h1 class="creativity-title">Творчество</h1>
    </header>
    <div class="stats-container">
      <div class="token-item">
        <img src="@/assets/coin-icon.png" alt="Монеты" class="token-icon" />
        <span>{{ userCoins }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/creativity.png" alt="Творчество" class="token-icon" />
        <span>{{ creativityTokens }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/trophy-icon.png" alt="Трофеи" class="token-icon" />
        <span>{{ trophyTokens }}</span>
      </div>
    </div>

    <div class="category-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="masterclasses">
      <div class="masterclass-card" v-for="masterClass in filteredMasterClasses" :key="masterClass.id">
        <h3 class="masterclass-title">{{ masterClass.title }}</h3>
        <img :src="masterClass.imageUrl" :alt="masterClass.title" class="masterclass-image" />
        <button class="start-button" @click="openMasterClassPanel(masterClass)">
          Начать
        </button>
      </div>
    </div>

    <CreativeClassPanel
      v-if="isPanelVisible"
      :master-class="currentMasterClass"
      @close="closeMasterClassPanel"
      @complete="handleComplete"
      @photo-sent="handlePhotoSent"
    />
  </div>
</template>

<script>
import CreativeClassPanel from '@/components/CreativeClassPanel.vue'

export default {
  name: 'CreativityView',
  components: {
    CreativeClassPanel
  },
  data() {
    return {
      userCoins: 100,
      creativityTokens: 3,
      trophyTokens: 5,
      activeTab: 'drawing',
      tabs: [
        { id: 'drawing', name: 'Рисовать' },
        { id: 'paper', name: 'Бумага' },
        { id: 'sculpting', name: 'Лепка' }
      ],
      masterClasses: [
        {
          id: 1,
          type: 'drawing',
          title: 'Рисуем котика',
          imageUrl: '/images/cat-drawing.jpg',
          videoUrl: '/videos/cat-drawing.mp4'
        },
        {
          id: 2,
          type: 'paper',
          title: 'Оригами журавлик',
          imageUrl: '/images/origami-crane.jpg',
          videoUrl: '/videos/origami-crane.mp4'
        },
        {
          id: 3,
          type: 'sculpting',
          title: 'Лепим динозавра',
          imageUrl: '/images/dino-sculpt.jpg',
          videoUrl: '/videos/dino-sculpt.mp4'
        }
      ],
      isPanelVisible: false,
      currentMasterClass: null
    }
  },
  computed: {
    filteredMasterClasses() {
      return this.masterClasses.filter(mc => mc.type === this.activeTab)
    }
  },
  methods: {
    openMasterClassPanel(masterClass) {
      this.currentMasterClass = masterClass
      this.isPanelVisible = true
    },
    closeMasterClassPanel() {
      this.isPanelVisible = false
      this.currentMasterClass = null
    },
    handleComplete(masterClassId) {
      console.log(`Мастер-класс ${masterClassId} выполнен`)
    },
    handlePhotoSent(data) {
      console.log(`Фото отправлено для мастер-класса ${data.classId}`)
      this.userCoins += 10
      this.trophyTokens += 1
      this.isPanelVisible = false
    }
  }
}
</script>

<style scoped>
.creativity-container {
  padding: 20px;
  min-height: 100vh;
  color: white;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
}

.creativity-header {
  text-align: center;
  margin-bottom: 20px;
}

.creativity-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.token-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 20px;
}

.token-icon {
  width: 24px;
  height: 24px;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.tab-button.active {
  background: #3b82f6;
}

.masterclasses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.masterclass-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.masterclass-title {
  font-size: 20px;
  text-align: center;
}

.masterclass-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.start-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.2s;
}

.start-button:hover {
  background-color: #2563eb;
}

@media (max-width: 600px) {
  .category-tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 120px;
  }

  .masterclass-card {
    padding: 15px;
  }

  .masterclass-title {
    font-size: 18px;
  }
}
</style> 