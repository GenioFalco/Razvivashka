<template>
  <div class="tonguetwister-container">
    <header class="tonguetwister-header">
      <h1 class="tonguetwister-title">Скороговорки</h1>
    </header>
    <div class="stats-container">
      <div class="token-item">
        <img src="@/assets/coin-icon.png" alt="Монеты" class="token-icon" />
        <span>{{ userCoins }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/tonguetwisters.png" alt="Скороговорки" class="token-icon" />
        <span>{{ tonguetwistersCount }}</span>
      </div>
    </div>
    <p class="completed-counter">Выполнено: {{ completedCount }} из {{ tonguetwister.length }} скороговорок</p>
    <p class="section-description">🗣️ Добро пожаловать в раздел «Скороговорки»!
            У нас есть 3 интересные скороговорки.
            За каждую выполненную скороговорку ты получаешь награду.
            А если выполнишь все, получишь особую награду! 🏆</p>
    <div class="tasks">
      <div class="task-card" v-for="twister in tonguetwister" :key="twister.id">
        <div class="task-info">
          <p class="task-description">{{ twister.text }}</p>
        </div>
        <div class="task-action">
          <button v-if="!twister.completed" class="execute-button" @click="openTongueTwisterPanel(twister)">Выполнить</button>
          <img v-else src="@/assets/galochka.png" alt="Выполнено" class="check-mark" />
        </div>
      </div>
    </div>

    <TongueTwisterPanel
      v-if="panelVisible"
      :tonguetwister="currentTwister"
      @close="closeTongueTwisterPanel"
      @execute="handleTwisterExecution"
    />
  </div>
</template>

<script>
import TongueTwisterPanel from '@/components/TongueTwisterPanel.vue';

export default {
  name: 'TonguetwistersView',
  components: { TongueTwisterPanel },
  data() {
    return {
      userCoins: 100,
      tonguetwistersCount: 3,
      tonguetwister: [
        {
          id: 1,
          text: "Карл у Клары украл кораллы, а Клара у Карла украла кларнет",
          completed: false
        },
        {
          id: 2,
          text: "На дворе трава, на траве дрова, не руби дрова на траве двора",
          completed: false
        },
        {
          id: 3,
          text: "Шла Саша по шоссе и сосала сушку",
          completed: false
        }
      ],
      panelVisible: false,
      currentTwister: null
    };
  },
  computed: {
    completedCount() {
      return this.tonguetwister.filter(twister => twister.completed).length;
    }
  },
  methods: {
    openTongueTwisterPanel(twister) {
      this.currentTwister = twister;
      this.panelVisible = true;
    },
    closeTongueTwisterPanel() {
      this.panelVisible = false;
      this.currentTwister = null;
    },
    handleTwisterExecution(twisterId) {
      const twister = this.tonguetwister.find(t => t.id === twisterId);
      if (twister && !twister.completed) {
        twister.completed = true;
        this.userCoins += 10; // Награда за выполнение
      }
      this.panelVisible = false;
    }
  }
};
</script>

<style scoped>
.tonguetwister-container {
  padding: 20px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: white;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
  overflow: hidden;
}

.tonguetwister-header {
  text-align: center;
  margin-bottom: 10px;
}

.tonguetwister-title {
  font-size: 24px;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.token-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.token-icon {
  width: 24px;
  height: 24px;
}

.completed-counter {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 10px;
}

.task-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-info {
  flex: 1;
  padding-right: 15px;
}

.task-description {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  color: #fff;
}

.task-action {
  display: flex;
  align-items: center;
}

.execute-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;
}

.check-mark {
  width: 30px;
  height: 30px;
}

.section-description {
  font-size: 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 8px;
  margin: 0 auto 20px auto;
  max-width: 600px;
}

@media (max-width: 600px) {
  .task-card {
    flex-direction: column;
    gap: 15px;
  }

  .task-info {
    padding-right: 0;
  }

  .task-action {
    width: 100%;
    justify-content: center;
  }

  .execute-button {
    width: 100%;
  }
}
</style> 