<template>
  <div class="admin-page">
    <h2 class="section-title">Панель администратора</h2>

    <div class="admin-tabs">
      <!-- 👇 ВКЛАДКА ГЛАВНАЯ СТРАНИЦА -->
      <button v-for="tab in tabs" :key="tab.key" :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="switchTab(tab.key)">
        <svg v-if="tab.key === 'home'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <svg v-else-if="tab.key === 'courses'" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <svg v-else-if="tab.key === 'teachers'" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <svg v-else-if="tab.key === 'schedule'" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <svg v-else-if="tab.key === 'events'" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
          </polygon>
        </svg>
        <svg v-else-if="tab.key === 'gallery'" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <svg v-else-if="tab.key === 'registrations'" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>

        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="tab-content">
      <div class="admin-header">
        <h3>Управление: {{ currentTabLabel }}</h3>
        <button v-if="activeTab !== 'home'" class="btn btn-primary" @click="openAddForm">
          + Добавить элемент
        </button>
      </div>

      <!-- 👇 ФОРМА РЕДАКТИРОВАНИЯ ГЛАВНОЙ СТРАНИЦЫ -->
      <div v-if="activeTab === 'home'" class="add-form">
        <div class="form-group">
          <label>Заголовок Hero-секции</label>
          <input v-model="homeForm.hero_title" class="form-input" />
        </div>
        <div class="form-group">
          <label>Описание Hero-секции</label>
          <textarea v-model="homeForm.hero_description" class="form-input" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Количество участников (текст)</label>
          <input v-model="homeForm.stats_participants" class="form-input" />
        </div>
        <div class="form-group">
          <label>Подпись к количеству курсов</label>
          <input v-model="homeForm.stats_courses_label" class="form-input" />
        </div>
        <div class="form-group">
          <label>Подпись к количеству преподавателей</label>
          <input v-model="homeForm.stats_teachers_label" class="form-input" />
        </div>
        <div class="form-group">
          <label>Заголовок секции "Курсы"</label>
          <input v-model="homeForm.section_courses_title" class="form-input" />
        </div>
        <div class="form-group">
          <label>Заголовок секции "Преподаватели"</label>
          <input v-model="homeForm.section_teachers_title" class="form-input" />
        </div>
        <div class="form-group">
          <label>Заголовок секции "События"</label>
          <input v-model="homeForm.section_events_title" class="form-input" />
        </div>
        <div class="form-group">
          <label>Заголовок секции "Галерея"</label>
          <input v-model="homeForm.section_gallery_title" class="form-input" />
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="saveHomeSettings">Сохранить изменения</button>
        </div>
      </div>

      <!-- Форма добавления / Редактирования для остальных вкладок -->
      <div v-else-if="showForm" class="add-form">
        <div class="form-header">
          <h4>{{ isEditing ? 'Редактирование записи' : 'Добавление элемента' }}</h4>
          <button class="btn-close" @click="closeForm">✕</button>
        </div>

        <div v-for="(value, key) in formItem" :key="key" class="form-group">

          <!-- Скрываем ID при редактировании -->
          <div v-if="key === 'id'" style="display: none;"></div>

          <!-- 👇 ЧЕКБОКС ДЛЯ КУРСОВ И ГАЛЕРЕИ -->
          <div v-else-if="(activeTab === 'courses' || activeTab === 'gallery') && key === 'is_featured'"
            class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formItem[key]" />
              <span>Показывать на главной странице</span>
            </label>
          </div>

          <!-- 👇 ЧЕКБОКС ДЛЯ ПРЕПОДАВАТЕЛЕЙ И СОБЫТИЙ (ИСПРАВЛЕНО) -->
          <div v-else-if="(activeTab === 'teachers' || activeTab === 'events') && key === 'is_featured'"
            class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formItem[key]" />
              <span>Показывать на главной странице</span>
            </label>
          </div>

          <label v-else>{{ formatLabel(key) }}</label>

          <input v-if="activeTab === 'gallery' && key === 'url'" type="file" accept="image/*" @change="handleFileUpload"
            class="form-input" />

          <div v-else-if="activeTab === 'teachers' && key === 'photo_url'" class="file-upload-wrapper">
            <label class="btn btn-secondary upload-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Выбрать фото
              <input type="file" accept="image/*" hidden @change="handleTeacherPhotoSelect($event)">
            </label>
            <span v-if="isFile(formItem.photo_url)" class="file-name">{{ formItem.photo_url.name }}</span>
            <span v-else-if="typeof formItem.photo_url === 'string'" class="file-name">Фото загружено</span>
          </div>

          <div v-else-if="activeTab === 'schedule' && key === 'group'" class="input-with-datalist">
            <input v-model="formItem[key]" class="form-input" list="existing-groups"
              placeholder="Выберите или введите новую группу" autocomplete="off" />
            <datalist id="existing-groups">
              <option v-for="g in store.groups" :key="g" :value="g" />
            </datalist>
            <small class="hint">Можно выбрать из списка или ввести название новой группы</small>
          </div>

          <select v-else-if="activeTab === 'schedule' && key === 'course'" v-model="formItem[key]" class="form-select">
            <option value="1">1 курс</option>
            <option value="2">2 курс</option>
            <option value="3">3 курс</option>
            <option value="4">4 курс</option>
          </select>

          <select v-else-if="activeTab === 'schedule' && key === 'day'" v-model="formItem[key]" class="form-select">
            <option value="mon">Понедельник</option>
            <option value="tue">Вторник</option>
            <option value="wed">Среда</option>
            <option value="thu">Четверг</option>
            <option value="fri">Пятница</option>
            <option value="sat">Суббота</option>
            <option value="sun">Воскресенье</option>
          </select>

          <input v-else-if="key !== 'level' && key !== 'status'" v-model="formItem[key]" class="form-input"
            :placeholder="formatLabel(key)" />

          <select v-else-if="key === 'level'" v-model="formItem[key]" class="form-select">
            <option value="beginner">Начальный</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>

          <select v-else-if="key === 'status'" v-model="formItem[key]" class="form-select">
            <option value="Новая">Новая</option>
            <option value="Обработана">Обработана</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn btn-secondary" @click="closeForm">Отмена</button>
          <button class="btn btn-primary" @click="handleSave">{{ isEditing ? 'Сохранить изменения' : 'Создать'
            }}</button>
        </div>
      </div>

      <!-- Таблица данных (скрываем для вкладки Home) -->
      <table v-if="activeTab !== 'home'" class="admin-table">
        <thead>
          <tr>
            <th v-for="col in visibleColumns" :key="col">{{ formatLabel(col) }}</th>
            <th style="width: 160px;">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in currentItems" :key="item.id">
            <td v-for="col in visibleColumns" :key="col">
              <img v-if="col === 'photo_url' && item.photo_url" :src="store.getImageUrl(item.photo_url)"
                class="thumb-img" />
              <span v-else-if="col === 'icon' || col === 'emoji'">{{ item[col] }}</span>
              <span v-else-if="col === 'level'" class="badge badge-primary">{{ getLevelText(item[col]) }}</span>
              <span v-else-if="col === 'status'" class="badge badge-success">{{ item[col] }}</span>
              <span v-else>{{ item[col] }}</span>
            </td>
            <td class="actions-cell">
              <button v-if="activeTab !== 'registrations'" class="btn-icon edit" @click="startEdit(item)"
                title="Редактировать">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>

              <label v-if="activeTab === 'teachers' && !isEditing" class="btn-icon upload" title="Загрузить фото">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <input type="file" accept="image/*" hidden @change="handleTeacherPhotoUpload(item.id, $event)">
              </label>

              <button class="btn-icon danger" @click="handleDelete(item.id)" title="Удалить">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useSiteContentStore } from '../stores/siteContent'

