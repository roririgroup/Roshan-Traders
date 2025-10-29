# TODO: Update Login System for User Approval

## Backend Changes
- [ ] Add `checkUserStatus` function in `server/src/modules/admin/admin.service.js`
- [ ] Add GET `/api/admins/check-user-status/:phone` endpoint in `server/src/modules/admin/admin.route.js`

## Frontend Changes
- [ ] Update `client/src/pages/Login/components/UserLogin.jsx` to call the new API endpoint
- [ ] Remove localStorage mock data usage ('approvedUsers', 'pendingUsers')
- [ ] Handle different user statuses (APPROVED, PENDING, REJECTED) with appropriate messages

## Testing
- [ ] Test login with approved user
- [ ] Test login with pending user (should show pending message)
- [ ] Test login with rejected user (should show rejected message)
- [ ] Test login with non-existent user (should show signup message)
