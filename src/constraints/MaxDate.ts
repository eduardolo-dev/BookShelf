import type { Constraint } from './Constraint'

export class MaxDate implements Constraint<string | Date> {
  public message: string
  private maxDate: Date

  constructor(maxDate: Date, message?: string) {
    this.maxDate = new Date(maxDate)
    this.maxDate.setHours(0, 0, 0, 0)
    this.message = message || `The date must be prior to ${this.maxDate.toLocaleDateString()}`
  }

  validate(value: string | Date): boolean {
    const date = value instanceof Date ? value : new Date(value)
    date.setHours(0, 0, 0, 0)
    return date <= this.maxDate
  }
}
