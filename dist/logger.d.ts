export type TLoggerConfig = {
    enabled: boolean;
    logType: 'warn' | 'error' | 'info';
};
export declare abstract class Logger {
    static tryLog(message: string): void;
    static debug(message: string): void;
    static getDefaultConfig(): TLoggerConfig;
}
