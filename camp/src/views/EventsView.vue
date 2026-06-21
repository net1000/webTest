<template>
  <div class="events-page">
    <!-- Убран эмодзи для строгого стиля -->
    <h2 class="section-title">Мероприятия</h2>
    
    <div class="cards-grid">
      <div v-for="event in store.content.events" :key="event.id" class="card event-card">
        <div class="card-icon">{{ event.icon }}</div>
        <h3>{{ event.title }}</h3>
        <p>{{ event.description }}</p>
        <div class="card-meta">
          <!-- Убран эмодзи календаря -->
          <span>{{ event.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

.event-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border);
  transition: var(--transition);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.event-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.event-card p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.card-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>