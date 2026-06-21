<template>
  <div class="teachers-page">
    <!-- Убран эмодзи для строгого стиля -->
    <h2 class="section-title">Наши преподаватели</h2>
    
    <div class="teachers-grid">
      <div v-for="teacher in store.content.teachers" :key="teacher.id" class="teacher-card">
        <div class="teacher-avatar">
          <!-- Используем store.getImageUrl для правильного пути к файлу -->
          <img 
            v-if="teacher.photo_url" 
            :src="store.getImageUrl(teacher.photo_url)" 
            :alt="teacher.name"
            class="real-photo"
            @error="handleImageError"
          />
          <!-- Заглушка с инициалами, если фото нет или оно не загрузилось -->
          <div v-else class="initials-fallback">
            {{ getInitials(teacher.name) }}
          </div>
        </div>
        
        <h3>{{ teacher.name }}</h3>
        <p class="specialization">{{ teacher.specialization }}</p>
        <p class="experience">Опыт: {{ teacher.experience }}</p>
        <p class="bio">{{ teacher.bio }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()

function getInitials(name) {
  if (!name) return '?';
  // Берем первые буквы слов и объединяем их
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Обработчик ошибки загрузки картинки (показываем заглушку)
const handleImageError = (e) => {
  e.target.style.display = 'none';
  e.target.nextElementSibling.style.display = 'flex';
};
</script>

<style scoped>
.section-title { 
  font-size: 2rem; 
  font-weight: 700; 
  margin-bottom: 2rem; 
  color: var(--text-primary); 
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.teacher-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.teacher-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.teacher-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--border);
  position: relative;
}

.real-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.initials-fallback {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Скрываем заглушку, если есть фото */
.real-photo + .initials-fallback {
  display: none;
}

.teacher-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.specialization {
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.experience {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.bio {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>