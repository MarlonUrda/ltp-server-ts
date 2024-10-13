import { LTPClient } from "../client/LTPClient";
import { LogLevel } from "../constants/LogLevel";

const client = new LTPClient("localhost", 8080);

client.send({
    message: "Hello from UDP $$$",
    save: true,
    level: LogLevel.Errors
}, (res) => {
    console.log(res);
}, "udp");

client.send({
    message: "Hello from TCP",
    save: true,
    level: LogLevel.Errors
}, (res) => {
    console.log(res);
}, "tcp");