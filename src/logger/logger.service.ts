import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs'
import * as path from 'path'


@Injectable()
export class LoggerService extends ConsoleLogger {

    async logToFile(entry: any) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'America/New_York'
        }).format(new Date())} - ${entry}\n`;

        try {
            if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
                await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
            }
            await fsPromises
                .appendFile(
                    path.join(__dirname, '..', '..', 'logs', 'myLogFile.log'), formattedEntry
                )

        } catch (e) {
            if (e instanceof Error) console.error(e.message)
        }
    }

    log(message: any, context?: string) {
        const entryMessage = `[${context}] \t ${message}`;
        super.log(message, context);
        this.logToFile(entryMessage)
    }

    error(message: any, stackOrContext?: string | Error) {
        const entryMessage = `[${stackOrContext}] \t ${message}`;
        super.error(message, stackOrContext)
        this.logToFile(entryMessage)
    }

    warn(message: any, context?: string) {
        const entryMessage = `[${context}] \t ${message}`;
        super.warn(message, context);
        this.logToFile(entryMessage)
    }

    debug(message: any, context?: string) {
        const entryMessage = `[${context}] \t ${message}`;
        super.debug(message, context);
        this.logToFile(entryMessage)
    }

    verbose(message: any, context?: string) {
        const entryMessage = `[${context}] \t ${message}`;
        super.verbose(message, context);
        this.logToFile(entryMessage)
    }


}
