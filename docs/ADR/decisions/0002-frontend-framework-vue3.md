# 0002. Frontend Framework Choice: Vue.js 3 (Composition API)

- **Status:** Accepted
- **Date:** 26.05.2025
- **Author:** Alex Danko

## Context

For the Music Manager startup, we need a modern, productive, scalable framework with good community support and simple onboarding. It's important to choose a technology that will ensure fast development, easy scaling, and a simple onboarding process for new developers.

## Decision

It was decided to use Vue.js 3 with Composition API as the main frontend framework.

### Technical implementation details:
1. **Version and configuration**
   - Vue 3.4+ with Composition API
   - TypeScript 5.0+
   - Vite as bundler
   - ESLint + Prettier for formatting

2. **Architectural principles**
   - Component approach using Composition API
   - Typing of all components and logic
   - Modular structure with clear separation of responsibilities

### Choice justification:

1. **Team expertise**
   - 100% of the team has deep expertise in Vue (it's just me)
   - Guarantees high quality and code stability

2. **Technical advantages**
   - High performance (top-3 according to [benchmarks](https://krausest.github.io/js-framework-benchmark/current.html))
   - Composition API for better code organization
   - Native TypeScript support
   - Optimized rendering through Virtual DOM

3. **Ecosystem**
   - Large number of ready-made components
   - Active developer community
   - Regular updates and support

## Consequences
##### Positive
- High quality and code stability
- Easy project scaling
- Fast development of new features
- Simple onboarding for new developers
- Good application performance
##### Negative
- Fewer ready-made solutions compared to React
- Difficulty finding experts in the job market
- Possible compatibility issues with some libraries

## Improvements
- Regular updates to new Vue versions 

---
Go to Back - [All decisions](../README.md)