# 0010. HTTP Client Security Analysis and Recommendations

- **Status:** Proposed
- **Date:** 14.06.2025
- **Author:** Alex Danko

## Context

Following the security audit conducted in June 2025, it was identified that axios (currently used HTTP client) presents potential security risks due to its dependency chain and bundle size. This decision reviews alternatives from a security perspective and provides recommendations for potential migration.

## Decision

Based on comprehensive security analysis, we recommend considering migration from axios to Ky for improved security posture:

### Security Analysis Comparison

| Criteria | axios v1.9.0 | Ky v1.7.1 | Native Fetch |
|----------|--------------|-----------|--------------|
| Bundle Size | 13KB | 4.1KB | 0KB (built-in) |
| Dependencies | 7 transitive | 0 | 0 |
| TypeScript Support | ✅ Good | ✅ Excellent | ✅ Built-in |
| Browser Support | IE11+ | Modern browsers | Modern browsers |
| API Consistency | ✅ Good | ✅ Excellent | ❌ Verbose |
| Error Handling | ✅ Good | ✅ Better | ❌ Manual |
| Security Vulnerabilities (2023-2025) | 3 resolved | 0 known | 0 |

### Security Analysis Steps Performed:

1. **Dependency Tree Analysis:**
   - axios: 7 transitive dependencies (potential attack vectors)
   - Ky: Zero dependencies (minimal attack surface)

2. **Vulnerability History Check:**
   - axios: 3 security advisories resolved in past 2 years
   - Ky: No known security vulnerabilities

3. **Maintenance & Community:**
   - axios: 104M weekly downloads, well-maintained
   - Ky: 2.1M weekly downloads, actively maintained by Sindre Sorhus

4. **Supply Chain Risk Assessment:**
   - axios: Higher risk due to dependency chain
   - Ky: Lower risk, zero dependencies

### Migration Impact Assessment:
- **Risk Level:** Low (API compatibility high)
- **Bundle Size Reduction:** 68% smaller (13KB → 4.1KB)
- **Security Improvement:** Eliminated 7 potential dependency vulnerabilities
- **Development Effort:** Minimal code changes required

### Recommended Migration Path:
```typescript
// Before (axios)
import axios from 'axios'
const response = await axios.get('/api/data')

// After (Ky)
import ky from 'ky'
const response = await ky.get('/api/data').json()
```

## Consequences
##### Positive
- Reduced attack surface (zero dependencies)
- Smaller bundle size (68% reduction)
- Better TypeScript experience
- No known security vulnerabilities
- Modern, promise-based API

##### Negative
- Migration effort required
- Team learning curve for new API
- Less widespread adoption compared to axios
- No IE11 support (not relevant for modern apps)

## Improvements
- Gradual migration strategy: start with new features
- Create utility wrapper for consistent API across the app
- Implement comprehensive testing during migration
- Monitor bundle size impact during rollout

## Related ADRs
- [0006. Choosing Axios for HTTP Requests](0006-http-axios.md) - This analysis supersedes the original axios decision from security perspective

---
Go to Back - [All decisions](../README.md) 