class Errors extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

const ErrInvalidLogLevel = new Errors("invalid log level");
const ErrInvalidResponseStatus = new Errors("invalid response status");
const ErrRequestTooLong = new Errors("request too long");
const ErrInvalidRequest = new Errors("invalid request");

export {
  ErrInvalidLogLevel,
  ErrInvalidResponseStatus,
  ErrRequestTooLong,
  ErrInvalidRequest,
}