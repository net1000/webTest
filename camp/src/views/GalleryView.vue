<template>
  <div class="gallery-page">
    <!-- Убран эмодзи для строгого стиля -->
    <h2 class="section-title">Галерея</h2>
    
    <!-- Фильтры -->
    <div class="filters">
      <button 
        v-for="cat in categories" 
        :key="cat.code"
        :class="['filter-btn', { active: activeFilter === cat.code }]"
        @click="activeFilter = cat.code"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Сетка фото -->
    <div class="gallery-grid">
      <div 
        v-for="item in filteredGallery" 
        :key="item.id" 
        class="gallery-item"
        @click="openLightbox(item)"
      >
        <img :src="store.getImageUrl(item.url)" :alt="item.caption" loading="lazy">
        <div class="overlay">
          <p>{{ item.caption }}</p>
          <span class="tag">{{ getCategoryName(item.category) }}</span>
        </div>
      </div>
    </div>

    <!-- Lightbox (просмотр фото) -->
    <div v-if="lightboxItem" class="lightbox" @click.self="closeLightbox">
      <button class="close-btn" @click="closeLightbox">×</button>
      <img :src="store.getImageUrl(lightboxItem.url)" :alt="lightboxItem.caption">
      <div class="lightbox-info">
        <h3>{{ lightboxItem.caption }}</h3>
        <p>{{ getCategoryName(lightboxItem.category) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()
const activeFilter = ref('all')
const lightboxItem = ref(null)

// Единый список категорий для фильтров
const categories = [
  { code: 'all', name: 'Все' },
  { code: 'hackathon', name: 'Хакатоны' },
  { code: 'workshop', name: 'Мастер-классы' },
  { code: 'lecture', name: 'Лекции' },
  { code: 'project', name: 'Проекты' }
]

// Фильтрация элементов
const filteredGallery = computed(() => {
  if (activeFilter.value === 'all') return store.content.gallery;
  return store.content.gallery.filter(item => item.category === activeFilter.value);
})

// Преобразование кода категории в название
function getCategoryName(code) {
  const map = {
    hackathon: 'Хакатоны',
    workshop: 'Мастер-классы',
    lecture: 'Лекции',
    project: 'Проекты'
  };
  return map[code] || code;
}

function openLightbox(item) {
  lightboxItem.value = item;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxItem.value = null;
  document.body.style.overflow = '';
}
</script>

<style scoped>
.section-title { 
  font-size: 2rem; 
  font-weight: 700; 
  margin-bottom: 2rem; 
  color: var(--text-primary); 
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.filter-btn:hover { border-color: var(--primary); color: var(--primary); }
.filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-item:hover img { transform: scale(1.05); }

.overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 2rem 1.5rem 1.5rem;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover .overlay { opacity: 1; }

.tag {
  display: inline-block;
  background: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

/* Lightbox styles */
.lightbox {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox img {
  max-width: 90%;
  max-height: 80vh;
  border-radius: var(--radius);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.close-btn {
  position: absolute;
  top: 2rem; right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
}

.lightbox-info {
  position: absolute;
  bottom: 2rem;
  text-align: center;
  color: white;
}
</style>