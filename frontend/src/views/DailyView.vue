<template>
  <div class="daily-view">
    <div class="header">
      <div class="tokens">
        <div class="token-item">
          <img src="@/assets/coin-icon.png" alt="Монеты" />
          <span>{{ userCoins }}</span>
        </div>
        <div class="token-item">
          <img src="@/assets/daily.png" alt="Жетоны" />
          <span>{{ dailyTokens }}</span>
        </div>
      </div>
    </div>

    <div class="description">
      <h2>Ежедневные задания</h2>
      <p>Выполняйте задания и получайте награды!</p>
      <div class="progress">
        <span>Выполнено: {{ completedCount }}/5</span>
      </div>
    </div>

    <div class="tasks-container" v-if="!loading">
      <div v-for="task in tasks" :key="task.id" class="task-card" @click="openTaskPanel(task)">
        <div class="task-content">
          <h3>{{ task.title }}</h3>
          <div class="task-rewards">
            <div class="reward" v-if="task.coins_reward">
              <img src="@/assets/coin-icon.png" alt="Монеты" />
              <span>+{{ task.coins_reward }}</span>
            </div>
            <div class="reward" v-if="task.xp_reward">
              <img src="@/assets/xp-icon.png" alt="XP" />
              <span>+{{ task.xp_reward }}</span>
            </div>
            <div class="reward" v-if="task.activity_tokens_reward">
              <img src="@/assets/daily.png" alt="Жетоны" />
              <span>+{{ task.activity_tokens_reward }}</span>
            </div>
          </div>
        </div>
        <div class="task-status">
          <img v-if="task.completed" src="@/assets/galochka.png" alt="Выполнено" class="status-icon" />
          <button v-else class="execute-button" @click.stop="openTaskPanel(task)">Выполнить</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Загрузка...
    </div>

    <DailyTaskPanel
      v-if="taskPanelVisible"
      :task="currentTask"
      @close="taskPanelVisible = false"
      @execute="handleTaskExecution"
    />

    <TaskRewardPanel
      :is-visible="showRewards"
      :rewards="currentRewards"
      @collect="hideRewards"
    />
  </div>
</template>

<script>
import DailyTaskPanel from '@/components/DailyTaskPanel.vue';
import TaskRewardPanel from '@/components/TaskRewardPanel.vue';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export default {
  components: { DailyTaskPanel, TaskRewardPanel },
  setup() {
    const userCoins = ref(0);
    const dailyTokens = ref(0);
    const tasks = ref([]);
    const taskPanelVisible = ref(false);
    const currentTask = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const showRewards = ref(false);
    const currentRewards = ref({});

    const completedCount = computed(() => {
      return tasks.value.filter(task => task.completed).length;
    });

    const loadTasks = async () => {
      try {
        loading.value = true;
        error.value = null;
        const userId = localStorage.getItem('userId');
        
        // Загружаем задания
        const tasksResponse = await axios.get(`${API_URL}/daily/${userId}/tasks`);
        tasks.value = tasksResponse.data;  // Используем данные как есть, включая статус completed

        // Загружаем данные пользователя через отдельную функцию
        await loadUserData();
      } catch (err) {
        console.error('Error loading tasks:', err);
        error.value = 'Ошибка при загрузке заданий';
      } finally {
        loading.value = false;
      }
    };

    const openTaskPanel = (task) => {
      if (!task.completed) {
        currentTask.value = task;
        taskPanelVisible.value = true;
      }
    };

    const handleTaskExecution = async (taskId) => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.post(`${API_URL}/daily/${userId}/complete/${taskId}`);
        
        // Обновляем данные пользователя
        userCoins.value = response.data.user.coins;
        dailyTokens.value = response.data.user.activity_tokens;

        // Показываем панель с наградами
        currentRewards.value = response.data.rewards;
        taskPanelVisible.value = false;
        showRewards.value = true;

        // Обновляем список заданий
        await loadTasks();
      } catch (err) {
        console.error('Error completing task:', err);
        alert('Ошибка при выполнении задания');
      }
    };

    const hideRewards = () => {
      showRewards.value = false;
    };

    onMounted(() => {
      loadTasks();
    });

    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userResponse = await axios.get(`${API_URL}/profile/${userId}`);
        userCoins.value = userResponse.data.tokens.coins;
        dailyTokens.value = userResponse.data.tokens.activity_tokens;
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    return {
      userCoins,
      dailyTokens,
      tasks,
      taskPanelVisible,
      currentTask,
      loading,
      error,
      showRewards,
      currentRewards,
      completedCount,
      openTaskPanel,
      handleTaskExecution,
      hideRewards
    };
  }
};
</script>

<style scoped>
.daily-view {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
}

.header {
  margin-bottom: 20px;
}

.tokens {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.token-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
}

.token-item img {
  width: 20px;
  height: 20px;
}

.description {
  text-align: center;
  margin-bottom: 30px;
}

.progress {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-card {
  background: #4C7C94;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-rewards {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.reward {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 8px;
  border-radius: 15px;
  font-size: 12px;
}

.reward img {
  width: 15px;
  height: 15px;
}

.task-status {
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.status-icon {
  width: 24px;
  height: 24px;
}

.execute-button {
  background: #3b82f6;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.execute-button:hover {
  background: #2563eb;
}

.loading {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>
  