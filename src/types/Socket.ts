import * as dgram from 'dgram';
import * as net from 'net';

interface ServerSocket {
    end(): void;
    write(data: Buffer, info: NetworkRequestInfo): void;
    clientWrite(data: Buffer, info: NetworkRequestInfo): void;
    addDataListener(callback: (info: NetworkRequestInfo) => void): void;
    addErrorListener(callback: (error: Error) => void): void;
}

class UDPSocket implements ServerSocket {
    socket: dgram.Socket;

    constructor(socket: dgram.Socket) {
        this.socket = socket;
    }

    listen(ip: string, port: number, callback: () => void): void {
        this.socket.on("listening", callback);
        this.socket.bind(port, ip);
    }

    end(): void {
        this.socket.close();
    }

    write(data: Buffer, info: NetworkRequestInfo): void {
        this.socket.send(data, info.remotePort, info.remoteAddress);
    }

    clientWrite(data: Buffer, info: NetworkRequestInfo): void {
        this.socket.send(data, info.remotePort, info.remoteAddress);
    }

    addDataListener(callback: (info: NetworkRequestInfo) => void): void {
        this.socket.on("message", (msg, rinfo) => {
            const info = {
                data: msg,
                remoteAddress: rinfo.address,
                remotePort: rinfo.port
            }
            callback(info);
        });
    }

    addErrorListener(callback: (error: Error) => void): void {
        this.socket.on("error", callback);
    }


    
}

class TCPSocket implements ServerSocket {
    socket: net.Socket;

    constructor(socket: net.Socket) {
        this.socket = socket;
    }

    end(): void {
        this.socket.end();
    }

    write(data: Buffer, _: NetworkRequestInfo): void {
        this.socket.write(data);
    }

    clientWrite(data: Buffer, _: NetworkRequestInfo): void {
        this.socket.on("connect", () => {
            this.socket.write(data);
        });
    }

    addDataListener(callback: (info: NetworkRequestInfo) => void): void {
        this.socket.on("data", (data) => {
            const info = {
                data: data,
                remoteAddress: this.socket.remoteAddress || "",
                remotePort: this.socket.remotePort || 0
            }
            callback(info);
        });
    }

    addErrorListener(callback: (error: Error) => void): void {
        this.socket.on("error", callback);
    }
}

interface NetworkRequestInfo {
    data: Buffer;
    remoteAddress: string;
    remotePort: number;
}

export { ServerSocket, UDPSocket, TCPSocket, NetworkRequestInfo };