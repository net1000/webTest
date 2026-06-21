<template>
  <div class="teacher-card" @click="$router.push('/teachers')">
    <div class="teacher-avatar">
      <!-- 👇 ПОКАЗЫВАЕМ ФОТО ИЛИ ИНИЦИАЛЫ -->
      <img 
        v-if="photo_url" 
        :src="getImageUrl(photo_url)" 
        :alt="name"
        class="real-photo"
        @error="handleImageError"
      />
      <div v-else class="initials-fallback">
        {{ getInitials(name) }}
      </div>
    </div>
    
    <div class="teacher-info">
      <h3>{{ name }}</h3>
      <div class="teacher-role">{{ specialization }}</div>
      <p class="teacher-bio">{{ bio }}</p>
      <p class="teacher-experience">Опыт: {{ experience }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ 
  name: String, 
  specialization: String, 
  experience: String, 
  bio: String, 
  photo_url: String // 👇 ЗАМЕНИЛИ emoji НА photo_url
})

// Функция для получения полных URL картинок
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `http://localhost:3000${url}`
  return url
}

// Получение инициалов
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Обработка ошибки загрузки фото
const handleImageError = (e) => {
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex'
}
</script>

<style scoped>
.teacher-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: var(--transition);
  cursor: pointer;
  text-align: center; /* 👈 Центрируем содержимое */
}

.teacher-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.teacher-avatar {
  width: 100%;
  height: 280px;
  background: var(--bg-secondary); /* 👈 Убрали градиент, чтобы не мешал фото */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  position: relative;
}

.real-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.initials-fallback {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.real-photo + .initials-fallback {
  display: none;
}

.teacher-info {
  padding: 1.5rem;
}

.teacher-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.teacher-role {
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.teacher-bio {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.teacher-experience {
  color: var(--text-secondary);
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>