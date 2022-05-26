export enum LogLevel {
    NONE,
    ERROR,
    WARN,
    INFO,
    DEBUG,
}

export class Logger {
    private static originalConsole = null;
    private static level: LogLevel = LogLevel.WARN;
    private static originalDebugLog: (...args) => void;
    private static originalDebugWarn: (...args) => void;
    private static originalDebugErr: (...args) => void;

    public static init(originalConsole: Console) {
        this.originalConsole = originalConsole;

        // Replace original log methods with placeholders to warn that the migration is needed
        this.originalDebugLog = this.originalConsole.log;
        this.originalDebugWarn = this.originalConsole.warn;
        this.originalDebugErr = this.originalConsole.error;

        this.originalConsole.log = (...args) => {
            this.originalDebugLog.apply(this.originalConsole, ["%cConvert-To-Logger", 'background: #3078c9; color: #FFF; font-weight:bold; padding:5px;', ...args]);
        }
        this.originalConsole.warn = (...args) => {
            this.originalDebugWarn.apply(this.originalConsole, ["%cConvert-To-Logger WARNING", 'background: #3078c9; color: #FFF; font-weight:bold; padding:5px;', ...args]);
        }
        this.originalConsole.error = (...args) => {
            this.originalDebugErr.apply(this.originalConsole, ["%cConvert-To-Logger ERROR", 'background: #3078c9; color: #FFF; font-weight:bold; padding:5px;', ...args]);
        }
    }

    public static log(module: string, ...args: any) {
        if (!this.checkLogLevel(LogLevel.DEBUG)) {
            return;
        }

        // this.originalDebugLog.apply(this.originalConsole, [
        //     "%c" + module.toUpperCase() + "*", 'background: #008730; color: #FFF; font-weight:bold; padding:5px;',
        //     ...args]);

        console.log(module, args);
    }

    public static warn(module: string, ...args: any) {
        this.originalDebugWarn.apply(this.originalConsole, [
            "%c" + module.toUpperCase() + "* WARNING", 'background: #d59100; color: #FFF; font-weight:bold; padding:5px;',
            ...args]);
    }

    public static error(module: string, ...args: any) {
        // this.originalDebugErr.apply(this.originalConsole, [
        //     "%c" + module.toUpperCase() + "* ERROR", 'background: #b30202; color: #FFF; font-weight:bold; padding:5px;',
        //     ...args]);

        console.log(module, args);
    }

    public static setLogLevel(level: LogLevel) {
        if (level < LogLevel.NONE) {
            this.level = LogLevel.NONE;
            return;
        }
        if (level > LogLevel.DEBUG) {
            this.level = LogLevel.DEBUG;
            return;
        }
        this.level = level;
    }

    private static checkLogLevel(level: LogLevel): boolean {
        if (this.level < level) return false;
        return true;
    }
}