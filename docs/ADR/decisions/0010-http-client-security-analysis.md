# 0010. HTTP Client Security Analysis and Recommendations

- **Status:** Proposed
- **Date:** 14.06.2025
- **Author:** Alex Danko

## Context

Security audit identified axios dependency chain risks. Evaluating Ky migration for improved security.

## Decision

Recommend migration from axios to Ky based on security analysis:

### Security Comparison (2025)

| Criteria | axios v1.9.0 | Ky v1.8.1 |
|----------|--------------|-----------|
| Bundle Size | 13.7kB | 3.8KB |
| Dependencies | 3 | 0 |
| Security Vulnerabilities | 9 historical | 0 |
| Supply Chain Risk | High | None |


## Consequences

**Positive:**
- Eliminated dependency vulnerabilities
- Reduced attack surface
- Smaller bundle size

**Negative:**
- Migration effort
- Less widespread adoption

## Migration Strategy

```typescript
// Before (axios)
import axios from 'axios'
const response = await axios.get('/api/data')

// After (Ky)  
import ky from 'ky'
const response = await ky.get('/api/data').json()
```

Start with new features, create wrapper for consistency.

---
Go to Back - [All decisions](../README.md) 