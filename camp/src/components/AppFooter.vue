<template>
  <footer class="site-footer">
    <div class="footer-container">
      <!-- Колонка бренда -->
      <div class="footer-col brand-col">
        <RouterLink to="/" class="footer-logo">
          <img src="@/assets/logo-modern.svg" alt="Summer Tech Camp Logo" class="footer-logo-img" />
          <span class="footer-logo-text">SUMMER TECH CAMP</span>
        </RouterLink>
        <p class="footer-desc">
          Платформа IT-образования для будущих разработчиков.<br>
          Курсы, практика и карьерный рост.
        </p>
        
        <!-- Соцсети -->
        <div class="social-links">
          <a href="#" aria-label="Telegram" class="social-link telegram">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
          <a href="#" aria-label="VK" class="social-link vk">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.20 3.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.72-.576.72z"/></svg>
          </a>
          <a href="#" aria-label="YouTube" class="social-link youtube">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.12 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      <!-- Навигация -->
      <div class="footer-col nav-col">
        <h4>Платформа</h4>
        <ul>
          <li><RouterLink to="/courses">Курсы</RouterLink></li>
          <li><RouterLink to="/teachers">Преподаватели</RouterLink></li>
          <li><RouterLink to="/schedule">Расписание</RouterLink></li>
          <li><RouterLink to="/gallery">Галерея</RouterLink></li>
        </ul>
      </div>

      <div class="footer-col nav-col">
        <h4>Ресурсы</h4>
        <ul>
          <li><RouterLink to="/events">Мероприятия</RouterLink></li>
          <li><RouterLink to="/register">Регистрация</RouterLink></li>
          <li><RouterLink to="/login">Вход в систему</RouterLink></li>
        </ul>
      </div>

      <!-- 👇 БЛОК ПОДПИСКИ НА НОВОСТИ -->
      <div class="footer-col subscribe-col">
        <h4>Будьте в курсе</h4>
        <p class="subscribe-desc">Подпишитесь на обновления курсов и мероприятий.</p>
        
        <!-- Если НЕ авторизован: Форма ввода Email -->
        <form v-if="!store.isAuth" @submit.prevent="handleSubscribeEmail" class="subscribe-form">
          <div class="input-wrapper">
            <input 
              v-model="guestEmail" 
              type="email" 
              placeholder="Ваш email" 
              required 
              class="subscribe-input"
            />
            <button type="submit" :disabled="loading" class="btn-subscribe">
              {{ loading ? '...' : '→' }}
            </button>
          </div>
          <p v-if="message" :class="['subscribe-msg', messageType]">{{ message }}</p>
        </form>

        <!-- Если АВТОРИЗОВАН: Кнопка быстрого действия -->
        <div v-else class="auth-subscribe">
          <p class="user-email">Вы вошли как: <strong>{{ store.currentUser?.email }}</strong></p>
          <button 
            @click="toggleSubscription" 
            :disabled="loading"
            :class="['btn-auth-action', isSubscribed ? 'unsubscribe' : 'subscribe']"
          >
            {{ loading ? 'Загрузка...' : (isSubscribed ? 'Отписаться от новостей' : 'Подписаться на новости') }}
          </button>
          <p v-if="message" :class="['subscribe-msg', messageType]">{{ message }}</p>
        </div>
      </div>

      <!-- Контакты -->
      <div class="footer-col contact-col">
        <h4>Контакты</h4>
        <address>
          <p>г. Москва, ул. Технологическая, 42</p>
          <p>info@summertech.camp</p>
          <p>+7 (999) 123-45-67</p>
        </address>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Summer Tech Camp. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()
const guestEmail = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('') // 'success' или 'error'
const isSubscribed = ref(false)

// Проверяем статус подписки при загрузке (для авторизованных)
onMounted(async () => {
  if (store.isAuth && store.currentUser?.email) {
    await checkSubscriptionStatus(store.currentUser.email)
  }
})

// Следим за изменением авторизации
watch(() => store.isAuth, async (val) => {
  if (val && store.currentUser?.email) {
    await checkSubscriptionStatus(store.currentUser.email)
  } else {
    isSubscribed.value = false
    message.value = ''
  }
})

