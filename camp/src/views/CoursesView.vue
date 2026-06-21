<template>
  <div class="courses-page">
    <!-- Убран эмодзи для строгого стиля -->
    <h2 class="section-title">Наши курсы</h2>
    
    <div class="cards-grid">
      <CourseCard 
        v-for="course in store.content.courses" 
        :key="course.id" 
        :title="course.title"
        :description="course.description" 
        :level="course.level" 
        :duration="course.duration"
        :icon="course.icon"
        link="/courses"
      />
    </div>
  </div>
</template>

<script setup>
import CourseCard from '../components/CourseCard.vue'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
</style>