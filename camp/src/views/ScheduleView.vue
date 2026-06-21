<template>
  <div class="schedule-page">
    <h2 class="section-title">Расписание занятий</h2>

    <!-- Панель фильтров: Дата, Курс, Группа -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>Дата</label>
        <input type="date" v-model="selectedDate" class="form-input" />
      </div>
      
      <!-- Фильтр по курсам -->
      <div class="filter-group">
        <label>Курс</label>
        <select v-model="selectedCourse" class="form-select">
          <option value="all">Все курсы</option>
          <option value="1">1 курс</option>
          <option value="2">2 курс</option>
          <option value="3">3 курс</option>
          <option value="4">4 курс</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Группа</label>
        <select v-model="selectedGroup" class="form-select">
          <option value="all">Все группы</option>
          <option v-for="group in availableGroups" :key="group" :value="group">
            {{ group }}
          </option>
        </select>
      </div>
    </div>

    <!-- Единая таблица расписания (стиль РЭУ) -->
    <div class="table-wrapper">
      <table class="university-schedule-table">
        <thead>
          <tr>
            <th style="width: 100px;">День</th>
            <th style="width: 100px;">Время</th>
            <th style="width: 80px;">Курс</th>
            <th>Дисциплина / Преподаватель</th>
            <th style="width: 120px;">Аудитория</th>
            <th style="width: 120px;">Группа</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(dayLessons, index) in filteredWeekDays" :key="dayLessons.code">
            <!-- Разделитель дней недели (показывается только если есть занятия) -->
            <tr v-if="dayLessons.lessons.length > 0" class="day-separator-row">
              <td colspan="6" class="day-separator-cell">
                {{ dayLessons.name }}
                <span v-if="isToday(dayLessons.code)" class="today-badge">(Сегодня)</span>
              </td>
            </tr>

            <!-- Строки с парами -->
            <tr 
              v-for="item in dayLessons.lessons" 
              :key="item.id"
              class="lesson-row"
              :class="{ 'is-today': isToday(item.day) }"
            >
              <td class="cell-day"></td>
              <td class="cell-time">{{ item.time }}</td>
              
              <!-- Ячейка с номером курса -->
              <td class="cell-course">
                <span class="course-badge">{{ item.course }}</span>
              </td>
              
              <td class="cell-subject">
                <strong>{{ item.title }}</strong>
                <span class="teacher-name">{{ item.teacher }}</span>
              </td>
              <td class="cell-room">{{ item.room }}</td>
              <td class="cell-group">
                <span class="group-badge">{{ item.group }}</span>
              </td>
            </tr>
          </template>

          <!-- Если ничего не найдено -->
          <tr v-if="totalFilteredLessons === 0">
            <td colspan="6" class="empty-state">
              На выбранную дату или группу занятий не найдено
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()

// Инициализация значений из localStorage или установка дефолтных
const selectedDate = ref(localStorage.getItem('schedule_date') || new Date().toISOString().split('T')[0])
const selectedCourse = ref(localStorage.getItem('schedule_course') || 'all')
const selectedGroup = ref(localStorage.getItem('schedule_group') || 'all')

// Сохранение изменений в localStorage при каждом изменении фильтра
watch(selectedDate, (val) => localStorage.setItem('schedule_date', val))
watch(selectedCourse, (val) => localStorage.setItem('schedule_course', val))
watch(selectedGroup, (val) => localStorage.setItem('schedule_group', val))

// Маппинг дней недели для сортировки
const weekDaysOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const weekDaysNames = {
  mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', 
  thu: 'Четверг', fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье'
}

// Получаем уникальные группы из БД
const availableGroups = computed(() => {
  const groups = new Set(store.content.schedule.map(item => item.group))
  return Array.from(groups).sort()
})

// Определяем день недели для выбранной даты
const selectedDayCode = computed(() => {
  if (!selectedDate.value) return null
  const date = new Date(selectedDate.value)
  const dayIndex = date.getDay() // 0 = Вс, 1 = Пн ...
  const jsToCodeMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return jsToCodeMap[dayIndex]
})

// Формируем структуру данных: группируем по дням и сортируем
const filteredWeekDays = computed(() => {
  let allLessons = store.content.schedule
  
  // 1. Фильтр по курсу
  if (selectedCourse.value !== 'all') {
    allLessons = allLessons.filter(item => String(item.course) === String(selectedCourse.value))
  }

  // 2. Фильтр по группе
  if (selectedGroup.value !== 'all') {
    allLessons = allLessons.filter(item => item.group === selectedGroup.value)
  }

  // 3. Группируем по дням недели в правильном порядке
  return weekDaysOrder.map(dayCode => ({
    code: dayCode,
    name: weekDaysNames[dayCode],
    lessons: allLessons
      .filter(item => item.day === dayCode)
      .sort((a, b) => a.time.localeCompare(b.time))
  }))
  // 👇 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Фильтруем дни по выбранной дате
  .filter(day => {
    // Если дата не выбрана или совпадает с текущим днем - показываем
    if (!selectedDayCode.value || day.code === selectedDayCode.value) return true
    return false
  })
  // Убираем пустые дни после фильтрации
  .filter(day => day.lessons.length > 0)
})

const totalFilteredLessons = computed(() => {
  return filteredWeekDays.value.reduce((acc, day) => acc + day.lessons.length, 0)
})

// Проверка, является ли день "сегодняшним" для подсветки
function isToday(dayCode) {
  const todayIndex = new Date().getDay()
  const jsToCodeMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return jsToCodeMap[todayIndex] === dayCode
}
</script>

<style scoped>
.section-title { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary); }

/* Панель фильтров */
.filters-bar {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
.form-input, .form-select { padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-primary); color: var(--text-primary); min-width: 180px; }

/* Таблица в стиле РЭУ */
.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--bg-card);
}

.university-schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.university-schedule-table th {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid var(--border);
}

/* Разделитель дней недели */
.day-separator-row td {
  background: rgba(99, 102, 241, 0.05);
  color: var(--primary);
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}

.today-badge {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
  padding: 0.1rem 0.5rem;
  border-radius: 12px;
}

/* Строки занятий */
.lesson-row { border-bottom: 1px solid var(--border); transition: background 0.2s; }
.lesson-row:hover { background: rgba(99, 102, 241, 0.03); }
.lesson-row.is-today { background: rgba(99, 102, 241, 0.08); } /* Подсветка текущего дня */
.lesson-row:last-child { border-bottom: none; }

.cell-time { 
  font-weight: 700; 
  color: var(--text-primary); 
  white-space: nowrap; 
  padding: 1rem;
}

/* Стили для ячейки курса */
.cell-course { text-align: center; padding: 1rem; }
.course-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.85rem;
  border: 1px solid var(--border);
}

.cell-subject strong { display: block; color: var(--text-primary); margin-bottom: 0.25rem; }
.teacher-name { font-size: 0.85rem; color: var(--text-secondary); }

.cell-room { color: var(--text-secondary); font-size: 0.9rem; }

.group-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--border);
}

.empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); font-style: italic; }

@media (max-width: 768px) {
  .filters-bar { flex-direction: column; gap: 1rem; }
  .form-input, .form-select { width: 100%; min-width: auto; }
  .university-schedule-table { font-size: 0.85rem; }
  /* На мобильных можно скрыть менее важные колонки */
  .cell-course, .university-schedule-table th:nth-child(3) { display: none; } 
  .cell-subject strong { font-size: 0.9rem; }
}
</style>