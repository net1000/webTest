<template>
    <div class="card course-card" @click="$router.push(link)">
        <div class="card-icon">{{ icon }}</div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <div class="card-meta">
            <span class="badge badge-primary">{{ getLevelText(level) }}</span>
            <span>⏱ {{ duration }}</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    description: String,
    level: String,
    duration: String,
    icon: String,
    link: { type: String, default: '/courses' }
})

const getLevelText = (lvl) => {
    const levels = { beginner: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый' }
    return levels[lvl] || lvl
}
</script>

<style scoped>
.course-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 2rem;
    border: 1px solid var(--border);
    transition: var(--transition);
    cursor: pointer;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary);
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

.course-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
}

.course-card p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.card-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge-primary {
    background: rgba(99, 102, 241, 0.1);
    color: var(--primary);
}
</style>