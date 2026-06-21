<template>
  <header class="header">
    <div class="header-content">
      <!-- Логотип -->
      <RouterLink to="/" class="logo">
        <img src="@/assets/logo-modern.svg" alt="Summer Tech Camp" class="logo-img" />
        <div class="logo-text">
          <span class="logo-title">SUMMER TECH CAMP</span>
          <span class="logo-subtitle">ПЛАТФОРМА IT-ОБРАЗОВАНИЯ</span>
        </div>
      </RouterLink>

      <!-- Навигация -->
      <nav class="nav-desktop">
        <RouterLink to="/" class="nav-link" active-class="active">Главная</RouterLink>
        <RouterLink to="/courses" class="nav-link" active-class="active">Курсы</RouterLink>
        <RouterLink to="/schedule" class="nav-link" active-class="active">Расписание</RouterLink>
        <RouterLink to="/teachers" class="nav-link" active-class="active">Преподаватели</RouterLink>
        <RouterLink to="/gallery" class="nav-link" active-class="active">Галерея</RouterLink>
        <RouterLink to="/events" class="nav-link" active-class="active">Мероприятия</RouterLink>
        <RouterLink to="/register" class="nav-link" active-class="active">Регистрация</RouterLink>
      </nav>

      <!-- Правая часть: Тема + Профиль -->
      <div class="header-actions">
        <button class="btn btn-secondary btn-icon theme-toggle" @click="toggleTheme"
          :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <!-- 👇 ЕСЛИ НЕ АВТОРИЗОВАН: Кнопка входа -->
        <RouterLink v-if="!store.isAuth" to="/login" class="profile-circle guest" title="Войти в аккаунт">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               class="guest-icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </RouterLink>

        <!-- 👇 ЕСЛИ АВТОРИЗОВАН (ЛЮБОЙ ПОЛЬЗОВАТЕЛЬ): Аватар и меню -->
        <div v-else class="profile-wrapper">
          <button class="profile-circle" @click="toggleMenu" title="Меню профиля">
            <span class="profile-initials">{{ store.currentUser?.username?.charAt(0).toUpperCase() || 'U' }}</span>
          </button>

          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="dropdown-header">
              <strong>{{ store.currentUser?.username }}</strong>
              <small>{{ store.currentUser?.email }}</small>
            </div>
            <div class="dropdown-divider"></div>
            
            <!-- Ссылка на админку ТОЛЬКО ДЛЯ АДМИНОВ -->
            <RouterLink v-if="store.isAdmin" to="/admin" class="dropdown-item" @click="isMenuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Панель управления
            </RouterLink>

            <!-- 👇 КНОПКА СМЕНЫ ПАРОЛЯ -->
            <button class="dropdown-item" @click="openPasswordModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Сменить пароль
            </button>
            
            <!-- Кнопка выхода -->
            <button class="dropdown-item danger" @click="handleLogout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Выйти из системы
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- 👇 МОДАЛЬНОЕ ОКНО СМЕНЫ ПАРОЛЯ -->
  <Teleport to="body">
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Смена пароля</h3>
          <button class="modal-close" @click="closePasswordModal">✕</button>
        </div>
        
        <form @submit.prevent="handleChangePassword" class="modal-form">
          <div class="form-group">
            <label>Текущий пароль</label>
            <input v-model="passwordForm.oldPassword" type="password" required class="form-input" placeholder="••••••••" />
          </div>
          
          <div class="form-group">
            <label>Новый пароль</label>
            <input v-model="passwordForm.newPassword" type="password" required minlength="6" class="form-input" placeholder="Минимум 6 символов" />
          </div>
          
          <div class="form-group">
            <label>Подтвердите новый пароль</label>
            <input v-model="passwordForm.confirmPassword" type="password" required class="form-input" placeholder="••••••••" />
          </div>

          <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="success-text">{{ passwordSuccess }}</p>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closePasswordModal">Отмена</button>
            <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
              {{ passwordLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSiteContentStore } from '../stores/siteContent'

const router = useRouter()
const store = useSiteContentStore()
const isDark = ref(false)
const isMenuOpen = ref(false)

// Состояние для модального окна пароля
const showPasswordModal = ref(false)
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  isDark.value = dark
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}
const toggleTheme = () => applyTheme(!isDark.value)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) applyTheme(true)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleMenu = (e) => {
  e.stopPropagation()
  isMenuOpen.value = !isMenuOpen.value
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.profile-wrapper')) {
    isMenuOpen.value = false
  }
}

