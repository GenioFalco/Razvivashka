<template>
  <div class="subscription-container">
    <header class="subscription-header">
      <h1 class="subscription-title">Подписка</h1>
    </header>

    <!-- Текущая подписка -->
    <div class="current-subscription">
      <h2>Ваша подписка</h2>
      <div class="subscription-info" v-if="hasActiveSubscription">
        <div class="subscription-status active">
          <span class="status-label">Статус:</span>
          <span class="status-value">Активна</span>
        </div>
        <div class="subscription-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Тариф:</span>
              <span class="detail-value">{{ currentPlan }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Дата покупки:</span>
              <span class="detail-value">{{ purchaseDate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Действует до:</span>
              <span class="detail-value">{{ expiryDate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Осталось дней:</span>
              <span class="detail-value">{{ daysLeft }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="no-subscription" v-else>
        <p>У вас пока нет активной подписки</p>
        <p class="suggestion">Выберите подходящий тариф ниже</p>
      </div>
    </div>

    <!-- Тарифы -->
    <div class="subscription-plans">
      <h2>Тарифы</h2>
      <div class="plans-container">
        <div class="plan-card" v-for="plan in plans" :key="plan.id">
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price">{{ plan.price }}</span>
              <span class="currency">₽</span>
            </div>
          </div>
          <div class="plan-features">
            <ul>
              <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>
          <button class="subscribe-button" @click="handleSubscribe(plan)">
            Оформить
          </button>
          <div class="plan-savings" v-if="plan.savings">
            Экономия {{ plan.savings }}₽
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionView',
  data() {
    return {
      hasActiveSubscription: true, // Для демонстрации, потом будет из API
      currentPlan: '6 месяцев развития',
      purchaseDate: '01.03.2024',
      expiryDate: '01.09.2024',
      daysLeft: 150,
      plans: [
        {
          id: 1,
          name: '1 месяц развития',
          price: 299,
          features: [
            'Доступ ко всем упражнениям',
            'Ежедневные задания',
            'Отслеживание прогресса',
            'Награды за достижения'
          ],
          savings: 0
        },
        {
          id: 2,
          name: '6 месяцев развития',
          price: 1499,
          features: [
            'Всё из тарифа "1 месяц"',
            'Экономия 295₽',
            'Расширенная статистика',
            'Приоритетная поддержка'
          ],
          savings: 295
        },
        {
          id: 3,
          name: '1 год развития',
          price: 2499,
          features: [
            'Всё из тарифа "6 месяцев"',
            'Экономия 1089₽',
            'Эксклюзивные задания',
            'VIP поддержка'
          ],
          savings: 1089
        }
      ]
    }
  },
  methods: {
    handleSubscribe(plan) {
      console.log(`Оформление подписки на тариф: ${plan.name}`)
      // Здесь будет логика оформления подписки
    }
  }
}
</script>

<style scoped>
.subscription-container {
  padding: 20px;
  min-height: 100vh;
  color: white;
  background: linear-gradient(180deg, #4a90e2, #003f7f);
}

.subscription-header {
  text-align: center;
  margin-bottom: 30px;
}

.subscription-title {
  font-size: 24px;
}

.current-subscription {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  text-align: left;
}

.current-subscription h2 {
  font-size: 20px;
  margin-bottom: 20px;
  padding-left: 10px;
}

.subscription-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subscription-status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  padding-left: 10px;
}

.subscription-status.active {
  color: #4ade80;
}

.subscription-details {
  width: 100%;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.detail-label {
  font-size: 14px;
  opacity: 0.8;
}

.detail-value {
  font-size: 14px;
}

.no-subscription {
  text-align: center;
  padding: 20px;
}

.suggestion {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 10px;
}

.subscription-plans h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.plan-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.plan-header {
  text-align: center;
}

.plan-header h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.plan-price {
  font-size: 24px;
  font-weight: bold;
}

.currency {
  font-size: 16px;
  opacity: 0.8;
}

.plan-features {
  flex-grow: 1;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  padding: 8px 0;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4ade80;
}

.subscribe-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.subscribe-button:hover {
  background: #2563eb;
}

.plan-savings {
  position: absolute;
  top: 10px;
  right: -30px;
  background: #4ade80;
  color: white;
  padding: 5px 30px;
  transform: rotate(45deg);
  font-size: 12px;
}

@media (max-width: 768px) {
  .detail-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .detail-item {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 