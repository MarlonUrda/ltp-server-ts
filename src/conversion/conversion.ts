import { LTPRequest, LTPResponse } from "../types/types"
import { contains } from "../helpers/contains"
import { LogLevel } from "../constants/LogLevel"
import { ResponseStatus } from "../types/ResponseStatus"

const requestToBytes = (req: LTPRequest): Buffer => {
  const b64EncodedMessage = Buffer.from(req.message).toString("base64")
  const result = `LTP$1.0$${b64EncodedMessage}$${req.level}$${req.save}$LTP`
  return Buffer.from(result)
}

const bytesToRequest = (b: Uint8Array): [LTPRequest | null, ResponseStatus] => {
  const decoded = new TextDecoder().decode(b).split("$")

  if (decoded.length !== 6 || decoded[0] !== "LTP" || decoded[5] !== "LTP"){
    throw [null, ResponseStatus.ParseError]
  }

  const message = Buffer.from(decoded[2], "base64").toString()


  if (!contains(Object.values(LogLevel), decoded[3])){
    return [null, ResponseStatus.InvalidLevelError]
  }

  const level = decoded[3] as LogLevel

  if (decoded[4] !== "true" && decoded[4] !== "false"){
    return [null, ResponseStatus.InvalidSaveError]
  }
  const save = decoded[4] === "true"

  return [{
    message: message,
    level: level,
    save: save
  }, ResponseStatus.Success]
}

const responseToBytes = (res: LTPResponse): Buffer => {
  const b64EncodedMessage = Buffer.from(res.message).toString("base64")
  const result = `LTP$1.0$${b64EncodedMessage}$${res.status.toString()}$LTP`
  return Buffer.from(result)
}

const bytesToResponse = (b: Uint8Array): LTPResponse => {
  const invalidResponse = new Error("Invalid response")
  const decoded = new TextDecoder().decode(b).split("$")

  if (decoded.length !== 5){
    throw new Error("Invalid response")
  }

  if (decoded[0] !== "LTP" || decoded[1] !== "1.0" ||decoded[4] !== "LTP"){
    throw new Error("Invalid response")
  }

  const status = parseInt(decoded[3], 10)

  if(isNaN(status)) {
    throw new Error("Invalid response")
  }

  if (status < 0 || status > 5) {
    throw new Error("Invalid response")
  }

  const message = Buffer.from(decoded[2], "base64").toString()

  return {
      message: message,
      status: status
    }
  }

export { requestToBytes, bytesToRequest, responseToBytes, bytesToResponse }