<template>
  <div class="not-found-modern" @mousemove="handleMouseMove">
    <!-- Фоновая сетка -->
    <div class="grid-bg"></div>
    
    <div class="content-wrapper">
      <div class="text-block">
        <div class="error-badge">Ошибка маршрутизации</div>
        <h1 class="error-code">404</h1>
        <h2 class="title">Страница не найдена</h2>
        <p class="description">
          Запрашиваемый ресурс отсутствует в текущем пространстве имен.<br>
          Возможно, ссылка устарела или была введена с ошибкой.
        </p>
        
        <div class="actions">
          <RouterLink to="/" class="btn-primary">
            Вернуться на главную
          </RouterLink>
          
          <button @click="$router.back()" class="btn-ghost">
            ← Назад
          </button>
        </div>
      </div>

      <!-- Живая абстрактная визуализация -->
      <div class="visual-art">
        <div class="orbit orbit-1">
          <div class="node node-a"></div>
        </div>
        <div class="orbit orbit-2">
          <div class="node node-b"></div>
        </div>
        <div class="orbit orbit-3">
          <div class="node node-c"></div>
        </div>
        
        <!-- Центральное ядро -->
        <div class="core-pulse"></div>
        
        <!-- Соединительные линии (SVG) -->
        <svg class="connections" viewBox="0 0 400 400">
          <line x1="200" y1="200" x2="200" y2="80" class="conn-line line-1" />
          <line x1="200" y1="200" x2="320" y2="260" class="conn-line line-2" />
          <line x1="200" y1="200" x2="80" y2="260" class="conn-line line-3" />
        </svg>
      </div>
    </div>
    
    <div class="footer-note">
      Summer Tech Camp © 2026 • System Status: Operational
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)

// Эффект параллакса при движении мыши
const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20
  const y = (e.clientY / window.innerHeight - 0.5) * 20
  
  document.documentElement.style.setProperty('--parallax-x', `${x}px`)
  document.documentElement.style.setProperty('--parallax-y', `${y}px`)
}
</script>

<style scoped>
.not-found-modern {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

/* Сетка на фоне */
.grid-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  z-index: 0;
}

.content-wrapper {
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 6rem;
  align-items: center;
  z-index: 10;
}

.text-block { text-align: left; }

.error-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary);
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  line-height: 0.9;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 480px;
}

.actions { display: flex; gap: 1rem; align-items: center; }

.btn-primary {
  padding: 1rem 2rem;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid var(--text-primary);
}

.btn-primary:hover {
  background: transparent;
  color: var(--text-primary);
  transform: translateY(-2px);
}

.btn-ghost {
  padding: 1rem 1.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 1rem;
}

.btn-ghost:hover { color: var(--text-primary); }

/* === ЖИВАЯ АНИМАЦИЯ === */
.visual-art {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Применяем параллакс из JS */
  transform: translate(var(--parallax-x, 0), var(--parallax-y, 0));
  transition: transform 0.1s ease-out;
}

/* Орбиты */
.orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(99, 102, 241, 0.2);
}

.orbit-1 {
  width: 300px; height: 300px;
  animation: spin 20s linear infinite;
}

.orbit-2 {
  width: 220px; height: 220px;
  animation: spin-reverse 15s linear infinite;
  border-style: dotted;
  border-color: rgba(236, 72, 153, 0.2);
}

.orbit-3 {
  width: 140px; height: 140px;
  animation: spin 10s linear infinite;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

/* Узлы (точки) */
.node {
  position: absolute;
  width: 12px; height: 12px;
  border-radius: 50%;
  top: -6px; left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px currentColor;
}

.node-a { background: var(--primary); color: var(--primary); }
.node-b { background: #ec4899; color: #ec4899; width: 8px; height: 8px; top: -4px; }
.node-c { background: white; color: white; width: 6px; height: 6px; top: -3px; }

/* Центральное ядро */
.core-pulse {
  width: 16px; height: 16px;
  background: var(--primary);
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
  animation: heartbeat 2s ease-in-out infinite;
  z-index: 5;
}

/* SVG линии */
.connections {
  position: absolute;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 1;
}

.conn-line {
  stroke: var(--border);
  stroke-width: 1;
  opacity: 0.3;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw-line 3s ease-in-out infinite alternate;
}

.line-1 { animation-delay: 0s; }
.line-2 { animation-delay: 1s; stroke: rgba(236, 72, 153, 0.3); }
.line-3 { animation-delay: 2s; }

.footer-note {
  position: absolute;
  bottom: 2rem;
  font-size: 0.75rem;
  color: var(--border);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: 'Fira Code', monospace;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-reverse { to { transform: rotate(-360deg); } }

@keyframes heartbeat {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.8; }
}

@keyframes draw-line {
  0% { stroke-dashoffset: 100; opacity: 0.1; }
  100% { stroke-dashoffset: 0; opacity: 0.6; }
}

@media (max-width: 900px) {
  .content-wrapper { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
  .text-block { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .description { margin-left: auto; margin-right: auto; }
  .visual-art { height: 250px; order: -1; }
  .orbit-1 { width: 200px; height: 200px; }
  .orbit-2 { width: 140px; height: 140px; }
  .orbit-3 { width: 80px; height: 80px; }
  .error-code { font-size: 6rem; }
}
</style>