# 0008. Testing Strategy

- **Status:** Proposed
- **Date:** 27.05.2025
- **Author:** Alex Danko

## Context

For Music Manager, we need a comprehensive testing strategy that will ensure:
- High code quality
- Functional stability
- Easy refactoring
- Documentation through tests
- Process automation

## Decision

It was decided to use a combination of different types of tests using Vitest.

### Types of tests:
1. **Unit tests**
   - Using Vitest as the main testing framework
   - Testing individual functions, utilities, and composables
   - Minimum coverage threshold: 80%

2. **Component tests**
   - Using Vue Test Utils
   - Testing individual components
   - Checking rendering, props, events

## Consequences
##### Positive
- High code quality
- Functional stability
- Easy refactoring
##### Negative
- Additional time costs
- Complexity of test maintenance
- Possible false positives
- Discipline required

## Improvements
- Automation of test execution
- Coverage improvement
- Speed optimization 

---
Go to Back - [All decisions](../README.md)