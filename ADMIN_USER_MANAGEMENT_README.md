# Admin User Management - Implementation Guide

## Overview
The Admin User Management feature is now fully functional. It allows admins to view, search, filter, and manage all users in the system based on their `userType` (candidate, college, company) and status (active, pending, blocked).

## Features Implemented

### 1. **Backend API Endpoints** (`/api/admin/users-*`)

#### Get Users Board Overview
- **Endpoint**: `POST /api/admin/users-board`
- **Authentication**: Admin only
- **Request Body**:
  ```json
  {
    "page": 1,
    "limit": 10,
    "search": "search term",
    "userType": "all|candidate|college|company",
    "status": "all|active|pending|blocked"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalUsers": 50,
        "usersPerPage": 10
      },
      "statistics": {
        "all": { "total": 50, "active": 30, "pending": 15, "blocked": 5 },
        "companies": { "total": 10, "active": 8, "pending": 1, "blocked": 1 },
        "colleges": { "total": 8, "active": 5, "pending": 2, "blocked": 1 },
        "candidates": { "total": 32, "active": 17, "pending": 12, "blocked": 3 }
      }
    }
  }
  ```

#### Update User Status
- **Endpoint**: `PATCH /api/admin/users/:userId/status`
- **Request Body**:
  ```json
  {
    "status": "active|pending|blocked"
  }
  ```

#### Delete User
- **Endpoint**: `DELETE /api/admin/users/:userId`

### 2. **Frontend Features** (`adminUserManagement.jsx`)

#### Statistics Cards
- Displays real-time counts for:
  - Candidates (total, active, pending, blocked)
  - Colleges (total, active, pending, blocked)
  - Companies (total, active, pending, blocked)

#### Search & Filter
- **Search**: By user name or email (case-insensitive)
- **Filter by Type**: All, Candidates, Colleges, Companies
- **Filter by Status**: All, Active, Pending, Blocked
- Filters work together and update results in real-time

#### User Table
- Displays paginated list of users
- Shows: Name, Email, User Type (with icon), Status (with color), Registered Date, Last Active Date
- **10 users per page** (configurable via `ITEMS_PER_PAGE` constant)
- Responsive design (mobile-friendly)

#### Actions
- **Status Dropdown**: Change user status to active, pending, or blocked
- **Delete Button**: Permanently delete a user (with confirmation)

#### Pagination
- Previous/Next buttons
- Page indicator showing current page and total pages
- Total user count display

### 3. **User Types Classification**

The system distinguishes users by `userType` field in the Auth model:

| User Type | Category | Icon |
|-----------|----------|------|
| `candidate` | Candidate | UserCheck |
| `student` | Candidate | UserCheck |
| `fresher` | Candidate | UserCheck |
| `professional` | Candidate | UserCheck |
| `employer` | Candidate | UserCheck |
| `college` | College | Building2 |
| `company` | Company | Briefcase |
| `admin` | Admin | - |

### 4. **Status Colors**
- **Active** (Green): `bg-green-100 text-green-700`
- **Pending** (Yellow): `bg-yellow-100 text-yellow-700`
- **Blocked** (Red): `bg-red-100 text-red-700`

## Files Modified

### Backend
1. **`/BackEnd/src/controllers/admin/userManagementController.js`**
   - Added `getUserBoardOverView()` - Main function to fetch users with filters
   - Added `updateUserStatus()` - Change user status
   - Added `deleteUser()` - Delete user from system

2. **`/BackEnd/src/routes/admin/userManagementRoutes.js`**
   - Added POST `/users-board` route
   - Added PATCH `/users/:userId/status` route
   - Added DELETE `/users/:userId` route
   - Added GET `/user-status` route

### Frontend
3. **`/FrontEnd/src/pages/admin/adminPages/adminUserManagement.jsx`**
   - Complete rewrite with functional components
   - Added state management for users, filters, pagination
   - Integrated API calls with axios
   - Added search and filter functionality
   - Added real-time statistics
   - Added user actions (status change, delete)
   - Added toast notifications for feedback

## Usage

### For Admin Users
1. Navigate to **Admin Panel** → **User Management**
2. **View Users**: All users load automatically with pagination
3. **Search**: Enter name or email in search box
4. **Filter**:
   - Select user type (Candidates, Colleges, Companies)
   - Select status (Active, Pending, Blocked)
5. **Change Status**: Click checkmark button → select new status
6. **Delete User**: Click trash button → confirm deletion

### For Developers
All API endpoints are protected with `adminAuth` middleware. Ensure admin user is logged in and has valid JWT token.

Example request:
```javascript
const response = await axios.post(
  `${API_URL}/api/admin/users-board`,
  {
    page: 1,
    limit: 10,
    search: "",
    userType: "all",
    status: "all"
  },
  {
    headers: {
      Authorization: `Bearer ${adminToken}`
    },
    withCredentials: true
  }
);
```

## Key Components

### Backend
- **Model**: `Auth` (MongoDB collection with `userType` and `status` fields)
- **Service**: `authService.js` (provides `getStatusCountByUserType()`)
- **Middleware**: `adminMiddleware.js` (JWT verification)

### Frontend
- **Context**: `AdminProvider` (manages admin auth and token)
- **Component**: `UserManagement` (React functional component)
- **Hooks**: `useState`, `useEffect` for state management
- **Library**: `axios` for API calls, `react-hot-toast` for notifications

## Error Handling
- Network errors are caught and displayed as toast notifications
- Unauthorized requests return 401 status
- Invalid statuses return 400 status
- User not found returns 404 status
- Server errors return 500 status

## Performance Considerations
- Pagination (10 items per page) prevents loading large datasets
- Database queries use `.select("-password")` to exclude sensitive data
- Filters are applied at database level (not in-memory)
- Statistics are fetched in parallel using `Promise.all()`

## Future Enhancements
- Add bulk operations (bulk status change, bulk delete)
- Add user detail view/edit modal
- Add export to CSV functionality
- Add advanced filters (registration date range, etc.)
- Add user activity logs
- Add role-based permissions
