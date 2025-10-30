# Dashboard Stats Implementation

## Backend Changes
- [x] Add `getDashboardStats` function to `server/src/modules/admin/admin.service.js`
- [x] Add GET route `/stats` to `server/src/modules/admin/admin.route.js`

## Frontend Changes
- [x] Remove "Reports" and "Available Bricks" StatCard components from `client/src/user/superadmin/DashboradPage/DashboradPage.jsx`
- [x] Replace hardcoded stats object with API call to fetch real data
- [x] Update remaining StatCard components to use fetched data

## Testing
- [ ] Test the API endpoint to ensure it returns correct counts
- [ ] Verify the dashboard displays real data after changes