const handleLogout = () => {
  store.logout()
  isMenuOpen.value = false
  router.push('/')
}

// Логика смены пароля
const openPasswordModal = () => {
  showPasswordModal.value = true
  isMenuOpen.value = false
  passwordError.value = ''
  passwordSuccess.value = ''
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
}

async function handleChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Новые пароли не совпадают'
    return
  }

  passwordLoading.value = true
  try {
    await store.changePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword)
    passwordSuccess.value = 'Пароль успешно изменен!'
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    
    setTimeout(() => {
      closePasswordModal()
    }, 1500)
  } catch (e) {
    passwordError.value = e.message
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>
/* ... Все предыдущие стили остаются без изменений ... */
.header-actions { display: flex; gap: 0.75rem; align-items: center; }
.logo { display: flex; align-items: center; gap: 0.875rem; text-decoration: none; color: inherit; transition: opacity 0.2s ease; }
.logo:hover { opacity: 0.85; }
.logo-img { width: 42px; height: 42px; object-fit: contain; }
.logo-text { display: flex; flex-direction: column; line-height: 1.1; }
.logo-title { font-weight: 800; font-size: 1.05rem; color: var(--text-primary); letter-spacing: -0.02em; text-transform: uppercase; }
.logo-subtitle { font-size: 0.6rem; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 3px; opacity: 0.9; }
.profile-wrapper { position: relative; }
.profile-circle { width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--border); background: var(--bg-card); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; font-weight: 700; color: var(--text-primary); overflow: hidden; }
.profile-circle:hover { border-color: var(--primary); transform: scale(1.05); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15); }
.profile-initials { font-size: 1.1rem; color: var(--primary); }
.guest-icon { color: var(--primary); transition: transform 0.2s ease; }
.profile-circle.guest { text-decoration: none; background: rgba(99, 102, 241, 0.1); border-color: transparent; }
.profile-circle.guest:hover .guest-icon { transform: scale(1.1); }
.profile-circle.guest:hover { background: rgba(99, 102, 241, 0.2); }
.dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; width: 220px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); z-index: 1001; animation: slideDown 0.2s ease-out; overflow: hidden; }
.dropdown-header { padding: 1rem; text-align: center; }
.dropdown-header strong { display: block; color: var(--text-primary); font-size: 0.95rem; }
.dropdown-header small { color: var(--text-secondary); font-size: 0.75rem; }
.dropdown-divider { height: 1px; background: var(--border); margin: 0.25rem 0; }
.dropdown-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; color: var(--text-primary); text-decoration: none; font-size: 0.9rem; transition: background 0.2s; width: 100%; border: none; background: transparent; cursor: pointer; text-align: left; }
.dropdown-item:hover { background: var(--bg-secondary); }
.dropdown-item.danger { color: #ef4444; }
.dropdown-item.danger:hover { background: #fef2f2; }
.theme-toggle { width: 42px; height: 42px; border-radius: 50%; padding: 0; justify-content: center; display: flex; align-items: center; }
.theme-toggle svg { stroke: currentColor; transition: transform 0.3s ease; }
.theme-toggle:hover svg { transform: rotate(15deg); }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 1024px) { .nav-desktop { display: none; } }

/* 👇 СТИЛИ ДЛЯ МОДАЛЬНОГО ОКНА */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

.success-text {
  color: #10b981;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover:not(:disabled) { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: var(--bg-secondary); color: var(--text-primary); }
.btn-secondary:hover { background: var(--border); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>