# Music Manager Architecture Decision Records (ADR)

- **Status:** Accepted
- **Date:** 26.05.2025
- **Author:** Alex Danko

## Decision Overview

### Basic Decisions
1. [0001-record-architecture-decisions.md](./decisions/0001-record-architecture-decisions.md) — ADR implementation. All architectural decisions are documented as ADRs.
2. [0002-frontend-framework-vue3.md](./decisions/0002-frontend-framework-vue3.md) — Main framework choice: Vue.js 3 (Composition API). Reasons for choice, expertise, performance.
3. [0003-architecture-spa-vs-ssr.md](./decisions/0003-architecture-spa-vs-ssr.md) — Choice of SPA architecture instead of SSR/SSG. Explanation, comparison, consequences.
4. [0004-state-management-pinia.md](./decisions/0004-state-management-pinia.md) — Choosing Pinia for state management (comparison with Redux, Vuex).
5. [0005-ui-library-vuetify.md](./decisions/0005-ui-library-vuetify.md) — Choosing Vuetify as the main UI library.
6. [0006-http-axios.md](./decisions/0006-http-axios.md) — Choosing Axios for HTTP requests.
7. [0007-project-structure.md](./decisions/0007-project-structure.md) — Project structure and code organization.
8. [0008-testing-strategy.md](./decisions/0008-testing-strategy.md) — Testing strategy.
9. [0009-modal-windows-visiblepool.md](./decisions/0009-modal-windows-visiblepool.md) — Modal windows implementation.

## ADR Format

Each ADR should contain the following sections:

1. **Metadata**
   - Status: [Accepted / Proposed / Deprecated / Superseded]
   - Date: [YYYY-MM-DD]
   - Author: [Name and Surname]

2. **Main content**
   - Context: Description of the problem or situation
   - Decision: Detailed description of the made decision
   - Consequences: Positive and negative consequences
   - Improvements: Possible future improvements

## ADR Working Rules

1. **Creating new ADR**
   - Use template [template.md](./template.md)
   - Assign unique number (NNNN-title.md)
   - Specify all necessary metadata 