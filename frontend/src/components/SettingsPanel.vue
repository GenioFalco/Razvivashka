<template>
    <Transition name="slide-up">
      <div v-if="isVisible" class="settings-panel">
        <div class="settings-header">
          <h2>Настройки</h2>
          <button class="close-button" @click="$emit('close')">
            <span>&times;</span>
          </button>
        </div>
        
        <div class="settings-content">
          <!-- Сообщение об ошибке -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Индикатор загрузки -->
          <div v-if="loading" class="loading-indicator">
            Загрузка...
          </div>

          <div class="setting-group">
            <label>Никнейм</label>
            <div class="nickname-input">
              <input 
                type="text" 
                v-model="nickname" 
                placeholder="Введите никнейм"
                :disabled="loading"
              />
              <button 
                class="save-button" 
                @click="saveNickname"
                :disabled="loading"
              >
                Сохранить
              </button>
            </div>
          </div>
  
          <div class="setting-group">
            <label>Персонаж</label>
            <div class="character-selection">
              <div class="character-preview">
                <img 
                  :src="currentCharacter || profileImage" 
                  alt="Current character" 
                  @error="handleImageError"
                  class="character-image"
                />
              </div>
              <div class="character-list" v-if="availableCharacters.length > 0">
                <div 
                  v-for="char in availableCharacters" 
                  :key="char.id"
                  class="character-option"
                  :class="{ 'selected': char.image_url === currentCharacter }"
                  @click="selectCharacter(char)"
                >
                  <img 
                    :src="char.image_url" 
                    :alt="char.name"
                    @error="handleImageError"
                  />
                </div>
              </div>
              <div v-else class="no-characters">
                Нет доступных персонажей
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="setting-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Введите email"
              :disabled="isEmailVerified"
            />
            <div v-if="!isEmailVerified" class="verification-section">
              <button 
                @click="sendVerificationCode" 
                class="verify-button"
                :disabled="isCodeSent && timeLeft > 0"
              >
                {{ isCodeSent ? `Отправить код (${timeLeft}с)` : 'Подтвердить' }}
              </button>
              
              <div v-if="isCodeSent" class="code-input-section">
                <input 
                  type="text" 
                  v-model="verificationCode" 
                  placeholder="Введите код"
                  maxlength="6"
                  class="code-input"
                />
                <button @click="verifyCode" class="verify-button">
                  Проверить код
                </button>
              </div>
            </div>
            <div v-else class="verified-badge">
              ✓ Email подтвержден
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import profileImage from '@/assets/profile.png';
  import { API_URL } from '@/config';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true
    },
    currentNickname: {
      type: String,
      required: true
    },
    currentEmail: String,
    isEmailVerified: Boolean
  });
  
  const emit = defineEmits(['close', 'update:nickname', 'update:character', 'update:email']);
  
  const nickname = ref(props.currentNickname);
  const currentCharacter = ref('');
  const availableCharacters = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const email = ref(props.currentEmail || '');
  const verificationCode = ref('');
  const isCodeSent = ref(false);
  const timeLeft = ref(0);
  const serverCode = ref('');
  const isEmailVerified = ref(props.isEmailVerified);
  
  let timer = null;
  
  // Загрузка доступных персонажей
  const loadCharacters = async () => {
    try {
      loading.value = true;
      error.value = null;
      const guestId = localStorage.getItem('guestId');
      console.log('Loading characters for guestId:', guestId);

      if (!guestId) {
        error.value = 'GuestId не найден';
        return;
      }

      const response = await axios.get(`${API_URL}/profile/${guestId}/characters`);
      console.log('Characters response:', response.data);
      
      // Преобразуем ответ, создавая прямые URL для изображений
      availableCharacters.value = response.data.characters.map(char => ({
        ...char,
        image_url: `${API_URL}/profile/character/${char.id}/image`
      }));
      
      // Устанавливаем текущего активного персонажа
      const activeChar = availableCharacters.value.find(char => char.is_active);
      console.log('Active character:', activeChar);
      
      if (activeChar) {
        currentCharacter.value = activeChar.image_url;
        emit('update:character', activeChar.image_url);
      } else {
        console.log('No active character found');
      }
    } catch (err) {
      console.error('Error loading characters:', err);
      error.value = 'Ошибка при загрузке персонажей: ' + err.message;
    } finally {
      loading.value = false;
    }
  }
  
  // Сохранение никнейма
  async function saveNickname() {
    try {
      if (!nickname.value || nickname.value.trim().length < 2) {
        error.value = 'Никнейм должен содержать минимум 2 символа';
        return;
      }

      loading.value = true;
      emit('update:nickname', nickname.value);
    } catch (err) {
      console.error('Error saving nickname:', err);
      error.value = 'Ошибка при сохранении никнейма';
    } finally {
      loading.value = false;
    }
  }
  
  // Выбор персонажа
  async function selectCharacter(char) {
    try {
      loading.value = true;
      const guestId = localStorage.getItem('guestId');
      if (!guestId) return;

      await axios.put(`${API_URL}/profile/${guestId}/character`, {
        characterId: char.id
      });

      currentCharacter.value = char.image_url;
      emit('update:character', char.image_url);
    } catch (err) {
      console.error('Error selecting character:', err);
      error.value = 'Ошибка при выборе персонажа';
    } finally {
      loading.value = false;
    }
  }
  
  function startTimer() {
    timeLeft.value = 60;
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }
  
  async function sendVerificationCode() {
    try {
      const response = await axios.post(`${API_URL}/profile/verify-email`, {
        email: email.value
      });
      
      if (response.data.success) {
        isCodeSent.value = true;
        startTimer();
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  }
  
  async function verifyCode() {
    try {
      const response = await axios.post(`${API_URL}/profile/confirm-email`, {
        email: email.value,
        code: verificationCode.value
      });
      
      if (response.data.success) {
        isEmailVerified.value = true;
        emit('update:email', email.value);
      } else {
        error.value = 'Неверный код подтверждения';
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      error.value = 'Ошибка при проверке кода';
    }
  }
  
  onMounted(() => {
    if (props.isVisible) {
      loadCharacters();
    }
    if (timer) clearInterval(timer);
  });
  
  // Следим за изменением видимости панели
  watch(() => props.isVisible, (newValue) => {
    if (newValue) {
      loadCharacters();
    }
  });

  const handleImageError = (event) => {
    console.log('Image loading error, using default profile image');
    event.target.src = profileImage;
  };
  </script>
  
  <style scoped>
  .settings-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 85vh;
    background: #4C7C94;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 1.5rem 1.5rem 2rem 1.5rem;
    color: white;
    z-index: 1000;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    position: sticky;
    top: 0;
    background: #4C7C94;
    padding: 0.5rem 0;
    z-index: 2;
  }
  
  .settings-header h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
  }
  
  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: calc(100% - 4rem);
    overflow-y: scroll;
    padding-bottom: 4rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  /* Скрываем скроллбар для Chrome, Safari и Opera */
  .settings-content::-webkit-scrollbar {
    display: none;
  }
  
  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .setting-group label {
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  .nickname-input {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    align-items: center;
  }
  
  .nickname-input input {
    flex: 1;
    min-width: 0;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
  }
  
  .nickname-input input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .save-button {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
    min-width: fit-content;
  }
  
  .save-button:hover {
    background: #2563eb;
  }
  
  .character-selection {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .character-preview {
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .character-preview .character-image {
    width: 180px;
    height: 180px;
    object-fit: contain;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    padding: 0.5rem;
    display: block;
  }
  
  .character-list {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .character-option {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .character-option img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .character-option.selected {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  /* Анимация появления снизу */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.3s ease-out;
  }
  
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
  
  /* Стили для мобильных устройств */
  @media (max-width: 768px) {
    .settings-content {
      scroll-snap-type: y proximity;
    }
  
    .setting-group {
      scroll-snap-align: start;
    }
  }
  
  .error-message {
    background: rgba(255, 0, 0, 0.1);
    color: #fff;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    z-index: 1000;
  }
  
  .save-button:disabled,
  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .no-character {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .no-characters {
    text-align: center;
    padding: 1rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .verification-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .verify-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .verify-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .code-input-section {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .code-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    text-align: center;
    letter-spacing: 5px;
  }

  .verified-badge {
    color: #4ade80;
    padding: 8px;
    background: rgba(74, 222, 128, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
  }
  </style> 