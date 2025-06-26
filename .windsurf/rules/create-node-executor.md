---
trigger: manual
---

Creating a Node Executor

1. Create Executor Class
- Create new executor in `backend/src/services/nodes/executors` directory
- Use `HttpNodeExecutor.ts` as reference
- Name it as `[Name]NodeExecutor.ts`
- Implement required executor interface/methods

2. Register in Factory
- Import executor in `NodeExecutorFactory.ts`:
  ```typescript
  import { YourNewNodeExecutor } from './executors/YourNewNodeExecutor.js';
  ```

- Add to executors Map: `backend/src/services/nodes/NodeExecutorFactory.ts`
```typescript
private static executors = new Map([
  ['your-node-type', new YourNewNodeExecutor()]
]);
```
3. Define Types
- Add types in backend/src/services/nodes/types.ts
- Define input/output types and config interfaces

Best Practices:

- Implement all required NodeExecutor interface methods
- Follow error handling patterns
- Add documentation for complex logic