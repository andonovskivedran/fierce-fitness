# Fierce Fitness

Веб-апликација за фитнес центар во Скопје, изработена за предметот Деловна пракса
на ФИНКИ (2025/2026). Составена е од статичен фронтенд (HTML/CSS/JS) и
REST API бекенд (FastAPI + PostgreSQL).

Технологии: HTML5, CSS3, Vanilla JavaScript, Font Awesome, Google Fonts,
Google Translate API, FastAPI, SQLAlchemy 2.0 (async), PostgreSQL 15, 
Alembic, Docker, Nginx.

## Features

Фронтенд:

- Responsive дизајн (mobile, tablet, desktop)
- Dark/Light mode со localStorage
- MK/EN јазична поддршка + Google Translate за DE/FR/SQ/TR
- Scroll анимации (Intersection Observer)
- Custom cursor со follower (само на desktop)
- Cookie consent banner
- Контакт форма со client-side валидација
- Programs slider со dots навигација
- Magnetic buttons и ripple ефекти
- Loading screen со анимација
- Hero spotlight ефект при движење на mouse
- Count-up анимација на статистики
- Најава/регистрација, dashboard со активен план, промена и деактивирање на членство
- Блог секција, FAQ, Privacy Policy, toast известувања

Бекенд:

- JWT автентикација со улоги (guest, member, trainer, admin)
- Тренери, програми, членства, термини, блог, контакт и newsletter
- Rate limiting, security headers, CORS, HSTS во production
- Pydantic валидација (лозинка со посебен знак), Alembic миграции

## Стартување локално

Потребен е Docker.

```
git clone https://github.com/andonovskivedran/fierce-fitness.git
cd fierce-fitness
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

- Сајт: http://localhost:8080
- API документација (Swagger): http://localhost:8080/api/docs

Миграциите и почетните податоци (админ, membership планови, тест корисници)
се применуваат автоматски при стартот на бекендот.

## Тест корисници

| Улога   | Email | Лозинка                       |
|---------|-------|-------------------------------|
| Admin   | вредноста од `ADMIN_EMAIL` | вредноста од `ADMIN_PASSWORD` |
| Trainer | trainer@fiercefitness.com | Trainer123!                   |
| Member  | member@fiercefitness.com | Member123!                    |

Тест корисниците се креираат само ако `SEED_TEST_USERS=true`.

## API ендпоинти

Целосна листа на ендпоинти е достапна на: `/api/docs`.
Главни групи на ендпоинти: `/auth` (register, login, me, промена на улога),
`/trainers`, `/programs`, `/memberships` (plans, subscribe, active, switch, deactivate),
`/appointments`, `/blog`, `/contact`, `/newsletter`.

## Хостирање (reporun.finki.net.mk)

Репото содржи `docker-compose.yml` и `stack.yml`. 
Потребни env вредности: `POSTGRES_PASSWORD`, `SECRET_KEY`, `ADMIN_PASSWORD`, `ENVIRONMENT=production`.

## Автори

Ведран Андоновски, Наташа Савеска и Христијан Таневски

Деловна пракса 2025/2026.

