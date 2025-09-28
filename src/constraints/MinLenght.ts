import type { Constraint } from './Constraint'

export class MinLength implements Constraint<string> {
  constructor(
    private min: number,
    public message: string = '',
  ) {
    this.message = message || `This field must have at least ${min} characters`
  }

  validate(value: string): boolean {
    return value.length >= this.min
  }
}
