# 0006. Choosing Axios for HTTP Requests

- **Status:** Accepted
- **Date:** 26.05.2025
- **Author:** Alex Danko

## Context

We need a reliable, flexible, easy-to-use library for HTTP requests that easily integrates with Vue, supports centralized configuration, error handling, and testing.

## Decision

It was decided to use Axios for all HTTP requests in the application. Choice justification:

1. **Axios advantages**
   - Mature library
   - Good TypeScript support
   - Flexible configuration
   - Large community

2. **Comparison with alternatives**
   - Fetch API: less functionality
   - Ky: less popularity

## Consequences
- Easy to maintain and extend API logic
- Possibility of centralized logging and error handling
- Easy to test HTTP requests
- Flexible configuration for different environments
- Library weight
- Requires regular updates for security

## Improvements
- Implementation of retry logic for requests
- Implementation of global error handler 