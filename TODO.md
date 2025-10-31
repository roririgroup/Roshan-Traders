# Task: Remove Mock Data from ManufacturesDetailsPage Employees Tab and Integrate with Database

## Current Status
- [x] Analyzed ManufacturesDetailsPage.jsx and identified mock employee data
- [x] Reviewed manufacturer_employee API endpoints and service
- [x] Understood database schema for manufacturer_employee table

## Plan
- [ ] Add state management for employees data in ManufacturesDetailsPage.jsx
- [ ] Create API call function to fetch employees for the manufacturer
- [ ] Replace hardcoded employee list with dynamic data from API
- [ ] Update employee count display to use real data
- [ ] Add loading and error handling for employees tab
- [ ] Test the integration

## Files to Edit
- client/src/user/superadmin/Manufactures/components/ManufacturesDetailsPage.jsx

## API Endpoint
- GET /api/manufacturer/:manufacturerId/employees
- Returns: { success: true, data: [employees] }
- Employee object: { id, manufacturerId, name, address, phone, role, status, joinDate, createdAt, updatedAt }
