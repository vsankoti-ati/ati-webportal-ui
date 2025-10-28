# Mock Data Implementation Documentation

This document explains the comprehensive mock data implementation added to the ATI WebPortal application for development and testing purposes.

## Overview

Mock JSON responses have been implemented for multiple pages including Leave Applications, Job Openings, and Employee Management to display realistic data during development and testing phases without requiring a backend API.

## Role-Based Access Control

The application implements role-based navigation and access control:

### User Roles
- **Admin**: Full access to all features including employee management and timesheet approvals
- **HR**: Access to employee management and timesheet approvals
- **Employee**: Standard user access without administrative features

### Demo Users
1. **Admin User** (`admin@atiwebportal.com` / `admin123`)
   - Role: Admin
   - Access: All features including Timesheet Approvals and Employee Details

2. **Employee User** (`employee@atiwebportal.com` / `emp123`)
   - Role: Employee
   - Access: Standard features excluding administrative functions
   - **Hidden Features**: Timesheet Approvals, Employee Details

### Navigation Behavior
- Admin/HR users see all menu items including "Timesheet Approvals" and "Employee Details"
- Employee users see a filtered menu without administrative options
- Direct URL access to restricted pages shows an access denied message with redirect options

## Mock Data Structure

### Leave Applications Mock Data

The mock data includes 6 sample leave applications with the following structure:

```json
{
  "id": 1,
  "employee_id": 101,
  "from_date": "2025-10-25",
  "to_date": "2025-10-27", 
  "applied_date": "2025-10-15",
  "status": "PENDING",
  "comment": "Personal vacation to visit family",
  "employee": {
    "first_name": "John",
    "last_name": "Doe",
    "email_id": "john.doe@company.com"
  }
}
```

### Leave Balance Mock Data

Mock leave balance data includes different leave types:

```json
{
  "id": 1,
  "employee_id": 101,
  "leave_type": "Annual Leave",
  "leave_balance": 15,
  "employee": {
    "first_name": "John",
    "last_name": "Doe",
    "email_id": "john.doe@company.com"
  }
}
```

## Features Implemented

### 1. Mock Service Layer
- **File**: `src/services/mockLeaveData.ts`
- Simulates API calls with realistic delays (500ms)
- Provides console logging for debugging
- Supports all CRUD operations for leave applications

### 2. Environment-Aware Service
- **File**: `src/services/leave.ts`
- Automatically switches between mock and real API based on environment variables
- Uses mock data when `NEXT_PUBLIC_SKIP_MSAL=true` or in development without API URL

### 3. Enhanced UI Components
- **File**: `src/components/LeaveApplications.tsx`
- Loading states with skeleton placeholders
- Error handling with user-friendly messages
- Mock data information banner
- Improved table formatting and hover effects
- Better status chip colors and styling

### 4. Updated Leave Page
- **File**: `src/pages/leave/index.tsx` 
- Compatible with mock authentication system
- Handles both development and production environments
- Graceful fallbacks for missing data

## Sample Data Overview

### Applications by Status:
- **PENDING**: 3 applications (John Doe, David Brown, Current User)
- **APPROVED**: 2 applications (Jane Smith, Sarah Wilson)  
- **REJECTED**: 1 application (Mike Johnson)

### Applications by Employee:
- **John Doe (ID: 101)**: 2 applications (Personal vacation, Christmas vacation)
- **Jane Smith (ID: 102)**: 1 application (Medical appointment)
- **Mike Johnson (ID: 103)**: 1 application (Holiday celebration) 
- **Sarah Wilson (ID: 104)**: 1 application (Personal emergency)
- **David Brown (ID: 105)**: 1 application (Thanksgiving holiday)

### Leave Balances:
- **Annual Leave**: 15-20 days remaining
- **Sick Leave**: 8-12 days remaining

## How to Access

