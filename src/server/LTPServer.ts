import { LTPRequest } from "../types/types";
import net from "node:net";
import dgram from "node:dgram";
import * as conversion from "../conversion/conversion";
import { LogLevel } from "../constants/LogLevel";
import { ResponseStatus } from "../types/ResponseStatus";
import { ServerSocket, TCPSocket, UDPSocket, NetworkRequestInfo } from "../types/Socket";

export class LTPServer {
    address: string;
    port: number;
    formatter: (arg0: LTPRequest) => string;
    writter: (arg0: string) => void;
    socket: ServerSocket | undefined;
    constructor(
        address: string,
        port: number,
        formatter: (arg0: LTPRequest) => string = defaultFormatter,
        writter: (arg0: string) => void = console.log,
    ) {
        this.address = address;
        this.port = port;
        this.formatter = formatter;
        this.writter = writter;


    }

    startTCP() {

        const server = net.createServer((socket) => {
            const tcpSocket = new TCPSocket(socket);
            tcpSocket.addDataListener((info) => {
                this.handleConnection(tcpSocket, info);
            });
        });

        server.listen(this.port, this.address, () => {
            console.log("TCPServer started on", this.address, this.port);
        });

    }

    startUDP() {
        const socket = dgram.createSocket("udp4");

        const udpSocket = new UDPSocket(socket);

        udpSocket.addDataListener((info) => {
            this.handleConnection(udpSocket, info);
        });

        socket.on("listening", () => {
            const address = socket.address();
            console.log("UDPServer started on", address.address, address.port);
        });

        socket.bind(this.port, this.address);
    }
    

    handleConnection(socket: ServerSocket, info: NetworkRequestInfo) {
        console.log("Client connected from", info.remoteAddress, info.remotePort);

        // make sure data lenght is less that 2048 bytes
        if (info.data.length > 2048) {
            console.log("Data too long, closing connection");
            socket.end();
            return;
        }

        // convert bytes to request
        const [req, status] = conversion.bytesToRequest(info.data);

        if (req === null) {
            console.log("Invalid request, closing connection");
            const invalidRequest = {
                message: "Invalid request",
                status: status,
                level: LogLevel.Errors,
                save: false
            };

            console.log(this.formatter(invalidRequest));
            socket.write(conversion.responseToBytes({
                message: "Invalid request",
                status: status
            }), info);
            return;
        }

        const message = this.formatter(req);

        if (req.save) {
            this.writter(message);            
        } else {
            console.log(message);
        }

        const response = {
            message: "Success",
            status: ResponseStatus.Success
        }

        socket.write(conversion.responseToBytes(response), info);
        
    }
}

function defaultFormatter(req: LTPRequest) {
    return `${new Date().toUTCString()} - ${req.level} - ${req.message}\n`;
}