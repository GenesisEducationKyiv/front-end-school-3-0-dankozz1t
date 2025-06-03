# 0009. Modal Windows Implementation through VisiblePool

- **Status:** Accepted
- **Date:** 27.05.2025
- **Author:** Alex Danko

## Context

For Music Manager, we need a modal window system that will provide:
- Type safety
- Easy state management

## Decision

It was decided to use VisiblePool for managing modal windows.

1. **System architecture**
   - Centralized store for managing modal window state
   - Queuing system for z-index control
   - Focus locking mechanism on active modal window
   - Support for nested modal windows
   - Typed API through TypeScript

2. **Technical advantages**
   - Simple API for developers
   - Support for different types of modal windows (dialogs, notifications, forms)
   - Flexible configuration system

3. **Comparison with alternatives**
   - Vue Modal: limited functionality, lack of typing
   - Vue Final Modal: complex API, excessive functionality
   - Custom implementation: full control, optimized for project needs

## Consequences
##### Positive
- Centralized modal window management
- Type-safe API through TypeScript
- Easy testing through isolated store
- Possibility of modal window nesting
- Control of z-index and focus
##### Negative
- Potential accessibility issues
- Potential SSR issues

## Improvements
- Adding ARIA attributes for accessibility 

---
Go to Back - [All decisions](../README.md)