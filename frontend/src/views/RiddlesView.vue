<template>
    <div class="riddles-container">
      <header class="riddles-header">
        <h1 class="riddles-title">Загадки</h1>
      </header>
      <div class="stats-container">
        <div class="token-item">
          <img src="@/assets/coin-icon.png" alt="Монеты" class="token-icon" />
          <span>{{ userCoins }}</span>
        </div>
        <div class="token-item">
          <img src="@/assets/riddles.png" alt="Загадки" class="token-icon" />
          <span>{{ riddlesCount }}</span>
        </div>
        <div class="token-item">
          <img src="@/assets/trophy-icon.png" alt="Жетоны" class="token-icon" />
          <span>{{ trophyTokens }}</span>
        </div>
      </div>
      <p class="completed-counter">Выполнено: {{ completedCount }} из {{ riddles.length }} загадок</p>
      <p class="section-description">🌞 Добро пожаловать в раздел Загадки!
              Каждый день тебя ждут 5 интересных загадок.
              За каждую загадку ты получаешь награду.
              А если выполнишь все загадки, получишь особую награду! 🏆</p>
      <div class="tasks">
        <div class="task-card" v-for="riddle in riddles" :key="riddle.id">
          <div class="task-info">
            <p class="task-description">{{ riddle.text }}</p>
          </div>
          <div class="task-action">
            <button v-if="!riddle.completed" class="execute-button" @click="openRiddlePanel(riddle)">Отгадать</button>
            <img v-else src="@/assets/galochka.png" alt="Выполнено" class="check-mark" />
          </div>
        </div>
      </div>

      <RiddlePanel
        v-if="riddlePanelVisible"
        :riddle="currentRiddle"
        :showAnswer="showAnswer"
        @close="closeRiddlePanel"
        @submit-answer="handleAnswerSubmit"
        @show-answer="handleShowAnswer"
      />
    </div>
  </template>
  
  <script>
  import RiddlePanel from '@/components/RiddlePanel.vue';
  export default {
    components: { RiddlePanel },
    data() {
      return {
        userCoins: 100,
        riddlesCount: 10,
        trophyTokens: 5,
        showAnswer: false,
        riddles: [
          {
            id: 1,
            text: "Не человек, а рассказывает, не книга, а учит, не имеет рта, а говорит?",
            answer: "Компьютер",
            completed: false
          },
          {
            id: 2,
            text: "Какая вещь может быть в кармане, когда кармана нет?",
            answer: "Дырка",
            completed: false
          },
          {
            id: 3,
            text: "Что можно увидеть с закрытыми глазами?",
            answer: "Сон",
            completed: false
          },
          {
            id: 4,
            text: "Что становится больше, если его поставить вверх ногами?",
            answer: "Число 6",
            completed: false
          },
          {
            id: 5,
            text: "Что может путешествовать по миру, оставаясь в одном и том же углу?",
            answer: "Почтовая марка",
            completed: false
          }
        ],
        riddlePanelVisible: false,
        currentRiddle: null
      };
    },
    computed: {
      completedCount() {
        return this.riddles.filter(riddle => riddle.completed).length;
      }
    },
    methods: {
      openRiddlePanel(riddle) {
        this.currentRiddle = riddle;
        this.riddlePanelVisible = true;
        this.showAnswer = false;
      },
      closeRiddlePanel() {
        this.riddlePanelVisible = false;
        this.currentRiddle = null;
        this.showAnswer = false;
      },
      handleAnswerSubmit() {
        if (this.currentRiddle) {
          this.currentRiddle.completed = true;
          this.riddlePanelVisible = false;
        }
      },
      handleShowAnswer() {
        if (this.trophyTokens > 0) {
          this.trophyTokens--;
          this.showAnswer = true;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .riddles-container {
    padding: 20px;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    color: white;
    background: linear-gradient(180deg, #4a90e2, #003f7f);
    overflow: hidden;
  }
  .riddles-header {
    text-align: center;
    margin-bottom: 10px;
  }

  .riddles-title {
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
    