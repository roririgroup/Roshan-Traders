# Agent Dashboard Implementation TODO

## Overview
Implement an Agent Dashboard with sidebar navigation including Dashboard, Products, Orders, Payment Report, Profile, and Reports pages. Each page has specific UI and functionality requirements.

## Client-Side Implementation

### 1. Create Dashboard Pages Structure
- [x] Create `client/src/user/agents/dashboard/` folder
- [x] Create `Dashboard.jsx` - Key stats cards (Total Products, Total Orders, Today's Revenue, Monthly Revenue) with icons
- [x] Create `Products.jsx` - Add product form (Name, Price, Description, Image), list products with "Add to Cart" buttons
- [x] Create `Orders.jsx` - List orders with status (Pending/Confirmed), confirm orders
- [x] Create `PaymentReport.jsx` - Display Total Amount, Pending Amount, Paid Amount
- [x] Create `Profile.jsx` - Editable profile form (Name, Email, Phone, Address, Bank/UPI Details)
- [x] Create `Reports.jsx` - Charts/graphs for Daily/Weekly/Monthly Reports (Orders trend, Revenue trend)

### 2. Update Routing
- [x] Modify `client/src/routes/AppRoutes.jsx` to add nested routes under `/agents` for dashboard pages
- [x] Ensure protected routes for agent dashboard

### 3. Update Sidebar Navigation
- [x] Modify `client/src/components/Sidebar/Sidebar.jsx` to add collapsible sidebar with agent-specific navigation links
- [x] Add icons for each section (Dashboard, Products, Orders, Payment Report, Profile, Reports)

### 4. Implement UI Components
- [ ] Use existing UI components (Card, Button, Badge, etc.) from `client/src/components/ui/`
- [ ] Ensure responsive design (desktop & mobile)
- [ ] Implement clean, modern design with cards, tables, and charts

### 4.1 Update PaymentReport.jsx
- [x] Remove summary cards, payment methods, and payment status sections
- [x] Add "Payment" button above the payment details table
- [x] Implement modal for payment input (total amount display, paid amount input, submit to update pending amount)
- [x] Update payment details table to reflect pending amount changes after payment submission

### 5. Add State Management and API Integration
- [ ] Implement state for current page navigation within dashboard
- [ ] Add API calls to backend for:
  - Fetching agent products
  - Creating/updating products
  - Fetching orders
  - Confirming orders
  - Fetching payment reports
  - Updating profile
  - Fetching reports data
- [ ] Handle loading states and error handling

## Server-Side Implementation

### 6. Verify/Extend Product APIs
- [ ] Ensure `server/src/modules/product/product.route.ts` supports agent-specific product management
- [ ] Add filtering by agent ID if needed

### 7. Verify/Extend Transaction/Order APIs
- [ ] Ensure `server/src/modules/transaction/transaction.route.ts` supports order creation and status updates
- [ ] Add order confirmation endpoint if missing

### 8. Add Payment Report APIs
- [ ] Create new routes for payment reports based on confirmed orders
- [ ] Implement logic to calculate Total Amount, Pending Amount, Paid Amount

### 9. Extend User APIs for Profile
- [ ] Ensure profile update functionality in `server/src/modules/user/user.route.ts`

### 10. Add Reports APIs
- [ ] Create endpoints for generating daily/weekly/monthly reports
- [ ] Implement data aggregation for orders and revenue trends

## Testing and Integration

### 11. Test Functionality
- [ ] Test product addition and listing
- [ ] Test order placement and confirmation
- [ ] Test payment report updates
- [ ] Test profile editing
- [ ] Test reports generation

### 12. Ensure Responsiveness
- [ ] Test on desktop and mobile layouts
- [ ] Verify sidebar collapse/expand functionality

### 13. Final Integration
- [ ] Ensure all pages link correctly
- [ ] Verify data flow between pages (e.g., products to orders to payments)
- [ ] Test end-to-end workflow
