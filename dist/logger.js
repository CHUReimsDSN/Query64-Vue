import { Query64 } from "./query64";
export class Logger {
    static tryLog(message) {
        const loggerConfig = Query64.getLoggerConfig();
        if (loggerConfig.enabled) {
            const messagePrefix = 'Query64 LOG : ';
            const fullMessage = messagePrefix + message;
            switch (loggerConfig.logType) {
                case 'error':
                    console.error(fullMessage);
                case 'warn':
                    console.warn(fullMessage);
                case 'info':
                    console.info(fullMessage);
            }
        }
    }
    static debug(message) {
        console.info('Query64 DEBUG ' + message);
    }
    static getDefaultConfig() {
        return {
            enabled: true,
            logType: 'error'
        };
    }
}
