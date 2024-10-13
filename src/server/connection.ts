export interface Socket {
    listen(ip: string, port: number, callback: () => void): void;
}