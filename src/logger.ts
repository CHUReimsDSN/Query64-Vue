import { Query64 } from "./query64";

export type TLoggerConfig = {
  enabled: boolean;
  logType: 'warn' | 'error' | 'info';
}

export abstract class Query64Logger {
    static tryLog(code: string, message: string) {
        const loggerConfig = Query64.getLoggerConfig()
        if (loggerConfig.enabled) {
            const messagePrefix = `💣 Query64 Log (code ${code}) : `
            const fullMessage = messagePrefix + message
            switch (loggerConfig.logType) {
                case 'error':
                    console.error(fullMessage)
                    break;
                case 'warn':
                    console.warn(fullMessage)
                    break;
                case 'info':
                    console.info(fullMessage)
                    break;
            }
        }
    }

    static debug(message: string) {
        console.info('Query64 DEBUG ' + message)
    }

    static getDefaultConfig(): TLoggerConfig {
        return {
            enabled: true,
            logType: 'error'
        }
    }
}