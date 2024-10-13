enum ResponseStatus {
  Success = 0,
  ParseError = 1,
  InvalidLevelError = 2,
  InvalidSaveError = 3,
  TooLongError = 4,
  InternalError = 5,
}

const responseString = (status: ResponseStatus): string => {
  switch (status) {
    case ResponseStatus.Success:
      return 'Success';
    case ResponseStatus.ParseError:
      return 'Parse error';
    case ResponseStatus.InvalidLevelError:
      return 'Invalid level';
    case ResponseStatus.InvalidSaveError:
      return 'Invalid save';
    case ResponseStatus.TooLongError:
      return 'Too long';
    case ResponseStatus.InternalError:
      return 'Internal error';
    default:
      return 'Unknown error';
  }
}

export { ResponseStatus, responseString };