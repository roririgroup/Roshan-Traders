# Order Assignment Feature Implementation

## Current Status
- [x] Plan approved by user
- [ ] Database schema updates
- [ ] Manufacturer dashboard changes
- [ ] Truck Owner dashboard changes
- [ ] API endpoints implementation
- [ ] UI components creation
- [ ] Testing and verification

## Detailed Steps

### 1. Database Schema Updates
- [x] Add `assignedTruckOwnerId` field to Order model in schema.prisma
- [x] Run database migration

### 2. Manufacturer Dashboard Changes
- [x] Modify Outsource Orders table in Orders.jsx to show "Assign" button for confirmed orders
- [ ] Add dropdown/modal to select from available Truck Owners
- [ ] Update order status and assignment on selection
- [ ] Add API call to fetch available Truck Owners

### 3. Truck Owner Dashboard Changes
- [x] Add "Orders" menu to Truck Owner sidebar in Sidebar.jsx
- [x] Add Orders route in TruckOwner.jsx
- [x] Create Orders.jsx page for Truck Owner dashboard
- [x] Display assigned orders in "Outsource Orders" section

### 4. API Endpoints
- [ ] Add endpoint to fetch available Truck Owners
- [ ] Add endpoint to assign order to Truck Owner
- [ ] Add endpoint to fetch assigned orders for Truck Owner

### 5. Testing
- [ ] Test assignment functionality from Manufacturer side
- [ ] Test orders display on Truck Owner side
- [ ] Verify role-based access
- [ ] Test error handling

## Files to be created/modified:
- server/prisma/schema.prisma
- client/src/user/manufactures/dashboard/Orders.jsx
- client/src/components/Sidebar/Sidebar.jsx
- client/src/user/truck owners/TruckOwner.jsx
- client/src/user/truck owners/dashboard/Orders.jsx (new)
- Server route files for API endpoints
