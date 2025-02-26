<template>
  <div class="daily-container">
    <header class="daily-header">
      <h1 class="daily-title">Ежедневные задания</h1>
    </header>
    <div class="stats-container">
      <div class="token-item">
        <img src="@/assets/coin-icon.png" alt="Монеты" class="token-icon" />
        <span>{{ userCoins }}</span>
      </div>
      <div class="token-item">
        <img src="@/assets/daily.png" alt="Daily Token" class="token-icon" />
        <span>{{ dailyTokens }}</span>
      </div>
    </div>
    <p class="completed-counter">Выполнено: {{ completedCount }} из {{ tasks.length }} заданий</p>
    <p class="section-description">🌞 Добро пожаловать в раздел «Ежедневные задания»!
            Каждый день тебя ждут 5 интересных заданий.
            За каждое выполненное задание ты получаешь награду.
            А если выполнишь все задания, получишь особую награду! 🏆</p>
    <div class="tasks">
      <div class="task-card" v-for="task in tasks" :key="task.id">
        <div class="task-info">
          <h3 class="task-title">{{ task.title }}</h3>
          <p class="task-description">{{ task.description }}</p>
        </div>
        <div class="task-action">
          <button v-if="!task.completed" class="execute-button" @click="openTaskPanel(task)">Выполнить</button>
          <img v-else src="@/assets/galochka.png" alt="Выполнено" class="check-mark" />
        </div>
      </div>
    </div>
    
    <DailyTaskPanel 
      v-if="taskPanelVisible" 
      :visible="taskPanelVisible" 
      :task="currentTask" 
      @execute="handleTaskExecution" 
      @close="taskPanelVisible = false" />
  </div>
</template>

<script>
import DailyTaskPanel from '@/components/DailyTaskPanel.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export default {
  components: { DailyTaskPanel },
  setup() {
    const userCoins = ref(0);
    const dailyTokens = ref(0);
    const tasks = ref([]);
    const taskPanelVisible = ref(false);
    const currentTask = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const loadTasks = async () => {
      try {
        loading.value = true;
        error.value = null;
        const userId = localStorage.getItem('userId');
        
        // Загружаем задания
        const tasksResponse = await axios.get(`${API_URL}/daily/${userId}/tasks`);
        tasks.value = tasksResponse.data;

        // Загружаем данные пользователя
        const userResponse = await axios.get(`${API_URL}/profile/${userId}`);
        userCoins.value = userResponse.data.tokens.coins;
        dailyTokens.value = userResponse.data.tokens.daily;
      } catch (err) {
        console.error('Error loading tasks:', err);
        error.value = 'Ошибка при загрузке заданий';
      } finally {
        loading.value = false;
      }
    };

    const openTaskPanel = (task) => {
      currentTask.value = task;
      taskPanelVisible.value = true;
    };

    const handleTaskExecution = async (taskId) => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.post(`${API_URL}/daily/${userId}/complete/${taskId}`);
        
        // Обновляем данные пользователя
        userCoins.value = response.data.user.coins;
        dailyTokens.value = response.data.user.activity_tokens;

        // Обновляем список заданий
        await loadTasks();

        // Показываем уведомление о награде
        alert(`Награда получена!\nМонеты: +${response.data.rewards.coins}\nОпыт: +${response.data.rewards.xp}\nЖетоны: +${response.data.rewards.activity_tokens}`);
      } catch (err) {
        console.error('Error completing task:', err);
        alert('Ошибка при выполнении задания');
      }
      taskPanelVisible.value = false;
    };

    onMounted(() => {
      loadTasks();
    });

    return {
      userCoins,
      dailyTokens,
      tasks,
      taskPanelVisible,
      currentTask,
      loading,
      error,
      openTaskPanel,
      handleTaskExecution
    };
  }
};
</script>

<style scoped>
.daily-container {
  padding: 20px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: white;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
  overflow: hidden;
}
.daily-header {
  text-align: center;
  margin-bottom: 10px;
}
.daily-title {
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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
  text-align: left;
}
.task-title {
  font-size: 18px;
  margin-bottom: 10px;
}
.task-description {
  font-size: 16px;
  margin-bottom: 15px;
}
.task-action {
  margin-left: 10px;
}
.execute-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  min-width: 100px;
}
.execute-button:disabled {
  background-color: #3b82f6;
  cursor: not-allowed;
}
.check-mark {
  width: 40px;
  height: 40px;
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
</style>
  