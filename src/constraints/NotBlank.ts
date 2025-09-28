// src/constraints/NotBlankConstraint.ts
import type { Constraint } from './Constraint'

export class NotBlank implements Constraint<string> {
  public message: string

  constructor(message = 'This field must not be blank') {
    this.message = message
  }

  validate(value: string): boolean {
    return value.trim().length > 0
  }
}
