import { LogLevel } from "../constants/LogLevel"

export interface Response {
  Message: string,
  Status: ResponseStatus,
}

export interface Request {
  Message: string,
  Level: LogLevel
  Save: boolean
}