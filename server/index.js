// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Разрешены только изображения!'));
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение к базе данных
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err) => {
    if (err) console.error('❌ Ошибка подключения:', err.message);
    else console.log('✅ Подключено к базе данных camp_db');
});

// ================= API РОУТЫ =================

// 👇 РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Заполните все поля' });

    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existing.rows.length > 0) return res.status(409).json({ error: 'Пользователь с таким email или именем уже существует' });

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, password, 'user']
        );
        
        const token = `user-token-${result.rows[0].id}-${Date.now()}`;
        
        res.status(201).json({ 
            success: true, 
            token, 
            user: result.rows[0] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// 👇 ВХОД В СИСТЕМУ
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        let user;
        
        // Админский вход (хардкод)
        if (username === 'admin' && password === 'admin') {
            user = { id: 0, username: 'admin', email: 'admin@camp.ru', role: 'administrator' };
        } else {
            // Обычный пользователь из БД
            const result = await pool.query(
                'SELECT id, username, email, role, password_hash FROM users WHERE username = $1 OR email = $1', 
                [username]
            );
            
            if (result.rows.length === 0) return res.status(401).json({ error: 'Неверный логин или пароль' });
            
            const dbUser = result.rows[0];
            if (dbUser.password_hash !== password) return res.status(401).json({ error: 'Неверный логин или пароль' });
            
            user = { id: dbUser.id, username: dbUser.username, email: dbUser.email, role: dbUser.role };
        }

        const token = user.role === 'administrator' 
            ? 'summer-tech-camp-admin-token-2026' 
            : `user-token-${user.id}-${Date.now()}`;

        res.json({ success: true, token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
});

// 👇 СМЕНА ПАРОЛЯ
app.put('/api/users/password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    
    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Заполните все поля' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const user = userResult.rows[0];

        if (user.password_hash !== oldPassword) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }

        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPassword, userId]);

        res.json({ success: true, message: 'Пароль успешно обновлен' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при смене пароля' });
    }
});

// 👇 ПРОВЕРКА СТАТУСА ПОДПИСКИ
app.get('/api/subscribe/status', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.json({ subscribed: false });

    try {
        const result = await pool.query('SELECT id FROM subscribers WHERE email = $1', [email]);
        res.json({ subscribed: result.rows.length > 0 });
    } catch (err) {
        console.error(err);
        res.json({ subscribed: false });
    }
});

// 👇 ПОДПИСКА НА НОВОСТИ
app.post('/api/subscribe', async (req, res) => {
    const { email, userId } = req.body;
    
    if (!email) return res.status(400).json({ error: 'Email обязателен' });

    try {
        const existing = await pool.query('SELECT id FROM subscribers WHERE email = $1', [email]);
        
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Вы уже подписаны на новости' });
        }

        await pool.query(
            'INSERT INTO subscribers (email, user_id) VALUES ($1, $2)',
            [email, userId || null]
        );

        res.status(201).json({ success: true, message: 'Вы успешно подписались!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при подписке' });
    }
});

// 👇 ОТПИСКА ОТ НОВОСТЕЙ
app.post('/api/unsubscribe', async (req, res) => {
    const { email } = req.body;
    
    if (!email) return res.status(400).json({ error: 'Email обязателен' });

    try {
        const result = await pool.query('DELETE FROM subscribers WHERE email = $1 RETURNING *', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Подписка не найдена' });
        }

        res.json({ success: true, message: 'Вы отписались от новостей' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при отписке' });
    }
});

// 👇 ПОЛУЧЕНИЕ НАСТРОЕК ГЛАВНОЙ СТРАНИЦЫ
app.get('/api/home-settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM home_settings WHERE id = 1');
        if (result.rows.length === 0) {
            await pool.query('INSERT INTO home_settings (id) VALUES (1)');
            const newResult = await pool.query('SELECT * FROM home_settings WHERE id = 1');
            return res.json(newResult.rows[0]);
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка загрузки настроек' });
    }
});

