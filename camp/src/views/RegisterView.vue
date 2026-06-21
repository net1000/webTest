<template>
  <div class="register-page">
    <div class="register-card">
      <h2 class="register-title">Создать аккаунт</h2>
      <p class="register-subtitle">Присоединяйтесь к платформе IT-образования</p>

      <form @submit.prevent="handleRegister" class="register-form" action="#" method="post">
        <div class="form-group">
          <label for="reg-username" class="form-label">Имя пользователя</label>
          <input id="reg-username" v-model="username" type="text" name="username" required placeholder="ivan_dev"
            class="form-input" autocomplete="username">
        </div>

        <div class="form-group">
          <label for="reg-email" class="form-label">Email</label>
          <input id="reg-email" v-model="email" type="email" name="email" required placeholder="example@mail.ru"
            class="form-input" autocomplete="email">
        </div>

        <div class="form-group">
          <label for="reg-password" class="form-label">Пароль</label>
          <input id="reg-password" v-model="password" type="password" name="password" required minlength="6"
            placeholder="Минимум 6 символов" class="form-input" autocomplete="new-password">
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
          {{ loading ? 'Создание...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="auth-switch">
        Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
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
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    await store.register(username.value, email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
}

.register-card {
  background: var(--bg-card);
  padding: 3.5rem 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--border);
  animation: fadeIn 0.4s ease-out;
}

.register-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -0.02em;
}

.register-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2.5rem;
}

.register-form {
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
  .register-card {
    padding: 2.5rem 2rem;
  }

  .register-title {
    font-size: 1.5rem;
  }
}
</style>