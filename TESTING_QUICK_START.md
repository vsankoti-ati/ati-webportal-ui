# Quick Start - Testing Setup

## Install Dependencies

Run this command to install all testing dependencies:

```bash
npm install --save-dev @testing-library/jest-dom@^6.1.4 @testing-library/react@^13.4.0 @testing-library/user-event@^14.5.1 @types/jest@^29.5.8 jest@^29.7.0 jest-environment-jsdom@^29.7.0
```

## Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

## What's Included

✅ **Complete Jest Configuration**
- Next.js integration
- TypeScript support  
- 70% coverage thresholds
- Module path mapping

✅ **Test Setup & Utilities**
- Material-UI theme provider
- React Query client
- Mock localStorage/router
- Pre-built mock data

✅ **Comprehensive Test Suite**
- **Pages**: login, dashboard, holidays, employee management
- **Components**: Layout, forms, navigation
- **Hooks**: useAuth, custom hooks
- **Services**: API services, mock data
- **Utils**: validation functions

✅ **Testing Documentation**
- Best practices guide
- Troubleshooting tips
- CI/CD integration
- Coverage reporting

## Next Steps

1. **Install dependencies** (command above)
2. **Run tests** to verify setup: `npm test`
3. **Check coverage**: `npm run test:coverage`
4. **Review test files** in `__tests__/` directory
5. **Read full documentation** in `TESTING.md`

## Test File Structure

```
__tests__/
├── components/
│   └── Layout.test.tsx
├── pages/
│   ├── login.test.tsx
│   ├── index.test.tsx
│   └── holidays.test.tsx
├── hooks/
│   └── useAuth.test.ts
├── services/
│   └── employee.test.ts
├── utils/
│   ├── test-utils.tsx
│   └── timesheet-validations.test.ts
```

## Mock Data Available

- `mockUsers` - Admin, Employee, HR users
- `mockEmployee` - Employee records
- `mockTimesheet` - Timesheet data
- `mockHolidays` - Holiday calendar
- `mockJobOpening` - Job listings
- `mockLeave` - Leave requests

The testing framework is production-ready with comprehensive coverage of your ATI Webportal application!