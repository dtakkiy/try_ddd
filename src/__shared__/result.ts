export type NonError = null;
export type DomainError = string;
export type DSError = string;
export type Result<T, E> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  type = 'success' as const;
  constructor(readonly value: T) {}

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }
}

export class Failure<T, E> {
  type = 'failure' as const;
  constructor(readonly err: E) {}

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return true;
  }
}
