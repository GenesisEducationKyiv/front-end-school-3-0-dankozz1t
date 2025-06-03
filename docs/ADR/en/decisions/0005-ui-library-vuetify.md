# 0005. Choosing Vuetify as the Main UI Library

- **Status:** Accepted
- **Date:** 26.05.2025
- **Author:** Alex Danko

## Context

We need a modern, flexible, accessible, and maintainable UI library for rapid development of a quality interface. It's important to ensure a consistent look, accessibility support, and the ability to quickly start development.

## Decision

It was decided to use Vuetify as the main UI component library. Choice justification:

1. **Vuetify advantages**
   - Ready-made, consistent UI components
   - Built-in accessibility
   - Large community, regular updates
   - Theming and customization support
   - Reduces the need for custom components, shortens development time

2. **Technical advantages**
   - Easy start for new projects
   - Good documentation
   - Material Design support
   - Easy integration with Vue 3

## Consequences
- High UI/UX quality
- Fast development start
- Easy to maintain and extend the interface
- Customization and theming possibilities
- Worsens onboarding for developers without Vuetify experience
- Complexity with heavily customized components
- Dependency on Vuetify roadmap (updates can break things)
- Possible customization limitations for complex UI cases
- Increased bundle size due to connecting a large library

## Improvements
- Optimization of component imports to reduce bundle size
- Implementation of Storybook for UI components 

---
Go to Back - [All decisions](../README.md)