// camp/src/stores/siteContent.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useSiteContentStore = defineStore('siteContent', () => {
  const router = useRouter()
  
  const content = ref({
    courses: [], 
    teachers: [], 
    schedule: [], 
    events: [], 
    gallery: [], 
    registrations: []
  })
  
  const groups = ref([])
  
  // 👇 НОВОЕ СОСТОЯНИЕ ДЛЯ НАСТРОЕК ГЛАВНОЙ
  const homeSettings = ref({
    hero_title: '',
    hero_description: '',
    stats_participants: '',
    stats_courses_label: '',
    stats_teachers_label: '',
    section_courses_title: '',
    section_teachers_title: '',
    section_events_title: '',
    section_gallery_title: ''
  })
  
  const isLoading = ref(true)
  const token = ref(localStorage.getItem('admin_token') || null)
  const currentUser = ref(JSON.parse(localStorage.getItem('current_user') || 'null'))
  
  const isAdmin = computed(() => currentUser.value?.role === 'administrator')
  const isAuth = computed(() => !!token.value)

  const getAuthHeaders = () => ({
    ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {})
  })

  // 👇 ИСПРАВЛЕНО: Используем относительный путь для картинок, чтобы они работали через Nginx
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url; // Убрали http://localhost:3000
    return url;
  };

  async function fetchAllData() {
    try {
      const fetchData = async (url) => {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return await res.json()
        } catch (e) {
          console.warn(`Ошибка загрузки ${url}:`, e)
          return [] // Возвращаем пустой массив при ошибке, чтобы не ломать всю страницу
        }
      }

      // 👇 ЗАГРУЖАЕМ ВСЕ ДАННЫЕ ПАРАЛЛЕЛЬНО (Используем относительные пути /api/...)
      const [courses, teachers, schedule, events, gallery, settings] = await Promise.all([
        fetchData('/api/courses'),
        fetchData('/api/teachers'),
        fetchData('/api/schedule'),
        fetchData('/api/events'),
        fetchData('/api/gallery'),
        fetchData('/api/home-settings').catch(() => null) // Настройки могут отсутствовать
      ])

      content.value = { 
        courses: courses || [], 
        teachers: teachers || [], 
        schedule: schedule || [], 
        events: events || [], 
        gallery: gallery || [], 
        registrations: [] 
      }
      
      // 👇 СОХРАНЯЕМ НАСТРОЙКИ
      if (settings) {
        homeSettings.value = settings
      }
      
    } catch (err) {
      console.error('❌ Критическая ошибка загрузки:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 👇 РЕГИСТРАЦИЯ
  async function register(username, email, password) {
    try {
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ошибка регистрации')
      }

      const data = await res.json()
      token.value = data.token
      currentUser.value = data.user
      
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('current_user', JSON.stringify(data.user))
      
      return true
    } catch (e) {
      throw e
    }
  }

  // 👇 ОБНОВЛЕННЫЙ ВХОД
  async function login(username, password) {
    try {
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Ошибка входа')
      }

      const data = await res.json()
      token.value = data.token
      currentUser.value = data.user
      
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('current_user', JSON.stringify(data.user))
      
      return true
    } catch (e) {
      throw e
    }
  }

  function logout() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('current_user')
    router.push('/')
  }

  // 👇 СМЕНА ПАРОЛЯ
  async function changePassword(oldPassword, newPassword) {
    try {
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.value.id,
          oldPassword,
          newPassword
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка смены пароля');
      }

      return true;
    } catch (e) {
      throw e;
    }
  }

  // 👇 МЕТОД ОБНОВЛЕНИЯ НАСТРОЕК ГЛАВНОЙ
  async function updateHomeSettings(data) {
    try {
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch('/api/home-settings', {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка обновления');
      }

      const updated = await res.json();
      homeSettings.value = updated;
      return true;
    } catch (e) {
      console.error('❌ Ошибка updateHomeSettings:', e);
      throw e;
    }
  }

  async function updateItem(collection, id, data) {
    try {
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch(`/api/${collection}/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Неизвестная ошибка' }));
        throw new Error(err.error || `Ошибка обновления (${res.status})`);
      }

      const updatedItem = await res.json();
      const index = content.value[collection].findIndex(item => item.id === id);
      if (index !== -1) content.value[collection][index] = updatedItem;
      
      return updatedItem;
    } catch (e) {
      console.error(`❌ Ошибка updateItem (${collection}):`, e);
      throw e;
    }
  }

  async function addItem(collection, item) {
    try {
      let res;
      if (collection === 'gallery' && item.url instanceof File) {
        const formData = new FormData();
        formData.append('image', item.url);
        formData.append('category', item.category || 'other');
        formData.append('caption', item.caption || '');
        formData.append('is_featured', item.is_featured || false); // 👈 Добавлено is_featured
        // 👇 ИСПРАВЛЕНО: Относительный путь
        res = await fetch('/api/gallery', {
          method: 'POST', headers: getAuthHeaders(), body: formData
        });
      } else {
        // 👇 ИСПРАВЛЕНО: Относительный путь
        res = await fetch(`/api/${collection}`, {
          method: 'POST',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }

      if (res.ok) {
        const newItem = await res.json();
        content.value[collection].push(newItem);
        return newItem;
      } else {
        const err = await res.json().catch(() => ({ error: 'Неизвестная ошибка сервера' }));
        throw new Error(err.error || `Ошибка ${res.status}`);
      }
    } catch (e) { 
      console.error(`❌ Ошибка addItem (${collection}):`, e);
      throw e;
    }
  }

  async function uploadTeacherPhoto(teacherId, file) {
    if (!file) { alert('Файл не выбран!'); return false; }
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('teacherId', teacherId);
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch('/api/teachers/upload', { method: 'POST', body: formData });

      if (res.ok) {
        const updatedTeacher = await res.json();
        const index = content.value.teachers.findIndex(t => t.id === teacherId);
        if (index !== -1) content.value.teachers[index] = updatedTeacher;
        return true;
      } else {
        const errText = await res.text();
        try { alert(JSON.parse(errText).error || 'Ошибка загрузки'); } 
        catch(e) { alert(`Ошибка ${res.status}: ${errText}`); }
        return false;
      }
    } catch (e) {
      console.error('❌ Критическая ошибка:', e);
      alert('Ошибка сети или сервер недоступен');
      return false;
    }
  }

  async function deleteItem(collection, id) {
    try {
      // 👇 ИСПРАВЛЕНО: Относительный путь
      const res = await fetch(`/api/${collection}/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
      });
      if (res.ok) {
        content.value[collection] = content.value[collection].filter(i => i.id !== id);
      } else {
        alert('Ошибка удаления');
      }
    } catch (e) { console.error(e); }
  }

  return {
    content, groups, isLoading, token, currentUser, isAdmin, isAuth, getImageUrl,
    homeSettings, // 👈 Экспортируем настройки
    fetchAllData, login, register, logout, addItem, updateItem, deleteItem, uploadTeacherPhoto,
    changePassword, updateHomeSettings // 👈 Экспортируем метод обновления
  }
})