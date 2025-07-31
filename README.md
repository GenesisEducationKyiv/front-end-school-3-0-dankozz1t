# Music Track Manager - Alex Taylor Danko
<code>[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/dankozz1/)</code>
<code>[![Telegram](https://img.shields.io/badge/Telegram-blue?style=for-the-badge&logo=Telegram&logoColor=white)](https://t.me/dankozz1)</code>

## Tech Stack
- Vue 3 with Composition API and `<script setup>` syntax
- TypeScript
- Vite
- Vuetify 3
- Vue Router
- Pinia
- Axios
- SCSS
- ESLint and Prettier
- vue/test-utils + vitest + playwright
- My brain + AI to speed up time

## Project Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the project:
   ```bash
   npm start
   ```

After running, the application will be available at: http://localhost:3000

## Running Tests

To run all tests:

```bash
npm run test:vitest
npm run test:playwright
```
### Link to [Check Testing Preview](./tests/result/DIAGRAM.md)
---

## Music Manager Architecture Decision Records (ADR)
- [docs -> ADR ->  README.md](./docs/ADR/README.md) —  All architectural decisions 

## Music Manager Security Audit 
- [docs -> security-audit ->  README.md](./docs/security-audit/README.md) —  Security Report

## Bundle Analysis & Performance

add to env `VITE_IS_DEBUG=true`

```bash
# Analyze bundle with interactive tool
npm run analyze

# Run size analysis
npm run analyze:size

# Generate bundle report
npm run build:report
```

---

# Visual Demonstration  
- ![](./docs/demo/01_list.png)
- ![](./docs/demo/02_filters.png)
- ![](./docs/demo/03_bulk_delete.png)
- ![](./docs/demo/04_mobile.png)
- ![](./docs/demo/05_graphql.png)
- ![](./docs/demo/06_bundle_size.png)
- ![](./docs/demo/07_bundle_report.png)
- ![](./docs/demo/08_lighthouse.png)