1. **Start Development Server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/leave`
3. **Mock Banner**: Blue info banner will show "Development Mode: Displaying mock leave application data"

## Environment Variables

The mock system activates when:
- `NEXT_PUBLIC_SKIP_MSAL=true` (explicitly enabled)
- `NODE_ENV=development` AND `NEXT_PUBLIC_API_URL` is not set

## Console Output

When using mock data, you'll see console messages like:
```
MSAL authentication skipped - using mock user
Mock API: Fetching all leave applications
Mock API: Fetching leave balance for employee 101
Using mock data for all applications
Using mock data for leave balance
```

## Interactive Features

### For Regular Users:
- View their own leave applications
- Apply for new leave (creates mock application)
- See leave balances by type

### For Admin/HR Users:
- View all employee applications
- Approve/Reject pending applications
- Update application status with comments

## Production Deployment

In production environments:
1. Set `NEXT_PUBLIC_SKIP_MSAL=false`
2. Provide proper `NEXT_PUBLIC_API_URL`
3. Configure Azure AD authentication
4. Mock data will be automatically disabled

## Testing Scenarios

### Test Cases Covered:
1. **Loading States**: Skeleton loaders during data fetch
2. **Empty States**: "No leave applications found" message
3. **Error Handling**: Error alerts with retry functionality
4. **Admin Actions**: Approve/reject workflow
5. **Form Submissions**: New application creation
6. **Status Updates**: Real-time UI updates after actions

---

## Job Openings Mock Data

### Job Opening Structure

```json
{
  "id": 1,
  "title": "Senior Full Stack Developer",
  "description": "We are seeking a talented Senior Full Stack Developer...",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "employment_type": "Full-time",
  "experience_required": "5+ years",
  "skills_required": ["React", "Node.js", "TypeScript", "PostgreSQL"],
  "responsibilities": [
    "Design and develop scalable web applications",
    "Collaborate with cross-functional teams"
  ],
  "qualifications": [
    "Bachelor's degree in Computer Science",
    "5+ years of experience in full-stack development"
  ],
  "salary_range": "$120,000 - $180,000",
  "is_active": true,
  "created_at": "2025-10-01T08:00:00Z",
  "updated_at": "2025-10-15T10:30:00Z"
}
```

### Sample Job Openings (6 positions):
1. **Senior Full Stack Developer** - Engineering ($120K-$180K)
2. **UX/UI Designer** - Design ($80K-$120K) 
3. **DevOps Engineer** - Engineering ($110K-$160K)
4. **Product Manager** - Product ($130K-$190K)
5. **Marketing Specialist** - Marketing ($55K-$75K)
6. **Data Scientist** - Data & Analytics ($100K-$150K) - *Inactive*

### Job Openings Features:
- **Card Layout**: Responsive grid with job details
- **Department Filtering**: Engineering, Design, Product, Marketing, Data
- **Employment Types**: Full-time, Part-time, Contract, Internship
- **Location Diversity**: San Francisco, Austin, Seattle, New York, Chicago
- **Skills Tracking**: Technical and soft skills for each position
- **Salary Ranges**: Competitive compensation information
- **Status Management**: Active/Inactive job postings

---

## Employee Management Mock Data

### Employee Structure

```json
{
  "id": 101,
  "first_name": "John",
  "last_name": "Doe",
  "role": "Senior Software Engineer",
  "email_id": "john.doe@company.com",
  "address_line_1": "123 Tech Street",
  "address_line_2": "Apt 4B",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94105",
  "phone_number": "(555) 123-4567",
  "hire_date": "2023-01-15",
  "is_active": true,
  "comment": "Excellent performance in React and Node.js development",
  "created_at": "2023-01-15T08:00:00Z",
  "updated_at": "2025-10-15T10:30:00Z"
}
```

### Sample Employees (8 employees):
1. **John Doe** - Senior Software Engineer (Active)
2. **Jane Smith** - UX Designer (Active)
3. **Mike Johnson** - DevOps Engineer (Active)
4. **Sarah Wilson** - Product Manager (Active)
5. **David Brown** - Marketing Manager (Active)
6. **Emily Chen** - Data Scientist (Active)
7. **Robert Taylor** - HR Specialist (Inactive)
8. **Lisa Anderson** - Frontend Developer (Active)

### Employee Management Features:
- **Avatar Generation**: Initials-based profile pictures
- **Contact Information**: Email and phone with formatting
- **Location Tracking**: Full address with city/state
- **Role Management**: Job titles and responsibilities
- **Status Indicators**: Active/Inactive employee status
- **Performance Notes**: Comments and achievements
- **Hire Date Tracking**: Employment history

---

## Mock Service Implementation

### Environment Detection
```typescript
const useMockData = process.env.NEXT_PUBLIC_SKIP_MSAL === 'true' || 
                    process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
