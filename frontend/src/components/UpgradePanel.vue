<template>
  <div v-if="isVisible" class="upgrade-panel-overlay">
    <div class="panel-content">
      <button class="close-button" @click="$emit('close')">✕</button>
      <h2 class="panel-title">{{ character?.name || 'Персона' }}</h2>
      <div class="character-level">Уровень {{ character?.level || 0 }}</div>

          <div class="parameters-list">
        <div v-for="param in parameters" :key="param.name" class="parameter-item">
          <div class="parameter-info">
              <div class="parameter-header">
              <span class="parameter-label">{{ param.label }}</span>
              <span class="parameter-value">{{ character?.[`${param.name}_level`] || 0 }} / {{ maxParameterValue }}</span>
              </div>
                <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: getProgressWidth(param.name) }"
              ></div>
            </div>
          </div>
          <button 
            @click="upgradeParameter(param.name)"
            :disabled="!canUpgrade(param.name) || !hasToken(param.token)"
            class="upgrade-button"
          >
            <img :src="getTokenIcon(param.token)" alt="Token" class="token-icon" />
            <span>+1</span>
          </button>
        </div>
      </div>

      <button 
        @click="levelUp"
        :disabled="!canLevelUp"
        class="level-up-button"
      >
        Повысить уровень
      </button>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import creativityIcon from '@/assets/creativity.png';
import neuroIcon from '@/assets/neuro.png';
  import riddlesIcon from '@/assets/riddles.png';
import dailyAdmissionIcon from '@/assets/daily_admission.png';
import rebusIcon from '@/assets/rebus.png';
  import articulationIcon from '@/assets/articulation.png';
import dailyIcon from '@/assets/daily.png';
import tongueTwisterIcon from '@/assets/tonguetwisters.png';
import { API_URL } from '@/config';
  
  const props = defineProps({
    isVisible: {
      type: Boolean,
    default: false
  },
  character: {
    type: Object,
    required: true
  },
  tokens: {
    type: Object,
      required: true
    },
  maxParameterValue: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'upgrade']);

const parameters = [
  { name: 'creativity', label: 'Креативность', token: 'creativity' },
  { name: 'intelligence', label: 'Интеллект', token: 'riddles' },
  { name: 'wit', label: 'Остроумие', token: 'rebus' },
  { name: 'energy', label: 'Энергичность', token: 'neuro' },
  { name: 'focus', label: 'Фокусировка', token: 'tongueTwister' },
  { name: 'articulation', label: 'Артикуляция', token: 'articulation' },
  { name: 'activity', label: 'Активность', token: 'daily' }
];

const guestId = localStorage.getItem('guestId');

const upgradeParameter = async (parameter) => {
  try {
    const response = await fetch(`${API_URL}/profile/${guestId}/character/${props.character.id}/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parameter })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    emit('upgrade', data);
  } catch (error) {
    console.error('Error upgrading parameter:', error);
  }
};

const levelUp = async () => {
  try {
    const response = await fetch(`${API_URL}/profile/${guestId}/character/${props.character.id}/level-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    emit('upgrade', data);
  } catch (error) {
    console.error('Error leveling up character:', error);
  }
};

const getMaxLevel = computed(() => {
  // Получаем максимальный уровень параметра в зависимости от уровня персонажа
  const characterLevel = props.character?.level || 0;
  const maxLevels = {
    0: 5,
    1: 8,
    2: 11,
    3: 14,
    4: 17,
    5: 20
  };
  return maxLevels[characterLevel] || 5;
});

const canUpgrade = (paramName) => {
  const paramLevel = props.character[`${paramName}_level`] || 0;
  const tokenName = parameters.find(p => p.name === paramName)?.token;
  return hasToken(tokenName) && paramLevel < getMaxLevel.value;
};

const canLevelUp = computed(() => {
  if (!props.character) return false;
  
  // Проверяем, что все параметры достигли максимального уровня
  const allParametersMaxed = parameters.every(param => {
    const paramLevel = props.character[`${param.name}_level`] || 0;
    return paramLevel >= props.maxParameterValue;
  });
  
  // Проверяем, что уровень персонажа меньше 10
  const characterLevel = props.character.level || 0;
  return allParametersMaxed && characterLevel < 10;
});

const hasToken = (tokenName) => {
  return (props.tokens?.[tokenName] || 0) > 0;
};

const getTokenIcon = (tokenName) => {
  const icons = {
    creativity: creativityIcon,
    riddles: riddlesIcon,
    rebus: rebusIcon,
    neuro: neuroIcon,
    tongueTwister: tongueTwisterIcon,
    articulation: articulationIcon,
    daily: dailyIcon
  };
  return icons[tokenName];
};

const getProgressWidth = (paramName) => {
  const currentLevel = props.character?.[`${paramName}_level`] || 0;
  return `${(currentLevel / props.maxParameterValue) * 100}%`;
};

const maxParameterValue = computed(() => {
  if (!props.character) return 5;
  return props.character.max_parameter_value || 5;
});
  </script>
  
  <style scoped>
.upgrade-panel-overlay {
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

.panel-title {
  font-size: 24px;
  color: white;
  margin: 20px 0 10px;
  text-align: center;
}

.character-level {
  font-size: 18px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  }
  
  .parameters-list {
    display: flex;
    flex-direction: column;
  gap: 15px;
  padding: 0 10px;
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
  }
  
  .parameter-item {
    background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.parameter-info {
  flex: 1;
  margin-right: 15px;
  }
  
  .parameter-header {
    display: flex;
    justify-content: space-between;
  margin-bottom: 8px;
}

.parameter-label {
  color: white;
  font-size: 16px;
}

.parameter-value {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  }
  
  .progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }
  
.upgrade-button {
    display: flex;
    align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
    border: none;
  border-radius: 8px;
    cursor: pointer;
  color: white;
    transition: background-color 0.2s;
  }
  
.upgrade-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.upgrade-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.05);
}

.upgrade-button span {
  color: white;
  }
  
  .token-icon {
  width: 20px;
  height: 20px;
}

.token-cost {
  color: white;
  font-size: 14px;
  }
  
  .level-up-button {
  width: 90%;
  margin: 0 auto 20px;
  padding: 15px;
    background: #3b82f6;
    color: white;
    border: none;
  border-radius: 10px;
  font-size: 18px;
    cursor: pointer;
  }
  
  .level-up-button:disabled {
  background: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
  }
  
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
  }
  </style> 