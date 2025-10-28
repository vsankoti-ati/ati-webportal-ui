# Testing Documentation

## Overview
This project uses Jest and React Testing Library for unit testing. The test suite covers:
- Pages (login, dashboard, employee management, etc.)
- Components (Layout, forms, lists, etc.)
- Hooks (useAuth, custom hooks)
- Services (API services, mock data)
- Utilities (validation, helpers)

## Setup

### Install Dependencies
```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch)
npm run test:ci
```

## Test Structure

### Test Files Organization
```
__tests__/
├── components/          # Component tests
│   ├── Layout.test.tsx
│   ├── AuthProvider.test.tsx
│   ├── EmployeeForm.test.tsx
│   └── ...
├── pages/              # Page tests
│   ├── login.test.tsx
│   ├── index.test.tsx
│   ├── profile.test.tsx
│   └── ...
├── hooks/              # Hook tests
│   ├── useAuth.test.ts
│   ├── useConfirm.test.ts
│   └── ...
├── services/           # Service tests
│   ├── employee.test.ts
│   ├── timesheet.test.ts
│   ├── leave.test.ts
│   └── ...
└── utils/              # Test utilities
    └── test-utils.tsx
```

### Test Categories

#### 1. Page Tests
- Verify page rendering with different user roles
- Test navigation and routing
- Test form submissions and validations
- Test error states and loading states

#### 2. Component Tests
- Test component rendering with various props
- Test user interactions (clicks, form inputs)
- Test conditional rendering based on props/state
- Test accessibility

#### 3. Hook Tests
- Test custom hook functionality
- Test state changes and side effects
- Test error handling
- Test cleanup

#### 4. Service Tests
- Test API calls and responses
- Test mock data fallbacks
- Test error handling
- Test data transformations

## Testing Utilities

### Custom Render Function
The `test-utils.tsx` provides a custom render function that includes all necessary providers:
- Material-UI ThemeProvider
- React Query QueryClient
- CssBaseline

### Mock Data
Pre-defined mock objects for consistent testing:
- `mockUsers` - Admin, Employee, HR users
- `mockEmployee` - Employee data
- `mockTimesheet` - Timesheet data
- `mockHolidays` - Holiday data
- `mockJobOpening` - Job opening data
- `mockLeave` - Leave request data

### Mocked Dependencies
- Next.js Router
- Material-UI useMediaQuery
- localStorage/sessionStorage
- Console methods
- Environment variables

## Writing Tests

### Basic Test Example
```typescript
import { render, screen, fireEvent } from '../utils/test-utils'
import MyComponent from '../../src/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    const mockHandler = jest.fn()
    render(<MyComponent onAction={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockHandler).toHaveBeenCalled()
  })
})
```

### Testing with Authentication
```typescript
const mockUseAuth = jest.fn()

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('Authenticated Component', () => {
  it('renders for admin user', () => {
    mockUseAuth.mockReturnValue({
      user: mockUsers.admin,
      isAuthenticated: true,
      isLoading: false,
    })
    
    render(<AuthenticatedComponent />)
    
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
```

### Testing API Services
```typescript
import { apiService } from '../../src/services/api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('API Service', () => {
  it('fetches data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockData })
    
    const result = await apiService.getData()
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/data')
    expect(result).toEqual(mockData)
  })
})
```

## Coverage Requirements

Target coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

Coverage exclusions:
- Type definition files (*.d.ts)
- Next.js app files (_app.tsx, _document.tsx)
- Type-only files in /types directory

## Best Practices

### 1. Test Naming
- Use descriptive test names that explain what is being tested
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Test Organization
- Group related tests using `describe` blocks
- Use `beforeEach`/`afterEach` for setup and cleanup
- Keep tests focused and atomic

### 3. Assertions
- Use specific assertions (`toBeInTheDocument` vs `toBeTruthy`)
- Test user-visible behavior, not implementation details
- Use `screen.getByRole` for better accessibility testing

### 4. Mocking
- Mock external dependencies (APIs, libraries)
- Mock at the module level for consistency
- Clear mocks between tests

### 5. Async Testing
- Use `waitFor` for async assertions
- Use `findBy` queries for elements that appear asynchronously
- Test loading and error states

### 6. User Events
- Use `@testing-library/user-event` for more realistic interactions
- Test keyboard navigation and accessibility
- Test form validation and submission

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v1
```

### Pre-commit Hooks
Add to package.json:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci && npm run lint"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure test files are in `__tests__` directory or have `.test.` or `.spec.` in filename
2. **Mock Issues**: Clear mocks between tests and check mock implementation
3. **Async Issues**: Use proper async testing patterns with `waitFor` and `findBy`
4. **Material-UI Issues**: Ensure theme provider is included in test render
5. **Router Issues**: Mock Next.js router appropriately for each test

### Debug Tips
- Use `screen.debug()` to see rendered HTML
- Use `screen.logTestingPlaygroundURL()` for query suggestions
- Add `--verbose` flag to see individual test results
- Use `--detectOpenHandles` to find async issues