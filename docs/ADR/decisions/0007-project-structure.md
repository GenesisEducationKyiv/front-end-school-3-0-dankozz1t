# 0007. Project Structure and Code Organization

- **Status:** Accepted 
- **Date:** 27.05.2025 (Updated: 01.06.2025)
- **Author:** Alex Danko

## Context

To ensure scalability and maintainability of the Music Manager project, it is necessary to define a clear project structure and code organization rules. This will help avoid chaos as the project grows and simplify onboarding of new developers.

## Decision

It was decided to use a feature-based modular project structure with clear separation by domains and shared resources.

### Current project structure:
```
src/
├── assets/         # Static resources (images, fonts)
├── layouts/        # Page templates and layout components
├── pages/          # Page components (route-level components)
├── router/         # Routing configuration
├── services/       # Global API services and HTTP configuration
├── styles/         # Global styles, mixins, and CSS variables
├── modules/        # Feature-based modules
│   ├── track/      # Track management functionality
│   │   ├── api/        # Track-specific API calls
│   │   ├── components/ # Track-related components
│   │   ├── composables/# Track business logic
│   │   ├── store/      # Track state management
│   │   ├── types/      # Track-specific types
│   │   └── tests/      # Track module tests
│   └── player/     # Audio player functionality
│       ├── components/ # Player UI components
│       ├── composables/# Player logic
│       ├── store/      # Player state
│       ├── types.ts    # Player types
│       └── tests/      # Player tests
└── shared/         # Shared resources across modules
    ├── composables/    # Reusable composition functions
    ├── types/          # Global TypeScript types
    └── modules/        # Shared feature modules
        ├── modalsPool/ # Modal management system
        ├── notification/ # Notification system
        └── genres/     # Genre management
```

### Organization rules:

1. **Feature Modules**
   - Each feature is a self-contained module
   - Module structure: api/, components/, composables/, store/, types/, tests/
   - Clear module boundaries and interfaces
   - Module-specific types and business logic

2. **Shared Resources**
   - Common functionality in shared/modules/
   - Global types in shared/types/
   - Reusable composables in shared/composables/
   - Cross-module utilities and helpers

3. **Components**
   - Feature-specific components within module/components/
   - Shared components in shared/modules/
   - One component per file
   - Proper TypeScript typing for props and emits

4. **State Management**
   - Module-specific stores in module/store/
   - Clear state boundaries between modules
   - Typed store interfaces

5. **API Layer**
   - Module-specific API calls in module/api/
   - Global HTTP configuration in services/
   - Consistent error handling

## Consequences
##### Positive
- Clear feature boundaries improve code organization
- Easy to locate and modify feature-specific code
- Better scalability with independent modules
- Simplified testing with module isolation
- Shared resources prevent code duplication
##### Negative
- Initial setup complexity for new features
- Potential over-engineering for simple features

---
Go to Back - [All decisions](../README.md)