# Архітектурні рішення Music Manager (ADR)

- **Статус:** Accepted
- **Дата:** 26.05.2025
- **Автор:** Алекс Данько

## Огляд рішень

### Базові рішення
1. [0001-record-architecture-decisions.md](./decisions/0001-record-architecture-decisions.md) — Впровадження ADR. Всі архітектурні рішення документуються у вигляді ADR.
2. [0002-frontend-framework-vue3.md](./decisions/0002-frontend-framework-vue3.md) — Вибір основного фреймворку: Vue.js 3 (Composition API). Причини вибору, експертиза, продуктивність.
3. [0003-architecture-spa-vs-ssr.md](./decisions/0003-architecture-spa-vs-ssr.md) — Вибір SPA-архітектури замість SSR/SSG. Пояснення, порівняння, наслідки.
4. [0004-state-management-pinia.md](./decisions/0004-state-management-pinia.md) — Вибір Pinia для управління станом (порівняння з Redux, Vuex).
5. [0005-ui-library-vuetify.md](./decisions/0005-ui-library-vuetify.md) — Вибір Vuetify як основної UI бібліотеки.
6. [0006-http-axios.md](./decisions/0006-http-axios.md) — Вибір Axios для HTTP-запитів.
7. [0007-project-structure.md](./decisions/0007-project-structure.md) — Структура проекту та організація коду.
8. [0008-testing-strategy.md](./decisions/0008-testing-strategy.md) — Стратегія тестування.
9. [0009-modal-windows-visiblepool.md](./decisions/0009-modal-windows-visiblepool.md) — Реалізація модальних вікон.

## Формат ADR

Кожен ADR має містити наступні секції:

1. **Метадані**
   - Статус (Status): [Accepted / Proposed / Deprecated / Superseded]
   - Дата (Date): [YYYY-MM-DD]
   - Автор (Author): [Ім'я та прізвище]

2. **Основний контент**
   - Контекст (Context): Опис проблеми або ситуації
   - Рішення (Decision): Детальне опис прийнятого рішення
   - Наслідки (Consequences): Позитивні та негативні наслідки
   - Покращення (Improvements): Можливі майбутні покращення

## Правила роботи з ADR

1. **Створення нового ADR**
   - Використовувати шаблон [template.md](./template.md)
   - Присвоювати унікальний номер (NNNN-title.md)
   - Вказувати всі необхідні метадані


