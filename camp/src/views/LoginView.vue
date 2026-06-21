<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">Вход в систему</h2>
      <p class="login-subtitle">Введите учетные данные для доступа</p>

      <form @submit.prevent="handleLogin" class="login-form" action="#" method="post">
        <div class="form-group">
          <label for="username" class="form-label">Логин или Email</label>
          <input id="username" v-model="username" type="text" name="username" required autofocus
            placeholder="admin или ваш email" class="form-input" autocomplete="username">
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input id="password" v-model="password" type="password" name="password" required placeholder="••••••••"
            class="form-input" autocomplete="current-password">
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
          {{ loading ? 'Проверка...' : 'Войти' }}
        </button>
      </form>

      <div class="auth-switch">
        Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await store.login(username.value, password.value)
    router.push(store.isAdmin ? '/admin' : '/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
}

.login-card {
  background: var(--bg-card);
  padding: 3.5rem 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--border);
  animation: fadeIn 0.4s ease-out;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-top: -0.5rem;
  animation: shake 0.3s ease-in-out;
}

.auth-switch {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.auth-switch a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 2.5rem 2rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>