const store = useSiteContentStore()
const activeTab = ref('home') // 👇 ТЕПЕРЬ ПО УМОЛЧАНИЮ ОТКРЫВАЕТСЯ ВКЛАДКА ГЛАВНОЙ
const showForm = ref(false)
const isEditing = ref(false)

const formItem = reactive({})
const isFile = (val) => val instanceof File;

// 👇 ФОРМА ДЛЯ НАСТРОЕК ГЛАВНОЙ
const homeForm = reactive({ ...store.homeSettings })

// Следим за изменением настроек в сторе, чтобы обновить форму
watch(() => store.homeSettings, (newVal) => {
  Object.assign(homeForm, newVal)
}, { deep: true })

const tabs = [
  { key: 'home', label: 'Главная страница', columns: [] }, // 👇 НОВАЯ ВКЛАДКА
  { key: 'courses', label: 'Курсы', columns: ['icon', 'title', 'level', 'duration'] },
  { key: 'teachers', label: 'Преподаватели', columns: ['photo_url', 'name', 'specialization', 'experience'] },
  { key: 'schedule', label: 'Расписание', columns: ['day', 'time', 'title', 'room', 'teacher', 'group', 'course'] },
  { key: 'events', label: 'Мероприятия', columns: ['icon', 'title', 'date'] },
  { key: 'gallery', label: 'Галерея', columns: ['url', 'caption', 'category'] },
  { key: 'registrations', label: 'Заявки', columns: ['date', 'fullName', 'email', 'course', 'status'] }
]

