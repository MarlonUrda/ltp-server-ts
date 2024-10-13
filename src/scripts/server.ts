import { LTPServer } from "../server/LTPServer";
import fs from "node:fs";


const writeToFile = (data: string) => {
    fs.appendFile("log.txt", data, (err) => {
        if (err) {
            console.error("Error", err);
        }
    });
}

const server = new LTPServer("localhost", 8080, undefined, writeToFile);

server.startUDP();
server.startTCP();