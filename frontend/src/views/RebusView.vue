<template>
  <div class="rebus-view">
    <div class="header">
      <h1>Ребусы</h1>
      <div class="stats-container">
        <div class="token-item">
          <img src="@/assets/coin-icon.png" alt="Монеты" class="token-icon" />
          <span>{{ userCoins }}</span>
        </div>
        <div class="token-item">
          <img src="@/assets/rebus.png" alt="Ребусы" class="token-icon" />
          <span>{{ rebusCount }}</span>
        </div>
        <div class="token-item">
          <img src="@/assets/trophy-icon.png" alt="Трофеи" class="token-icon" />
          <span>{{ trophyTokens }}</span>
        </div>
      </div>
    </div>

    <p class="completed-counter">Выполнено: {{ completedCount }} из {{ rebusNames.length }} ребусов</p>
    <p class="section-description">🎯 Добро пожаловать в раздел «Ребусы»!
            У нас есть 3 интересных ребуса.
            За каждый разгаданный ребус ты получаешь награду.
            А если разгадаешь все, получишь особую награду! 🏆</p>

    <div class="rebus-container">
      <div class="rebus-card" @click="openRebusPanel">
        <img src="@/assets/merged_image_with_numbers.jpg" alt="Ребусы" class="preview-image"/>
        <div class="rebus-names">
          <div v-for="(name, index) in rebusNames" :key="index" class="rebus-name">
            <div class="rebus-name-content">
              <span>Ребус {{ index + 1 }}: {{ name }}</span>
              <img v-if="completedRebuses[index]" src="@/assets/galochka.png" alt="Выполнено" class="check-mark" />
            </div>
          </div>
        </div>
        <button class="solve-button">Решить ребусы</button>
        <div class="completion-status" v-if="isCompleted">
          Выполнено
        </div>
      </div>
    </div>

    <RebusPanel
      v-if="isPanelVisible"
      :show-answers="showAnswers"
      :answers="rebusAnswers"
      @close="closeRebusPanel"
      @submit-answer="handleAnswerSubmit"
      @show-answer="handleShowAnswer"
    />
  </div>
</template>

<script>
import RebusPanel from '@/components/RebusPanel.vue'

export default {
  name: 'RebusView',
  components: {
    RebusPanel
  },
  data() {
    return {
      userCoins: 100,
      trophyTokens: 5,
      rebusCount: 3,
      isPanelVisible: false,
      showAnswers: [false, false, false],
      rebusNames: ['Первый ребус', 'Второй ребус', 'Третий ребус'],
      rebusAnswers: ['РАДУГА', 'КОРАБЛЬ', 'СОЛНЦЕ'],
      completedCount: 0,
      isCompleted: false,
      completedRebuses: [false, false, false]
    }
  },
  methods: {
    openRebusPanel() {
      this.isPanelVisible = true
    },
    closeRebusPanel() {
      this.isPanelVisible = false
    },
    handleAnswerSubmit(rebusNumber) {
      // Здесь будет логика проверки ответа
      console.log(`Отправлен ответ для ребуса ${rebusNumber}`)
      this.completedRebuses[rebusNumber - 1] = true
      this.completedCount = this.completedRebuses.filter(completed => completed).length
      if (this.completedCount === this.rebusNames.length) {
        this.isCompleted = true
      }
    },
    handleShowAnswer(rebusNumber) {
      if (this.userCoins >= 1) {
        this.userCoins -= 1
        this.$set(this.showAnswers, rebusNumber - 1, true)
      }
    }
  }
}
</script>

<style scoped>
.rebus-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
  padding: 20px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 24px;
  margin-bottom: 20px;
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

.completed-counter {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
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

.rebus-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.rebus-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
}

.rebus-names {
  margin: 15px 0;
}

.rebus-name {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  font-size: 16px;
}

.rebus-name-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-mark {
  width: 24px;
  height: 24px;
  margin-left: 10px;
}

.solve-button {
  width: 100%;
  padding: 15px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.solve-button:hover {
  background: #2563eb;
}

.completion-status {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #10b981;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
}

@media (max-width: 600px) {
  .rebus-card {
    padding: 15px;
  }

  .rebus-name {
    font-size: 14px;
    padding: 8px;
  }

  .solve-button {
    padding: 12px;
    font-size: 16px;
  }

  .check-mark {
    width: 20px;
    height: 20px;
  }
}
</style> 