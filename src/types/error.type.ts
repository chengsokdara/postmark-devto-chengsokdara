export class NoContentError extends Error {
  constructor(message = "No content") {
    super(message);
    this.name = "NoContentError";
  }
}

export class PreconditionError extends Error {
  constructor(message = "Precondition Failed") {
    super(message);
    this.name = "PreconditionError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class UnknownError extends Error {
  constructor(message = "Unknown") {
    super(message);
    this.name = "UnknownError";
  }
}

export class UnprocessableError extends Error {
  constructor(message = "Unprocessable Entity") {
    super(message);
    this.name = "UnprocessableError";
  }
}

export class UnsupportedError extends Error {
  constructor(message = "Unsupported Media Type") {
    super(message);
    this.name = "UnsupportedError";
  }
}

export class ValidationError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "ValidationError";
  }
}
