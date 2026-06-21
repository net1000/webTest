<template>
  <AppHeader />
  <main class="main-content">
    <!-- Показываем лоадер, пока данные грузятся -->
    <div v-if="store.isLoading" class="loading-screen">
      <div class="spinner"></div>
      <p>Загрузка контента из базы данных...</p>
    </div>
    <RouterView v-else />
  </main>
  <AppFooter /> <!-- 👇 Добавлено -->
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue' // 👇 Импортировано
import { useSiteContentStore } from './stores/siteContent'
import { onMounted } from 'vue'

const store = useSiteContentStore()

// Загружаем данные с сервера сразу при запуске
onMounted(() => {
  store.fetchAllData()
})
</script>

<style>
body { margin: 0; padding: 0; }

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  gap: 1rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>