# 0007. Project Structure and Code Organization (in progress)

- **Status:** Proposed 
- **Date:** 27.05.2025
- **Author:** Alex Danko

## Context

To ensure scalability and maintainability of the Music Manager project, it is necessary to define a clear project structure and code organization rules. This will help avoid chaos as the project grows and simplify onboarding of new developers.

## Decision

It was decided to use a modular project structure with clear separation by domains.

### Project structure:
```
src/
├── assets/         # Static resources (images, fonts)
├── components/     # Reusable components
│   ├── Base/       # Base UI components
│   └── Modals/     # All project modal windows
│   └── Tracks/     # Track functionality
│   └── views/      # Isolated pages for reuse
├── composables/    # Reusable logic (Composition API)
├── layouts/        # Page templates
├── services/       # API requests
├── router/         # Routing configuration
├── stores/         # Pinia stores
├── styles/         # Global styles, mixins
├── types/          # TypeScript types and interfaces
├── utils/          # Utilities and helpers
└── pages/          # Page components
```

### Organization rules:
1. **Components**
   - One component - one file
   - Typing props and emits
   - Component documentation
   - Tests for each component

2. **Modules**
   - Isolated logic
   - Clear interfaces
   - Typed APIs
   - Module tests

## Consequences
- Clear structure simplifies navigation through the project
- Easy to find and reuse code
- Simplified onboarding of new developers
- Better project scalability
- Possible excessive module separation for small components
- Additional time costs for proper file placement

## Improvements
- Creating templates for new components
- Documentation with component usage examples 