async function checkSubscriptionStatus(email) {
  try {
    const res = await fetch(`http://localhost:3000/api/subscribe/status?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    isSubscribed.value = data.subscribed
  } catch (e) {
    console.error('Ошибка проверки статуса:', e)
  }
}

// Подписка для гостей
async function handleSubscribeEmail() {
  if (!guestEmail.value) return
  
  loading.value = true
  message.value = ''
  
  try {
    const res = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: guestEmail.value })
    })
    
    const data = await res.json()
    
    if (res.ok) {
      message.value = data.message
      messageType.value = 'success'
      guestEmail.value = ''
    } else {
      message.value = data.error
      messageType.value = 'error'
    }
  } catch (e) {
    message.value = 'Ошибка соединения с сервером'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Переключение подписки для авторизованных
async function toggleSubscription() {
  loading.value = true
  message.value = ''
  
  const email = store.currentUser?.email
  if (!email) return
  
  try {
    const url = isSubscribed.value 
      ? 'http://localhost:3000/api/unsubscribe' 
      : 'http://localhost:3000/api/subscribe'
      
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userId: store.currentUser.id })
    })
    
    const data = await res.json()
    
    if (res.ok) {
      isSubscribed.value = !isSubscribed.value
      message.value = data.message
      messageType.value = 'success'
    } else {
      message.value = data.error
      messageType.value = 'error'
    }
  } catch (e) {
    message.value = 'Ошибка соединения с сервером'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.site-footer {
  background-color: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 4rem 2rem 2rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr; /* Добавлена колонка для подписки */
  gap: 2rem;
}

/* Бренд */
.brand-col .footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 1.25rem;
}

.footer-logo-img { width: 36px; height: 36px; object-fit: contain; }
.footer-logo-text { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; text-transform: uppercase; }
.footer-desc { color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.9rem; max-width: 300px; }

/* Соцсети */
.social-links { display: flex; gap: 1rem; }
.social-link {
  width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;
}
.social-link svg { width: 20px; height: 20px; position: relative; z-index: 2; }
.social-link.telegram { background: linear-gradient(135deg, #2AABEE 0%, #229ED9 100%); }
.social-link.vk { background: linear-gradient(135deg, #0077FF 0%, #0055CC 100%); }
.social-link.youtube { background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%); }
.social-link:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
.social-link.telegram:hover { box-shadow: 0 8px 20px rgba(42, 171, 238, 0.4); }
.social-link.vk:hover { box-shadow: 0 8px 20px rgba(0, 119, 255, 0.4); }
.social-link.youtube:hover { box-shadow: 0 8px 20px rgba(255, 0, 0, 0.4); }

/* Заголовки колонок */
h4 { font-size: 0.85rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.08em; }
ul { list-style: none; padding: 0; margin: 0; }
ul li { margin-bottom: 0.75rem; }
ul li a { color: var(--text-secondary); text-decoration: none; transition: color 0.2s; font-size: 0.9rem; }
ul li a:hover { color: var(--primary); }
address { font-style: normal; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.8; }

/* 👇 СТИЛИ ДЛЯ ПОДПИСКИ */
.subscribe-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-wrapper {
  display: flex;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.subscribe-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
}

.btn-subscribe {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-subscribe:hover:not(:disabled) { opacity: 0.9; }
.btn-subscribe:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-subscribe {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-email {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.user-email strong {
  color: var(--text-primary);
}

.btn-auth-action {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-align: center;
}

.btn-auth-action.subscribe {
  background: var(--primary);
  color: white;
}

.btn-auth-action.subscribe:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-auth-action.unsubscribe {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.btn-auth-action.unsubscribe:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.btn-auth-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.subscribe-msg {
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
}

.subscribe-msg.success { color: #10b981; }
.subscribe-msg.error { color: #ef4444; }

.footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

@media (max-width: 1100px) {
  .footer-container { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .brand-col { grid-column: span 2; }
  .subscribe-col { grid-column: span 2; }
}

@media (max-width: 600px) {
  .footer-container { grid-template-columns: 1fr; }
  .brand-col, .subscribe-col { grid-column: span 1; }
  .site-footer { padding: 2rem 1.5rem; }
}
</style>