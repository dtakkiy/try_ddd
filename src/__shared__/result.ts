export type DomainError = string;

export type Result<T, E> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  private readonly _value: T;
  type = 'success' as const;

  constructor(value: T) {
    this._value = value;
  }

  public getValue(): T {
    return this._value;
  }

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }
}

export class Failure<T, E> {
  private readonly _value: E;
  type = 'failure' as const;

  constructor(value: E) {
    this._value = value;
  }

  public getValue(): E {
    return this._value;
  }

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return true;
  }
}
