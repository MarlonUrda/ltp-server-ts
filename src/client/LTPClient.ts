import { LTPRequest, LTPResponse } from "../types/types";
import net from "node:net";
import dgram from "node:dgram";
import * as conversion from "../conversion/conversion";
import { LogLevel } from "../constants/LogLevel";
import { ResponseStatus } from "../types/ResponseStatus";
import { ServerSocket, TCPSocket, UDPSocket, NetworkRequestInfo } from "../types/Socket";

export class LTPClient {
    serverIP: string;
    serverPort: number;

    constructor(serverIP: string, serverPort: number) {
        this.serverIP = serverIP;
        this.serverPort = serverPort;
    }

    sendTCP(request: LTPRequest, callback: (arg0: LTPResponse) => void) {
        const data = conversion.requestToBytes(request);
        if (data.length > 2048) {
            throw new Error("Message is too long");
        }

        const client = net.createConnection(this.serverPort, this.serverIP);

        client.on("connect", () => {
            client.write(data);
        });

        client.on("data", (data) => {
            try {
                const response = conversion.bytesToResponse(data);
                callback(response);
            } catch (error) {
                console.error("Error", error);
            }
            client.end();
        });

        client.on("error", (error) => {
            console.error("Error", error);
        });
    }

    sendUDP(request: LTPRequest, callback: (arg0: LTPResponse) => void) {
        const data = conversion.requestToBytes(request);
        if (data.length > 2048) {
            throw new Error("Message is too long");
        }

        const socket = dgram.createSocket("udp4");

        socket.on("message", (msg, _) => {
            try {
                const response = conversion.bytesToResponse(msg);
                callback(response);
            } catch (error) {
                console.error("Error", error);
            }
            socket.close();
        });

        socket.send(data, this.serverPort, this.serverIP, (error) => {
            if (error) {
                console.error("Error", error);
            }
        })
    }

    send(request: LTPRequest, callback: (arg0: LTPResponse) => void, connectionType: "tcp" | "udp" = "tcp") {
        const socket = connectionType === "tcp" ? 
            new TCPSocket(net.createConnection(this.serverPort, this.serverIP)) : 
            new UDPSocket(dgram.createSocket("udp4"));

        const data = conversion.requestToBytes(request);

        if (data.length > 2048) {
            throw new Error("Message is too long");
        }

        socket.addDataListener((info) => {
            try {
                const response = conversion.bytesToResponse(info.data);
                callback(response);
            } catch (error) {
                console.error("Error", error);
            }
            socket.end();
        });

        socket.addErrorListener((error) => {
            console.error("Error", error);
        });

        socket.clientWrite(data, {
            data: data,
            remoteAddress: this.serverIP,
            remotePort: this.serverPort
        });
    }
}
