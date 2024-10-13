import { LogLevel } from "../constants/LogLevel"
import { ResponseStatus } from "./ResponseStatus"

export interface LTPResponse {
  message: string,
  status: ResponseStatus,
}

export interface LTPRequest {
  message: string,
  save: boolean
  // level should be any of the values in LogLevelEnum
  level: LogLevel

}