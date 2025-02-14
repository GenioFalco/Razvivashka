<template>
  <div class="creative-class-panel">
    <div class="panel-overlay"></div>
    <div class="panel-content">
      <button class="close-button" @click="$emit('close')">✕</button>
      
      <h2 class="class-title">{{ masterClass.title }}</h2>
      
      <div class="video-container">
        <video 
          :src="masterClass.videoUrl" 
          controls 
          class="class-video"
        ></video>
      </div>

      <div class="button-group">
        <button 
          v-if="!isCompleted"
          class="complete-button"
          @click="handleComplete"
        >
          Выполнил
        </button>
        <button 
          v-if="isCompleted && !photoSent"
          class="photo-button"
          @click="handlePhotoUpload"
        >
          Отправить фото
        </button>
        <input 
          type="file" 
          ref="fileInput" 
          accept="image/*" 
          style="display: none"
          @change="onFileSelected"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreativeClassPanel',
  props: {
    masterClass: {
      type: Object,
      required: true,
      default: () => ({
        id: 0,
        title: '',
        videoUrl: '',
        imageUrl: ''
      })
    }
  },
  data() {
    return {
      isCompleted: false,
      photoSent: false
    }
  },
  methods: {
    handleComplete() {
      this.isCompleted = true
      this.$emit('complete', this.masterClass.id)
    },
    handlePhotoUpload() {
      this.$refs.fileInput.click()
    },
    onFileSelected(event) {
      const file = event.target.files[0]
      if (file) {
        this.photoSent = true
        this.$emit('photo-sent', {
          classId: this.masterClass.id,
          file: file
        })
      }
    }
  }
};
</script>

<style scoped>
.creative-class-panel {
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

.class-title {
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

.class-video {
  width: 100%;
  border-radius: 10px;
  background: #000;
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

.complete-button, .photo-button {
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

.photo-button {
  background-color: #10b981;
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

  .class-title {
    font-size: 20px;
  }

  .button-group {
    width: 100%;
  }
}
</style> 