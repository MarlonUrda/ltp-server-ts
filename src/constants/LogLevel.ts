type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR"

const Debug: LogLevel = "DEBUG"
const Info: LogLevel = "INFO"
const Warning: LogLevel = "WARNING"
const Errors: LogLevel = "ERROR"

const AllLogLevels: LogLevel[] = [Debug, Info, Warning, Errors]

export {
  LogLevel,
  AllLogLevels
}