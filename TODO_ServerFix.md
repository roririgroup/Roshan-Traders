# TODO: Fix Server Compilation Errors

## Steps to Complete:

1. [x] Edit server/src/modules/scan/scan.route.ts: Replace `module.exports = router;` with `export default router;`
2. [x] Edit server/src/modules/purchase/purchase.route.ts: Replace `module.exports = router;` with `export default router;`
3. [x] Edit server/src/modules/transaction/transaction.route.ts: Replace `module.exports = router;` with `export default router;`
4. [x] Edit server/src/modules/token/token.route.ts: Replace `module.exports = router;` with `export default router;`
5. [x] Edit server/src/modules/user/[userId]/orderhistory.route.ts: Replace `module.exports = router;` with `export default router;`
6. [x] Test the server: Run `cd server && npm run dev` to verify no compilation errors and server starts successfully.
7. [x] Fix server/src/modules/scan/scan.service.ts: Update query and return to match Prisma schema.
8. [x] Test the server again after fixing scan.service.ts.
