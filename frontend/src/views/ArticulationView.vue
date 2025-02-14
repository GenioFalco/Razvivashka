<template>
  <div class="articulation-container">
    <header class="articulation-header">
      <h1 class="articulation-title">Артикулярная гимнастика</h1>
    </header>
    <div class="stats-container">
      <div class="token-item">
        <img src="@/assets/coin-icon.png" alt="Монеты" class="token-icon" />
        <span>{{ userCoins }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/articulation.png" alt="Артикуляция" class="token-icon" />
        <span>{{ exerciseCount }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/trophy-icon.png" alt="Трофеи" class="token-icon" />
        <span>{{ trophyTokens }}</span>
      </div>
    </div>

    <p class="completed-counter">Выполнено: {{ completedCount }} из {{ exercises.length }} упражнений</p>
    <p class="section-description">👄 Добро пожаловать в раздел «Артикулярная гимнастика»!
            У нас есть упражнения для развития речевого аппарата.
            За каждое выполненное упражнение ты получаешь награду.
            А если выполнишь все, получишь особую награду! 🏆</p>

    <div class="exercises">
      <div class="exercise-card" v-for="exercise in exercises" :key="exercise.id">
        <div class="exercise-info">
          <h3 class="exercise-title">{{ exercise.title }}</h3>
          <p class="exercise-preview">{{ exercise.preview }}</p>
        </div>
        <div class="exercise-action">
          <button v-if="!exercise.completed" class="execute-button" @click="openExercisePanel(exercise)">
            Выполнить
          </button>
          <img v-else src="@/assets/galochka.png" alt="Выполнено" class="check-mark" />
        </div>
      </div>
    </div>

    <ExercisePanel
      v-if="isPanelVisible"
      :exercise="currentExercise"
      @close="closeExercisePanel"
      @complete="handleComplete"
      @partial-complete="handlePartialComplete"
    />
  </div>
</template>

<script>
import ExercisePanel from '@/components/ExercisePanel.vue'

export default {
  name: 'ArticulationView',
  components: {
    ExercisePanel
  },
  data() {
    return {
      userCoins: 100,
      exerciseCount: 3,
      trophyTokens: 5,
      exercises: [
        {
          id: 1,
          title: "Упражнение 'Улыбка-Хоботок'",
          preview: "Развивает подвижность губ",
          description: "Чередуйте улыбку (растягивание губ в стороны) и хоботок (вытягивание губ вперёд трубочкой). Выполняйте упражнение 10-15 раз.",
          videoUrl: "/videos/articulation1.mp4",
          completed: false
        },
        {
          id: 2,
          title: "Упражнение 'Часики'",
          preview: "Развивает подвижность языка",
          description: "Высуньте язык и двигайте им из стороны в сторону, касаясь уголков рта. Выполняйте упражнение 15-20 раз.",
          videoUrl: "/videos/articulation2.mp4",
          completed: false
        },
        {
          id: 3,
          title: "Упражнение 'Качели'",
          preview: "Укрепляет мышцы языка",
          description: "Откройте рот и попеременно касайтесь языком то верхних, то нижних зубов. Выполняйте упражнение 10-15 раз.",
          videoUrl: "/videos/articulation3.mp4",
          completed: false
        }
      ],
      isPanelVisible: false,
      currentExercise: null
    }
  },
  computed: {
    completedCount() {
      return this.exercises.filter(exercise => exercise.completed).length
    }
  },
  methods: {
    openExercisePanel(exercise) {
      this.currentExercise = exercise
      this.isPanelVisible = true
    },
    closeExercisePanel() {
      this.isPanelVisible = false
      this.currentExercise = null
    },
    handleComplete(exerciseId) {
      const exercise = this.exercises.find(ex => ex.id === exerciseId)
      if (exercise && !exercise.completed) {
        exercise.completed = true
        this.userCoins += 10
        this.trophyTokens += 1
      }
      this.isPanelVisible = false
    },
    handlePartialComplete(exerciseId) {
      const exercise = this.exercises.find(ex => ex.id === exerciseId)
      if (exercise && !exercise.completed) {
        this.userCoins += 5
      }
      this.isPanelVisible = false
    }
  }
}
</script>

<style scoped>
.articulation-container {
  padding: 20px;
  min-height: 100vh;
  color: white;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
}

.articulation-header {
  text-align: center;
  margin-bottom: 20px;
}

.articulation-title {
  font-size: 24px;
  margin-bottom: 10px;
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

.exercises {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.exercise-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exercise-info {
  flex: 1;
  padding-right: 20px;
}

.exercise-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.exercise-preview {
  font-size: 14px;
  opacity: 0.8;
}

.exercise-action {
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

@media (max-width: 600px) {
  .exercise-card {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .exercise-info {
    padding-right: 0;
  }

  .exercise-action {
    width: 100%;
  }

  .execute-button {
    width: 100%;
  }
}
</style> 