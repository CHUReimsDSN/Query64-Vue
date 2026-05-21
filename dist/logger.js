import { Query64 } from "./query64";
export class Query64Logger {
    static tryLog(code, message) {
        const loggerConfig = Query64.getLoggerConfig();
        if (loggerConfig.enabled) {
            const messagePrefix = `Query64 Log (code ${code}) : `;
            const fullMessage = messagePrefix + message;
            switch (loggerConfig.logType) {
                case 'error':
                    console.error(fullMessage);
                    break;
                case 'warn':
                    console.warn(fullMessage);
                    break;
                case 'info':
                    console.info(fullMessage);
                    break;
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