const currentTab = computed(() => tabs.find(t => t.key === activeTab.value))
const currentItems = computed(() => store.content[activeTab.value])
const visibleColumns = computed(() => currentTab.value?.columns || [])
const currentTabLabel = computed(() => currentTab.value?.label)

function switchTab(key) {
  activeTab.value = key
  closeForm()
}

function openAddForm() {
  isEditing.value = false
  resetFormItem()
  showForm.value = true
}

function startEdit(item) {
  isEditing.value = true
  Object.keys(formItem).forEach(k => delete formItem[k])
  Object.assign(formItem, JSON.parse(JSON.stringify(item)))
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  isEditing.value = false
  resetFormItem()
}

function resetFormItem() {
  Object.keys(formItem).forEach(k => delete formItem[k])

  if (activeTab.value === 'courses') {
    Object.assign(formItem, { icon: '', title: '', level: 'beginner', duration: '', is_featured: false })
  }
  else if (activeTab.value === 'teachers') {
    // 👇 Добавлено is_featured
    Object.assign(formItem, { photo_url: '', name: '', specialization: '', experience: '', bio: '', is_featured: false })
  }
  else if (activeTab.value === 'schedule') {
    Object.assign(formItem, { time: '', title: '', room: '', teacher: '', day: 'mon', group: '', course: '1' })
  }
  else if (activeTab.value === 'events') {
    // 👇 Добавлено is_featured
    Object.assign(formItem, { icon: '', title: '', date: '', description: '', is_featured: false })
  }
  else if (activeTab.value === 'gallery') {
    Object.assign(formItem, { url: null, caption: '', category: 'hackathon', is_featured: false })
  }
  else if (activeTab.value === 'registrations') {
    Object.assign(formItem, { fullName: '', email: '', phone: '', age: '', course: '', message: '', status: 'Новая' })
  }
}

// 👇 СОХРАНЕНИЕ НАСТРОЕК ГЛАВНОЙ
async function saveHomeSettings() {
  try {
    await store.updateHomeSettings({ ...homeForm })
    alert('Настройки главной страницы успешно сохранены!')
  } catch (e) {
    alert('Ошибка при сохранении: ' + e.message)
  }
}

const handleFileUpload = (event) => { const file = event.target.files[0]; if (file) formItem.url = file; };
const handleTeacherPhotoSelect = (event) => { const file = event.target.files[0]; if (file) formItem.photo_url = file; };
const handleTeacherPhotoUpload = async (id, event) => { const file = event.target.files[0]; if (file) await store.uploadTeacherPhoto(id, file); };

