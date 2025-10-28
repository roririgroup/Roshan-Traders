# TODO: Fix BigInt Serialization Error

## Problem
- Error: "TypeError: Do not know how to serialize a BigInt" occurs when Express tries to JSON.stringify responses containing BigInt values from Prisma.
- This affects API endpoints like /api/admins/approved-users, /api/agents, /api/manufacturers, etc.

## Root Cause
- Prisma schema uses BigInt for IDs (e.g., User.id, Agent.id, Manufacturer.id).
- JavaScript's JSON.stringify cannot serialize BigInt values directly.
- When res.json() is called, it fails on BigInt fields.

## Solution
- Convert all BigInt ID fields to strings in service layer responses.
- Apply this fix to all affected services: admin.service.js, agent.service.js, manufacturer.service.js, and any others returning BigInt IDs.

## Steps
- [ ] Modify admin.service.js getApprovedUsers to convert BigInt IDs to strings
- [ ] Modify agent.service.js functions to convert BigInt IDs to strings
- [ ] Modify manufacturer.service.js functions to convert BigInt IDs to strings
- [ ] Test the affected API endpoints to ensure they return valid JSON
- [ ] Verify frontend components (SignUpApprovalPage, AgentsPage, ManufacturesPage) work correctly

## Files to Edit
- server/src/modules/admin/admin.service.js
- server/src/modules/agent/agent.service.js
- server/src/modules/manufacturer/manufacturer.service.js