```

### Service Functions Available:

#### Job Opening Service:
- `fetchJobOpenings()` - Get all active positions
- `fetchJobOpening(id)` - Get single job details
- `createJobOpening(data)` - Add new position
- `updateJobOpening(id, data)` - Modify existing position
- `deleteJobOpening(id)` - Remove position

#### Employee Service:
- `getAll()` - Get all employees
- `getProfile()` - Get current user profile
- `getById(id)` - Get employee by ID
- `create(employee)` - Add new employee
- `update(id, employee)` - Update employee details
- `delete(id)` - Remove employee

#### Leave Service:
- `getAllApplications()` - Get all leave requests
- `getEmployeeApplications(id)` - Get user's leave requests
- `createApplication(data)` - Submit leave request
- `updateApplicationStatus(id, data)` - Approve/reject requests
- `getLeaveBalance(id)` - Get available leave days

---

## Page Access URLs

### Live Demo Pages:
- **Leave Applications**: `http://localhost:3001/leave`
- **Job Openings**: `http://localhost:3001/job-openings` 
- **Employee Management**: `http://localhost:3001/employee`

### Features Demonstrated:

#### Job Openings Page:
- ✅ Responsive card grid layout
- ✅ Department and role filtering
- ✅ Salary range display
- ✅ Skills and qualifications preview
- ✅ Employment type badges
- ✅ Active/inactive status indicators
- ✅ Creation and posting dates

#### Employee Management Page:
- ✅ Advanced table with avatars
- ✅ Contact information display
- ✅ Role and department organization
- ✅ Location and hire date tracking
- ✅ Active/inactive status management
- ✅ Edit and delete operations
- ✅ Search and filtering capabilities

#### Leave Applications Page:
- ✅ Application status workflow
- ✅ Leave balance tracking
- ✅ Admin approval interface
- ✅ Employee self-service portal
- ✅ Calendar integration

---

## UI Enhancements

### Loading States:
- **Skeleton Loaders**: Animated placeholders during data fetch
- **Progress Indicators**: Circular progress for long operations
- **Shimmer Effects**: Modern loading animations

### Error Handling:
- **User-Friendly Alerts**: Clear error messages with retry options
- **Graceful Degradation**: Fallback content when data fails
- **Console Logging**: Detailed debugging information

### Visual Indicators:
- **Mock Data Banners**: Blue info alerts showing development mode
- **Status Chips**: Color-coded indicators (Green=Active, Red=Inactive)
- **Avatar Generation**: Automatic profile picture creation
- **Hover Effects**: Interactive table rows and cards

---

## Development Features

### Console Output Examples:
```
MSAL authentication skipped - using mock user
Mock API: Fetching job openings
Mock API: Fetching all employees  
Mock API: Creating employee
Using mock data for job openings
Using mock data for employees list
```

### Environment Variables:
```bash
# Development Mode
NEXT_PUBLIC_SKIP_MSAL=true

# Production Mode  
NEXT_PUBLIC_SKIP_MSAL=false
NEXT_PUBLIC_API_URL=https://api.company.com
```

This comprehensive implementation provides a complete development environment for all major application features without requiring backend infrastructure.