async function handleSave() {
  try {
    if (activeTab.value === 'gallery') {
      if (!isEditing.value && !(formItem.url instanceof File)) return alert('Выберите файл!');
      if (isEditing.value) {
        await store.updateItem('gallery', formItem.id, { ...formItem })
      } else {
        await store.addItem('gallery', { ...formItem });
      }
    }
    else if (activeTab.value === 'teachers') {
      if (!formItem.name || !formItem.specialization) return alert('Заполните ФИО и Специализацию!');

      // 👇 ИСПРАВЛЕНО: Добавляем is_featured в объект учителя
      const teacherData = {
        name: formItem.name,
        specialization: formItem.specialization,
        experience: formItem.experience || '',
        bio: formItem.bio || '',
        is_featured: formItem.is_featured || false
      };

      if (isEditing.value) {
        await store.updateItem('teachers', formItem.id, teacherData)
        if (formItem.photo_url instanceof File) await store.uploadTeacherPhoto(formItem.id, formItem.photo_url);
      } else {
        await store.addItem('teachers', teacherData);
        if (formItem.photo_url instanceof File) {
          const lastTeacher = store.content.teachers[store.content.teachers.length - 1];
          if (lastTeacher) await store.uploadTeacherPhoto(lastTeacher.id, formItem.photo_url);
        }
      }
    }
    else if (activeTab.value === 'schedule') {
      const scheduleData = {
        time: formItem.time,
        title: formItem.title,
        room: formItem.room,
        teacher: formItem.teacher,
        day: formItem.day,
        group: formItem.group,
        course: formItem.course
      }

      if (isEditing.value) {
        await store.updateItem('schedule', formItem.id, scheduleData)
      } else {
        await store.addItem('schedule', scheduleData);

        const newGroupName = formItem.group;
        if (newGroupName && !store.groups.includes(newGroupName)) {
          store.groups.push(newGroupName);
          store.groups.sort();
        }
      }
    }
    else {
      if (isEditing.value) {
        await store.updateItem(activeTab.value, formItem.id, { ...formItem })
      } else {
        if (!formItem.title && !formItem.name && !formItem.fullName) return alert('Заполните обязательные поля!');
        await store.addItem(activeTab.value, { ...formItem });
      }
    }

    closeForm();

  } catch (error) {
    console.error('Ошибка сохранения:', error);
    alert('Произошла ошибка при сохранении.');
  }
}

async function handleDelete(id) {
  if (confirm('Удалить этот элемент?')) await store.deleteItem(activeTab.value, id);
}

function formatLabel(key) {
  const map = {
    icon: 'Иконка', emoji: 'Аватар', title: 'Название', name: 'ФИО', fullName: 'ФИО',
    level: 'Уровень', duration: 'Длительность', specialization: 'Специализация',
    experience: 'Опыт', time: 'Время', room: 'Аудитория', teacher: 'Преподаватель',
    date: 'Дата', email: 'Email', course: 'Курс', status: 'Статус',
    url: 'Фото', caption: 'Подпись', category: 'Категория', photo_url: 'Фото',
    day: 'День недели', group: 'Группа'
  };
  return map[key] || key;
}

function getLevelText(level) {
  return { beginner: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый' }[level] || level;
}

watch(activeTab, () => { closeForm(); });
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border);
  padding-bottom: 1rem;
  overflow-x: auto;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--primary);
  color: white;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-form {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-out;
  position: relative;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
}

.input-with-datalist {
  position: relative;
}

.hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Стили для чекбокса */
.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.admin-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-transform: uppercase;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
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

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.btn-icon {
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-icon svg {
  width: 16px;
  height: 16px;
}

.btn-icon.edit {
  background: #e0e7ff;
  color: #4f46e5;
}

.btn-icon.edit:hover {
  background: #c7d2fe;
}

.btn-icon.danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn-icon.danger:hover {
  background: #fecaca;
}

.btn-icon.upload {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-icon.upload:hover {
  background: #e5e7eb;
}

.thumb-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.file-name {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .admin-table {
    display: block;
    overflow-x: auto;
  }
}
</style>