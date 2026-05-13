import { Query64 } from "./query64";

export type TLoggerConfig = {
  enabled: boolean;
  logType: 'warn' | 'error' | 'info';
}

export abstract class Logger {
    static tryLog(message: string) {
        const loggerConfig = Query64.getLoggerConfig()
        if (loggerConfig.enabled) {
            const messagePrefix = 'Query64 LOG : '
            const fullMessage = messagePrefix + message
            switch (loggerConfig.logType) {
                case 'error':
                    console.error(fullMessage)
                case 'warn':
                    console.warn(fullMessage)
                case 'info':
                    console.info(fullMessage)
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