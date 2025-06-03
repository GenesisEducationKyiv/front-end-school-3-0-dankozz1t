# 0003. Architecture Choice: SPA instead of SSR/SSG

- **Status:** Accepted
- **Date:** 26.05.2025
- **Author:** Alex Danko

## Context

For Music Manager, it is important to ensure fast interaction, simple deployment, minimal DevOps requirements, and quick time-to-market. SEO is not a critical success factor for the project, as the main focus is on user convenience and speed of working with musical content.

## Decision

It was decided to use SPA (Single Page Application) architecture instead of SSR (Server-Side Rendering) or SSG (Static Site Generation).

1. **Technical advantages**
   - Fast interaction without page reloading
   - Lower DevOps infrastructure requirements

2. **Business advantages**
   - Faster time-to-market
   - Lower development and maintenance costs
   - Simpler development process

3. **Rejection of SSR/SSG**
   - SEO is not critical for the project
   - Complexity of maintaining SSR/SSG is not justified
   - Additional costs for server infrastructure

## Consequences
- Fast user interaction with the application
- Simple deployment and maintenance process
- Easy integration of new libraries
- Reduced time-to-market for new features
- Lower server infrastructure requirements
- SEO limitations
- Possible issues with first render
- Difficulty scaling to other platforms

## Improvements
- Implementation of PWA functionality
- Optimization of initial loading
- SEO improvement through pre-rendering 

---
Go to Back - [All decisions](../README.md)