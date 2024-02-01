import {LogParameters, logParamsToData} from "./log-params-to-data";
import {duration} from "./duration";
import {v4 as uuid} from 'uuid';
import {StructuredLog, LogItem} from "./StructuredLog";
import {LogOptions} from "./LogOptions";
import {normalizePropertyName} from './normalize-property-name'
import {getClassName} from "./get-class-name";

type SpannedFunction<T> = (span: Span) => Promise<T>

/**
 * The Span class represents a span of time for logging purposes.
 * It provides methods to annotate the span with additional data, create child spans, and log the span.
 */
export class Span {
    readonly context: StructuredLog = {};
    readonly cascadedContext: StructuredLog = {};
    private readonly spanStart = duration();
    private readonly _parent?: Span

    /**
     * Creates a new Span instance.
     *
     * @param {Span} [parent] - Optional. The parent span of the new span.
     */
    constructor(parent?: Span) {
        this._parent = parent;
    }

    /**
     * Gets the parent span of the current span.
     *
     * @returns {Span} - The parent span, or the current span if there is no parent.
     */
    get parent(): Span {
        return this._parent ? this._parent : this;
    }

    /**
     * Gets the root span of the current span.
     *
     * @returns {Span} - The root span.
     */
    get root(): Span {
        if (this._parent) return this._parent.root
        return this
    }

    /**
     * Logs data with the root span.
     *
     * @param {StructuredLog} data - The data to log.
     */
    log(data: StructuredLog) {
        if (this !== this.root) this.root.log(data);
    }

    /**
     * Begins a new child span of the current span.
     *
     * @param {...} args - The arguments to annotate the new span with.
     * @returns The new child span.
     */
    beginSpan(...args: LogParameters): Span {
        const child = new Span(this);
        child.annotate(logParamsToData(args));
        child.annotate({
            'time': new Date(Date.now()).toISOString(),
            'trace.span_id': uuid()
        });
        return child
    }

    /**
     * Annotates the current span with additional data.
     *
     * @param {string} name - The name of the annotation.
     * @param {LogItem} value - The value of the annotation.
     * @param {LogOptions} [options={}] - Additional options for the annotation.
     */
    annotate(name: string, value: LogItem, options?: LogOptions): void;

    /**
     * Annotates the current span with multiple annotations.
     *
     * @param {StructuredLog} log - A StructuredLog object containing multiple annotations.
     * @param {LogOptions} [options={}] - Additional options for the annotations.
     */
    annotate(log: StructuredLog, options?: LogOptions): void;

    annotate(nameOrLog: string | StructuredLog, valueOrOptions?: LogItem | LogOptions, options?: LogOptions): void {
        if (typeof nameOrLog === 'string') {
            this.setOne(nameOrLog, valueOrOptions as LogItem, options);
        } else {
            this.setMany(nameOrLog, valueOrOptions as LogOptions);
        }
    }

    /**
     * Runs a function within a new child span of the current span.
     *
     * @param fn - The function to run.
     * @param args - The arguments to annotate the new span with.
     * @returns A promise that resolves to the return value of the function.
     */
    async span<T>(fn: SpannedFunction<T>, ...args: LogParameters): Promise<Awaited<T>> {
        const span = this.beginSpan(...args);
        const result = await fn(span);
        span.end();
        return result;
    }

    /**
     * Ends the current span and logs it.
     *
     * @param {...string[] | [StructuredLog]} args - The arguments to annotate the span with before logging it.
     */
    end(...args: string[] | [StructuredLog]) {
        const data = logParamsToData(args);
        this.log({
            time: this.spanStart.start,
            ...this.parent?.cascadedContext,
            ...this.cascadedContext,
            duration_ms: this.spanStart(),
            ...this.context, ...data
        });
    }

    /**
     * Starts a timer and returns a function that stops the timer when called.
     * The timer duration is logged with a specified key.
     *
     * @param name - The name to be used for the key of the logged duration.
     * @param [start={}] - Additional data to log when the timer starts.
     * @returns A function that stops the timer when called and logs the duration.
     */
    startTimer(name: string, start: StructuredLog = {}) {
        const startAt = duration();
        let once = true;
        return (end: StructuredLog = {}) => {
            if (!once) throw new Error('Done method should only be called once');

            once = false;
            this.annotate({
                ...start, ...end,
                [`metrics.timers.${name}_ms`]: startAt()
            });
        };
    }

    /**
     * Logs an exception with additional data.
     *
     * This method annotates the current span with details about the exception, including the error message, stack trace, and type.
     * It also includes any additional data provided in the `data` parameter.
     *
     * @param error - The error to log. This can be any type, but is typically an Error object.
     * @param {StructuredLog} [data] - Optional. Additional data to log with the error.
     */
    exception(error: unknown, data?: StructuredLog) {
        const details = {
            'error': (error as Error).message || (error as Error).toString(),
            'error.details': (error as Error).stack,
            'error.type': getClassName(error)
        };
        const annotations = Object.entries(data || {}).reduce((logData, [key, value]) => ({
            ...logData,
            [`error.${key}`]: value
        }), details);

        this.annotate(annotations);
    }

    /***
     * Sets a single annotation on the span.
     *
     * @param name - The name of the annotation.
     * @param value - The value of the annotation.
     * @param [options={}] - Additional options for the annotation.
     */
    private setOne(name: string, value: LogItem, options: LogOptions = {}) {
        const {cascade, hoist} = options
        if (hoist && this._parent) {
            this.parent.annotate(name, value, {hoist});
        }

        name = normalizePropertyName(name);
        this.context[name] = value
        if (cascade) this.cascadedContext[name] = value
    }

    /***
        * Sets multiple annotations on the span.
        *
        * @param {StructuredLog} data - The annotations to set.
        * @param {LogOptions} [options={}] - Additional options for the annotations.
        */
    private setMany(data: StructuredLog, options: LogOptions) {
        Object.entries(data).forEach(([name, value]) => {
            this.setOne(name, value, options)
        })
    }
}