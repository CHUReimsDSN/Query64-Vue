export type TLoggerConfig = {
    enabled: boolean;
    logType: 'warn' | 'error' | 'info';
};
export declare abstract class Query64Logger {
    static tryLog(code: string, message: string): void;
    static debug(message: string): void;
    static getDefaultConfig(): TLoggerConfig;
}
