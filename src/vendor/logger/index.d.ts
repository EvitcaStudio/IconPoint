/** A small library to class up log messages.
 * @author https://github.com/doubleactii
 * @license Logger does not have a license at this time. For licensing contact the author
 */
/**
 * The Logger class.
 * A small library to class up log messages.
 * @example
 * ```typescript
 * import { Logger } from './logger.min.js';
 * const logger = new Logger();
 * logger.registerType('EXAMPLE', logger.FG_BLUE);
 * logger.prefix('EXAMPLE').log('Logger started');
 * // Assert example
 * const a = 10, b = 5;
 * logger.assert(a % b == 1, 'error at a%b==1');
 * logger.assert(a > b, 'error at a>b');
 * logger.assert(b > a, 'error at b>a');
 * // Counter example
 * for (let i = 0; i < 4; i ++) {
 * 	logger.count('Example Label');
 * }
 * logger.countReset('Example Label');
 * logger.count('Example Label');
 * // Debug example
 * logger.debug('Debug example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').debug('Debug example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * // Error example
 * logger.error('Error example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').error('Error example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * // Warn example
 * logger.warn('Warn example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').warn('Warn example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * // Info example
 * logger.info('Info example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').info('Info example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * // Log example
 * logger.log('Log example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * logger.prefix('EXAMPLE').log('Log example', 1, true, [1, 2], { foo: 1, bar: 2 });
 * // Group example
 // group and groupCollapsed are interchangeable
 * logger.prefix('EXAMPLE').log("This is the outer level");
 * logger.prefix('EXAMPLE').groupCollapsed('Example Label2');
 * logger.prefix('EXAMPLE').prefix('EXAMPLE').log("Level 2");
 * logger.prefix('EXAMPLE').groupCollapsed('Example Label3');
 * logger.prefix('EXAMPLE').log("Level 3");
 * logger.prefix('EXAMPLE').warn("More of level 3");
 * logger.groupEnd(); // No label needed for groupEnd in standard console
 * logger.prefix('EXAMPLE').log("Back to level 2");
 * logger.groupEnd(); // No label needed for groupEnd in standard console
 * logger.prefix('EXAMPLE').log("Back to the outer level");
 * // Table example
 * logger.table(["apples", "oranges", "bananas"]);
 * // Time example
 * logger.time("Time example");
   // Time passes by
 * logger.timeLog("Time example");
 * * logger.prefix('EXAMPLE').time("Time example");
   // Time passes by
 * logger.prefix('EXAMPLE').timeLog("Time example");
 * // Trace example
 * function foo() {
 * 	function bar() {
 * 		logger.trace();
 * 	}
 * 	bar();
 * }
 * foo();
 * // Clear the console example
 * setTimeout(() => { logger.clear(); }, 5000);
 * ```
 */
