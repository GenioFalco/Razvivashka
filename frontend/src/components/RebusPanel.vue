<template>
  <div class="rebus-panel">
    <div class="panel-overlay"></div>
    <div class="panel-content">
      <button class="close-button" @click="$emit('close')">✕</button>
      <img src="@/assets/merged_image_with_numbers.jpg" alt="Ребусы" class="rebus-image"/>
      
      <div class="button-group">
        <div class="rebus-section" v-for="n in 3" :key="n">
          <div class="rebus-buttons">
            <button class="answer-button" @click="$emit('submit-answer', n)">
              Ответить на ребус {{ n }}
            </button>
            <button 
              class="show-answer-button" 
              @click="$emit('show-answer', n)"
              v-if="!showAnswers[n-1]"
            >
              Посмотреть ответ {{ n }} (1 жетон)
            </button>
          </div>
          <p class="answer-text" v-if="showAnswers[n-1]">{{ answers[n-1] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RebusPanel',
  props: {
    showAnswers: {
      type: Array,
      default: () => [false, false, false]
    },
    answers: {
      type: Array,
      default: () => ['', '', '']
    }
  }
};
</script>

<style scoped>
.rebus-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.panel-content {
  position: relative;
  background: #4C7C94;
  width: 100%;
  height: 90vh;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.rebus-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  margin: 20px 0;
  border-radius: 10px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 400px;
  margin-top: 20px;
}

.rebus-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rebus-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-button, .show-answer-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
}

.show-answer-button {
  background-color: #4a5568;
}

.answer-text {
  font-size: 18px;
  color: #fff;
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  width: 100%;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  opacity: 0.8;
}
</style> 