-- server/init.sql

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица подписчиков
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица настроек главной
CREATE TABLE IF NOT EXISTS home_settings (
    id SERIAL PRIMARY KEY,
    hero_title TEXT DEFAULT 'Летний IT Лагерь 2026',
    hero_description TEXT DEFAULT 'Изучайте современные технологии, создавайте проекты, участвуйте в хакатонах.',
    stats_participants TEXT DEFAULT '150+',
    stats_courses_label TEXT DEFAULT 'Направлений',
    stats_teachers_label TEXT DEFAULT 'Преподавателей',
    section_courses_title TEXT DEFAULT 'Популярные курсы',
    section_teachers_title TEXT DEFAULT 'Наши менторы',
    section_events_title TEXT DEFAULT 'Ближайшие события',
    section_gallery_title TEXT DEFAULT 'Атмосфера лагеря'
);
INSERT INTO home_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Остальные таблицы с ДОБАВЛЕННЫМИ is_featured
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    duration VARCHAR(100),
    icon VARCHAR(10),
    is_featured BOOLEAN DEFAULT false -- 👈 ДОБАВЛЕНО
);

CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience VARCHAR(100),
    bio TEXT,
    emoji VARCHAR(10),
    photo_url TEXT,
    is_featured BOOLEAN DEFAULT false -- 👈 ДОБАВЛЕНО (КРИТИЧЕСКИ ВАЖНО!)
);

CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    time VARCHAR(10),
    title VARCHAR(255),
    room VARCHAR(100),
    teacher VARCHAR(255),
    "day" VARCHAR(3) DEFAULT 'mon',
    "group" VARCHAR(20) DEFAULT 'Общая',
    "course" VARCHAR(10) DEFAULT '1'
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    date VARCHAR(100),
    icon VARCHAR(10),
    description TEXT,
    is_featured BOOLEAN DEFAULT false -- 👈 ДОБАВЛЕНО
);

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100),
    url TEXT,
    caption VARCHAR(255),
    is_featured BOOLEAN DEFAULT false -- 👈 ДОБАВЛЕНО
);

CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    age VARCHAR(20),
    course VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Новая',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);