// 👇 ОБНОВЛЕНИЕ НАСТРОЕК ГЛАВНОЙ СТРАНИЦЫ
app.put('/api/home-settings', async (req, res) => {
    const { 
        hero_title, hero_description, stats_participants, 
        stats_courses_label, stats_teachers_label,
        section_courses_title, section_teachers_title, 
        section_events_title, section_gallery_title 
    } = req.body;

    try {
        const result = await pool.query(`
            UPDATE home_settings SET 
                hero_title = $1, 
                hero_description = $2, 
                stats_participants = $3,
                stats_courses_label = $4,
                stats_teachers_label = $5,
                section_courses_title = $6,
                section_teachers_title = $7,
                section_events_title = $8,
                section_gallery_title = $9
            WHERE id = 1 RETURNING *`,
            [hero_title, hero_description, stats_participants, 
             stats_courses_label, stats_teachers_label,
             section_courses_title, section_teachers_title, 
             section_events_title, section_gallery_title]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка обновления настроек' });
    }
});

// Публичные GET роуты (с явным выбором полей для поддержки is_featured)
app.get('/api/courses', async (req, res) => {
    try { 
        const result = await pool.query('SELECT id, title, description, level, duration, icon, is_featured FROM courses ORDER BY id');
        res.json(result.rows); 
    }
    catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

// 👇 ОБНОВЛЕННЫЙ ПОЛУЧЕНИЕ ПРЕПОДАВАТЕЛЕЙ
app.get('/api/teachers', async (req, res) => {
    try { 
        const result = await pool.query('SELECT id, name, specialization, experience, bio, emoji, photo_url, is_featured FROM teachers ORDER BY id');
        res.json(result.rows); 
    }
    catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.get('/api/schedule', async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM schedule ORDER BY "day", time, "group"')).rows); }
    catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

// 👇 ОБНОВЛЕННЫЙ ПОЛУЧЕНИЕ СОБЫТИЙ
app.get('/api/events', async (req, res) => {
    try { 
        const result = await pool.query('SELECT id, title, date, icon, description, is_featured FROM events ORDER BY id');
        res.json(result.rows); 
    }
    catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.get('/api/gallery', async (req, res) => {
    try { 
        const result = await pool.query('SELECT id, category, url, caption, is_featured FROM gallery ORDER BY id');
        res.json(result.rows); 
    }
    catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.get('/api/registrations', async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM registrations ORDER BY created_at DESC')).rows); }
    catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

// Создание курса
app.post('/api/courses', async (req, res) => {
    const { title, description, level, duration, icon, is_featured } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO courses (title, description, level, duration, icon, is_featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, level, duration, icon, is_featured || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Ошибка сохранения курса' }); }
});

// Создание преподавателя
app.post('/api/teachers', async (req, res) => {
    const { name, specialization, experience, bio, emoji, is_featured } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO teachers (name, specialization, experience, bio, emoji, is_featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, specialization, experience, bio, emoji, is_featured || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Ошибка сохранения преподавателя' }); }
});

// Создание расписания
app.post('/api/schedule', async (req, res) => {
    const { time, title, room, teacher, day, group, course } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO schedule (time, title, room, teacher, "day", "group", "course") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [time, title, room, teacher, day || 'mon', group || 'Общая', course || '1']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Ошибка сохранения расписания' }); }
});

// Редактирование любой записи (универсальный роут)
app.put('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const allowedTables = ['courses', 'teachers', 'schedule', 'events', 'gallery', 'registrations'];
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Недопустимая таблица' });

    try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
        
        const result = await pool.query(
            `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ error: 'Элемент не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка обновления' });
    }
});

// Создание мероприятия
app.post('/api/events', async (req, res) => {
    const { title, date, icon, description, is_featured } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (title, date, icon, description, is_featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, date, icon, description, is_featured || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Ошибка сохранения мероприятия' }); }
});

// Загрузка фото галереи
app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Файл не выбран' });
        const { category, caption, is_featured } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;
        const result = await pool.query(
            'INSERT INTO gallery (category, url, caption, is_featured) VALUES ($1, $2, $3, $4) RETURNING *',
            [category || 'other', imageUrl, caption || 'Без подписи', is_featured === 'true' || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Ошибка сохранения фото' }); }
});

// Загрузка фото преподавателя
app.post('/api/teachers/upload', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Файл не был выбран' });
        const { teacherId } = req.body;
        if (!teacherId) return res.status(400).json({ error: 'Не указан ID преподавателя' });

        const imageUrl = `/uploads/${req.file.filename}`;
        const oldTeacher = await pool.query('SELECT photo_url FROM teachers WHERE id = $1', [teacherId]);
        if (oldTeacher.rows.length > 0 && oldTeacher.rows[0].photo_url) {
            const oldPath = path.join(__dirname, oldTeacher.rows[0].photo_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const result = await pool.query('UPDATE teachers SET photo_url = $1 WHERE id = $2 RETURNING *', [imageUrl, teacherId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Преподаватель не найден' });
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Ошибка загрузки фото' }); }
});

// Удаление записи
app.delete('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const allowedTables = ['courses', 'teachers', 'schedule', 'events', 'gallery', 'registrations'];
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Недопустимая таблица' });
    
    try {
        if (table === 'teachers') {
            const result = await pool.query('SELECT photo_url FROM teachers WHERE id = $1', [id]);
            if (result.rows.length > 0 && result.rows[0].photo_url) {
                const filePath = path.join(__dirname, result.rows[0].photo_url);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }
        if (table === 'gallery') {
            const result = await pool.query('SELECT url FROM gallery WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                const filePath = path.join(__dirname, result.rows[0].url);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }
        await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Ошибка удаления' }); }
});

// Заявка на участие
app.post('/api/registrations', async (req, res) => {
    const { fullName, email, phone, age, course, message } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO registrations (full_name, email, phone, age, course, message, status) VALUES ($1, $2, $3, $4, $5, $6, 'Новая') RETURNING *`,
            [fullName, email, phone, age, course, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: 'Не удалось сохранить заявку' }); }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});