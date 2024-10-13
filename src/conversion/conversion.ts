import * as b64 from "base-64"
import { Request, Response } from "../types/types"
import { contains } from "../helpers/contains"
import { AllLogLevels, LogLevel } from "../constants/LogLevel"
import { ErrInvalidResponseStatus } from "../types/Errors"

const requestToBytes = (req: Request): Uint8Array => {
  const b64EncodedMessage = b64.encode(req.Message)
  const result = `LTP$1.0$${b64EncodedMessage}$${req.Level}$${req.Save}$LTP`
  return new TextEncoder().encode(result)
}

const bytesToRequest = (b: Uint8Array): { req: Request | null, status: ResponseStatus } => {
  const decoded = new TextDecoder().decode(b).split("$")

  if (decoded.length !== 6 || decoded[0] !== "LTP" || decoded[5] !== "LTP"){
    return { req: null, status: ResponseStatus.ParseError }
  }

  const message = b64.decode(decoded[2])

  const level = decoded[3] as LogLevel

  if (!contains(AllLogLevels, level)) {
    return { req: null, status: ResponseStatus.InvalidLevelError }
  }

  if (decoded[4] !== "true" && decoded[4] !== "false"){
    return { req: null, status: ResponseStatus.InvalidSaveError }
  }
  const save = decoded[4] === "true"

  return {
    req: {
      Message: message,
      Level: level,
      Save: save
    },
    status: ResponseStatus.Success
  }
}

const ResponseToBytes = (res: Response): Uint8Array => {
  const b64EncodedMessage = b64.encode(res.Message)
  const result = `LTP$1.0$${b64EncodedMessage}$${res.Status.toString()}$LTP`
  return new TextEncoder().encode(result)
}

const bytesToResponse = (b: Uint8Array): { res: Response | null, error: Error | null } => {
  const invalidResponse = new Error("Invalid response")
  const decoded = new TextDecoder().decode(b).split("$")

  if (decoded.length !== 5){
    return { res: null, error: invalidResponse }
  }

  if (decoded[0] !== "LTP" || decoded[1] !== "1.0" ||decoded[4] !== "LTP"){
    return { res: null, error: invalidResponse }
  }

  const status = parseInt(decoded[3], 10)

  if(isNaN(status)) {
    return { res: null, error: invalidResponse }
  }

  if (status < 0 || status > 5) {
    return { res: null, error: invalidResponse }
  }

  const message = b64.decode(decoded[2])

  return {
    res: {
      Message: message,
      Status: status
    },
    error: null
  }
}

export { requestToBytes, bytesToRequest }