export declare class Logger {
    /**
     * @internal
     * RESET code in ANSI code
     */
    private RESET;
    /**
     * BRIGHT code in ANSI code
     */
    BRIGHT: string;
    /**
     * DIM code in ANSI code
     */
    DIM: string;
    /**
     * UNDERSCORE code in ANSI code
     */
    UNDERSCORE: string;
    /**
     * BLINK code in ANSI code
     */
    BLINK: string;
    /**
     * REVERSE code in ANSI code
     */
    REVERSE: string;
    /**
     * HIDDEN code in ANSI code
     */
    HIDDEN: string;
    /**
     * FG_BLACK code in ANSI code
     */
    FG_BLACK: string;
    /**
     * FG_RED code in ANSI code
     */
    FG_RED: string;
    /**
     * FG_GREEN code in ANSI code
     */
    FG_GREEN: string;
    /**
     * FG_YELLOW code in ANSI code
     */
    FG_YELLOW: string;
    /**
     * FG_BLUE code in ANSI code
     */
    FG_BLUE: string;
    /**
     * FG_MAGENTA code in ANSI code
     */
    FG_MAGENTA: string;
    /**
     * FG_CYAN code in ANSI code
     */
    FG_CYAN: string;
    /**
     * FG_WHITE code in ANSI code
     */
    FG_WHITE: string;
    /**
     * FG_GRAY code in ANSI code
     */
    FG_GRAY: string;
    /**
     * BG_BLACK code in ANSI code
     */
    BG_BLACK: string;
    /**
     * BG_RED code in ANSI code
     */
    BG_RED: string;
    /**
     * BG_GREEN code in ANSI code
     */
    BG_GREEN: string;
    /**
     * BG_YELLOW code in ANSI code
     */
    BG_YELLOW: string;
    /**
     * BG_BLUE code in ANSI code
     */
    BG_BLUE: string;
    /**
     * BG_MAGENTA code in ANSI code
     */
    BG_MAGENTA: string;
    /**
     * BG_CYAN code in ANSI code
     */
    BG_CYAN: string;
    /**
     * BG_WHITE code in ANSI code
     */
    BG_WHITE: string;
    /**
     * BG_GRAY code in ANSI code
     */
    BG_GRAY: string;
    /**
     * @internal
     * The type's spacing
     */
    private TYPE_SPACER_LENGTH;
    /**
     * The types of this logger
     * @internal
     */
    private types;
    /**
     * @internal
     * The type of message to display
     */
    private currentType;
    /**
     * @internal
     * The space char
     */
    private SPACE_CHAR;
    /**
     * An object containing all ANSI foreground color codes (0-255)
     */
    FG_COLORS: {
        [key: number]: string;
    };
    /**
     * An object containing all ANSI background color codes (0-255)
     */
    BG_COLORS: {
        [key: number]: string;
    };
    /**
     * Creates an instance of Logger.
     * @param pTypes - Array of type objects to register
     */
    constructor(pTypes?: {
        type: string;
        ansi: string;
    }[]);
    /**
     * Apply a prefix to the message
     * @param pType - The type of log message
     * @returns The logger instance for chaining.
     */
    prefix(pType: string): this;
    /**
     * Log the message via pMethod
     * @internal
     * @param pMethod - The console method to use
     * @param pMessage - string, or array of strings of messages
     */
    private message;
    /**
     * Outputs a message to the console.
     * @param pMessage - The message(s) to log
     */
    log(...pMessage: any[]): void;
    /**
     * Outputs an informational message to the console.
     * @param pMessage - The message(s) to log
     */
    info(...pMessage: any[]): void;
    /**
     * Outputs an error message to the console.
     * @param pMessage - The message(s) to log
     */
    error(...pMessage: any[]): void;
    /**
     * Outputs a warning message to the console.
     * @param pMessage - The message(s) to log
     */
    warn(...pMessage: any[]): void;
    /**
     * The console.assert() method writes an error message to the console if the assertion is false. If the assertion is true, nothing happens.
     * @param pMessage - A boolean assertion. If false, the error message is written.
     */
    assert(...pMessage: any[]): void;
    /**
     * The console.debug() method outputs a message to the web console at the "debug" log level.
     * @param pMessage - The message(s) to log
     */
    debug(...pMessage: any[]): void;
    /**
     * The console.count() method logs the number of times that this particular call to count() has been called.
     * @param pLabel - A string. If supplied, count() outputs the number of times it has been called with that label. If omitted, count() behaves as though it was called with the "default" label.
     */
    count(pLabel?: string): void;
    /**
     * The console.countReset() method resets counter used with console.count().
     * @param pLabel - A string. If supplied, countReset() resets the count for that label to 0. If omitted, countReset() resets the default counter to 0.
     * */
    countReset(pLabel?: string): void;
    /**
     * The console.table() method displays tabular data as a table.
     * @param pData - The data to display. This must be either an array or an object.
     * @param pColumns - An array containing the names of columns to include in the output.
     */
    table(pData: any[] | object, pColumns?: string[]): void;
    /**
     * The console.time() method starts a timer you can use to track how long an operation takes.
     * @param pLabel - A string representing the name to give the new timer.
     */
    time(pLabel?: string): void;
    /**
     * The console.timeLog() method logs the current value of a timer that was previously started by calling console.time().
     * @param pLabel - The name of the timer to log to the console. If this is omitted the label "default" is used.
     */
    timeLog(pLabel?: string, ...pData: any[]): void;
    /**
     * The console.timeEnd() stops a timer that was previously started by calling console.time().
     * @param pLabel - A string representing the name of the timer to stop.
     */
    timeEnd(pLabel?: string): void;
    /**
     * The console.trace() method outputs a stack trace to the Web console.
     * @param pMessage - Zero or more objects to be output to console along with the trace.
     */
    trace(...pMessage: any[]): void;
    /**
     * The console.group() method creates a new inline group in the Web console log.
     * @param pLabel - Label for the group.
     */
    group(pLabel?: string): void;
    /**
     * The console.groupCollapsed() method creates a new inline group in the Web Console, but collapsed.
     * @param pLabel - Label for the group.
     */
    groupCollapsed(pLabel?: string): void;
    /**
     * The console.groupEnd() method exits the current inline group in the Web console.
     */
    groupEnd(): void;
    /**
     * Clears the console
     */
    clear(): void;
    /**
     * Registers a type to this logger
     * @param pType - The type to register to this logger
     * @param pAnsiInfo - The color (ANSI or CSS color string) this type will be when logged
     */
    registerType(pType: string, pAnsiInfo: string): void;
    /**
     * Registers the types in the pTypes array.
     * @param pTypes - The type array that contains the types to register.
     */
    registerTypes(pTypes: {
        type: string;
        ansi: string;
    }[]): void;
    /**
     * Unregisters a type from this logger
     * @param pType - The type to unregister from this logger
     */
    unregisterType(pType: string): void;
}
