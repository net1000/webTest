<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>{{ store.homeSettings.hero_title }}</h1>
        <p>{{ store.homeSettings.hero_description }}</p>
        <div class="hero-actions">
          <RouterLink to="/register" class="btn btn-primary">Записаться сейчас →</RouterLink>
          <RouterLink to="/courses" class="btn btn-secondary">Смотреть программу</RouterLink>
        </div>
      </div>

      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">{{ store.homeSettings.stats_participants }}</span>
          <span class="stat-label">Участников</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ store.content.courses.length }}</span>
          <span class="stat-label">{{ store.homeSettings.stats_courses_label }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ store.content.teachers.length }}</span>
          <span class="stat-label">{{ store.homeSettings.stats_teachers_label }}</span>
        </div>
      </div>
    </section>

    <!-- Секция курсов -->
    <div class="section-header">
      <h2 class="section-title">{{ store.homeSettings.section_courses_title }}</h2>
      <RouterLink to="/courses" class="btn btn-outline">Смотреть все →</RouterLink>
    </div>

    <div class="cards-grid">
      <CourseCard v-for="course in store.content.courses.filter(c => c.is_featured)" :key="course.id"
        :title="course.title" :description="course.description" :level="course.level" :duration="course.duration"
        :icon="course.icon" link="/courses" />
      <div v-if="store.content.courses.filter(c => c.is_featured).length === 0" class="empty-home-msg">
        Администратор еще не выбрал курсы для главной страницы.
      </div>
    </div>

    <!-- 👇 СЕКЦИЯ МЕНТОРОВ (ИСПРАВЛЕНО: filter вместо slice) -->
    <div class="section-header" style="margin-top: 4rem;">
      <h2 class="section-title">{{ store.homeSettings.section_teachers_title }}</h2>
      <RouterLink to="/teachers" class="btn btn-outline">Все преподаватели →</RouterLink>
    </div>

    <div class="teachers-grid">
      <div v-for="teacher in store.content.teachers.filter(t => t.is_featured)" :key="teacher.id" class="teacher-card">
        <div class="teacher-avatar">
          <img v-if="teacher.photo_url" :src="store.getImageUrl(teacher.photo_url)" :alt="teacher.name"
            class="real-photo" @error="handleImageError" />
          <div v-else class="initials-fallback">
            {{ getInitials(teacher.name) }}
          </div>
        </div>
        <h3>{{ teacher.name }}</h3>
        <p class="specialization">{{ teacher.specialization }}</p>
      </div>
      <div v-if="store.content.teachers.filter(t => t.is_featured).length === 0" class="empty-home-msg">
        Администратор еще не выбрал менторов для главной страницы.
      </div>
    </div>

    <!-- Секция событий -->
    <div class="section-header" style="margin-top: 4rem;">
      <h2 class="section-title">{{ store.homeSettings.section_events_title }}</h2>
      <RouterLink to="/events" class="btn btn-outline">Календарь →</RouterLink>
    </div>

    <div class="events-list">
      <div v-for="event in store.content.events.filter(e => e.is_featured)" :key="event.id" class="event-item">
        <div class="event-date">{{ event.date }}</div>
        <div class="event-info">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
        </div>
        <div class="event-icon">{{ event.icon }}</div>
      </div>
      <div v-if="store.content.events.filter(e => e.is_featured).length === 0" class="empty-home-msg">
        Администратор еще не выбрал события для главной страницы.
      </div>
    </div>

    <!-- Секция галереи -->
    <div class="section-header" style="margin-top: 4rem;">
      <h2 class="section-title">{{ store.homeSettings.section_gallery_title }}</h2>
      <RouterLink to="/gallery" class="btn btn-outline">Полная галерея →</RouterLink>
    </div>

    <div class="gallery-preview">
      <div v-for="item in store.content.gallery.filter(g => g.is_featured)" :key="item.id" class="preview-img">
        <img :src="getImageUrl(item.url)" :alt="item.caption" loading="lazy">
      </div>
      <div v-if="store.content.gallery.filter(g => g.is_featured).length === 0" class="empty-home-msg">
        Администратор еще не выбрал фото для главной страницы.
      </div>
    </div>
  </div>
</template>

<script setup>
import CourseCard from '../components/CourseCard.vue'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `http://localhost:3000${url}`;
  return url;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const handleImageError = (e) => {
  e.target.style.display = 'none';
  e.target.nextElementSibling.style.display = 'flex';
};
</script>

<style scoped>
/* Стили остаются прежними */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  font-size: 1rem;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 30px -5px rgba(99, 102, 241, 0.5);
  filter: brightness(1.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
}

.btn-outline:hover {
  background: var(--bg-card);
  color: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: var(--radius-lg);
  padding: 4rem 3rem;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.3);
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

.hero-content {
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  display: block;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.teacher-card {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  transition: transform 0.2s;
}

.teacher-card:hover {
  transform: translateY(-5px);
}

.teacher-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.real-photo+.initials-fallback {
  display: none;
}

.specialization {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s;
}

.event-item:hover {
  border-color: var(--primary);
}

.event-date {
  font-weight: 700;
  color: var(--primary);
  min-width: 80px;
  text-align: center;
}

.event-info {
  flex: 1;
}

.event-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.event-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.event-icon {
  font-size: 2rem;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.preview-img {
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
}

.preview-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.preview-img:hover img {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1.5rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .gallery-preview {
    grid-template-columns: repeat(2, 1fr);
  }

  .event-item {
    flex-direction: column;
    text-align: center;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

/* Стиль для пустого состояния */
.empty-home-msg {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border);
}
</style>