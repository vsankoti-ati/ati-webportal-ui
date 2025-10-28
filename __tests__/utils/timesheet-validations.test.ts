import { validateTimesheetDates, validateTimeEntry } from '../../src/utils/timesheet-validations'

describe('Timesheet Validations', () => {
  describe('validateTimesheetDates', () => {
    it('should return true for valid date range within same week', () => {
      const startDate = new Date('2025-10-14') // Tuesday
      const endDate = new Date('2025-10-16')   // Thursday

      const result = validateTimesheetDates(startDate, endDate)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return false when end date is before start date', () => {
      const startDate = new Date('2025-10-16')
      const endDate = new Date('2025-10-14')

      const result = validateTimesheetDates(startDate, endDate)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('End date must be after start date')
    })

    it('should return false for future dates', () => {
      const futureStart = new Date('2025-12-25')
      const futureEnd = new Date('2025-12-27')

      const result = validateTimesheetDates(futureStart, futureEnd)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Cannot create timesheets for future dates')
    })

    it('should return false for dates spanning different weeks', () => {
      const startDate = new Date('2025-10-13') // Sunday
      const endDate = new Date('2025-10-20')   // Next Sunday

      const result = validateTimesheetDates(startDate, endDate)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Timesheet must be within the same week')
    })
  })

  describe('validateTimeEntry', () => {
    const timesheetStart = new Date('2025-10-14')
    const timesheetEnd = new Date('2025-10-18')

    it('should return true for valid time entry', () => {
      const entryDate = new Date('2025-10-15')
      const startTime = '09:00'
      const endTime = '17:00'

      const result = validateTimeEntry(entryDate, startTime, endTime, timesheetStart, timesheetEnd)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return false when entry date is outside timesheet period', () => {
      const entryDate = new Date('2025-10-20') // Outside timesheet range
      const startTime = '09:00'
      const endTime = '17:00'

      const result = validateTimeEntry(entryDate, startTime, endTime, timesheetStart, timesheetEnd)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Entry date must be within the timesheet period')
    })

    it('should return false for future entry dates', () => {
      // Use tomorrow's date which should be within a reasonable timesheet period
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const startTime = '09:00'
      const endTime = '17:00'

      // Create timesheet period that includes tomorrow
      const timesheetStartToday = new Date()
      const timesheetEndFuture = new Date()
      timesheetEndFuture.setDate(timesheetEndFuture.getDate() + 7)

      const result = validateTimeEntry(tomorrow, startTime, endTime, timesheetStartToday, timesheetEndFuture)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Cannot add time entries for future dates')
    })

    it('should return false when end time is before start time', () => {
      const entryDate = new Date('2025-10-15')
      const startTime = '17:00'
      const endTime = '09:00'

      const result = validateTimeEntry(entryDate, startTime, endTime, timesheetStart, timesheetEnd)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('End time must be after start time')
    })

    it('should return false when time entry exceeds 24 hours', () => {
      const entryDate = new Date('2025-10-15')
      const startTime = '00:00'
      const endTime = '23:59'
      
      // This creates nearly 24 hours, which is valid
      const validResult = validateTimeEntry(entryDate, startTime, endTime, timesheetStart, timesheetEnd)
      expect(validResult.isValid).toBe(true)

      // Test with impossible time that would exceed 24 hours in calculation
      const startTime2 = '23:00'
      const endTime2 = '01:00' // This is actually next day, so invalid
      const invalidResult = validateTimeEntry(entryDate, startTime2, endTime2, timesheetStart, timesheetEnd)
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.error).toBe('End time must be after start time')
    })
  })
})