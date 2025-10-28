import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../src/hooks/useAuth'
import { mockUsers } from '../utils/test-utils'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('should initialize with no user when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should load user from localStorage on initialization', () => {
    const storedUser = JSON.stringify(mockUsers.employee)
    mockLocalStorage.getItem.mockReturnValue(storedUser)

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUsers.employee)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should login user and store in localStorage', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login(mockUsers.admin)
    })

    expect(result.current.user).toEqual(mockUsers.admin)
    expect(result.current.isAuthenticated).toBe(true)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'mockUser',
      JSON.stringify(mockUsers.admin)
    )
  })

  it('should logout user and remove from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUsers.employee))
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('mockUser')
  })

  it('should handle mock MSAL login', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.loginWithMsal()
    })

    expect(result.current.user).toBeTruthy()
    expect(result.current.isAuthenticated).toBe(true)
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  it('should handle corrupted localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json')
    console.error = jest.fn() // Mock console.error

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('mockUser')
  })
})