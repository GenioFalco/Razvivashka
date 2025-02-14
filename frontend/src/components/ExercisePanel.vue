<template>
  <div class="exercise-panel">
    <div class="panel-overlay"></div>
    <div class="panel-content">
      <button class="close-button" @click="$emit('close')">✕</button>
      
      <h2 class="exercise-title">{{ exercise.title }}</h2>
      
      <div class="video-container">
        <video 
          :src="exercise.videoUrl" 
          controls 
          class="exercise-video"
        ></video>
      </div>

      <p class="exercise-description">{{ exercise.description }}</p>

      <div class="button-group">
        <button 
          class="complete-button"
          @click="$emit('complete', exercise.id)"
        >
          Выполнил
        </button>
        <button 
          class="partial-complete-button"
          @click="$emit('partial-complete', exercise.id)"
        >
          Выполнил не все
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExercisePanel',
  props: {
    exercise: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        title: '',
        videoUrl: '',
        description: ''
      })
    }
  }
};
</script>

<style scoped>
.exercise-panel {
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

.exercise-title {
  font-size: 24px;
  color: white;
  margin: 20px 0;
  text-align: center;
  width: 100%;
}

.video-container {
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
  border-radius: 10px;
  overflow: hidden;
}

.exercise-video {
  width: 100%;
  border-radius: 10px;
  background: #000;
}

.exercise-description {
  font-size: 18px;
  color: white;
  line-height: 1.5;
  margin: 20px 0;
  padding: 0 20px;
  text-align: center;
  max-width: 600px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 90%;
  max-width: 400px;
  margin-top: auto;
  margin-bottom: 20px;
}

.complete-button, .partial-complete-button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.complete-button {
  background-color: #3b82f6;
  color: white;
}

.partial-complete-button {
  background-color: #4a5568;
  color: white;
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

@media (max-width: 600px) {
  .panel-content {
    padding: 15px;
  }

  .exercise-title {
    font-size: 20px;
  }

  .exercise-description {
    font-size: 16px;
  }

  .button-group {
    width: 100%;
  }
}
</style> 