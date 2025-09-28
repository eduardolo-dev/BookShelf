export interface Constraint<T = unknown> {
  validate(value: T): boolean
  message: string
}
