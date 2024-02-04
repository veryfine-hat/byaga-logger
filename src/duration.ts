export type LowResolutionTimerStopFunction = {
    (): number;
    start: number;
    time: number;
}
export type HighResolutionTimerStopFunction = {
    (): number;
    start: number;
    time: [number, number];
}
export type TimerStopFunction = LowResolutionTimerStopFunction | HighResolutionTimerStopFunction;

/**
 * Function to calculate high resolution time duration.
 * It uses the performance.now() method to get high resolution real time.
 * It returns a function that when called, will return the elapsed time in milliseconds since the hrDuration function was called.
 *
 * @returns {Function} - A function that returns the elapsed time in milliseconds.
 */
export function hrDuration(): HighResolutionTimerStopFunction {
    const startTime = [performance.now(), 0] as [number, number];
    const onEnd = function duration() {
        const endTime = performance.now();
        return endTime - startTime[0];
    };
    onEnd.start = Date.now();
    onEnd.time = startTime;

    return onEnd;
}
/**
 * Function to calculate low resolution time duration.
 * It uses the Date.now() method to get the current time.
 * It returns a function that when called, will return the elapsed time in milliseconds since the lrDuration function was called.
 *
 * @returns {Function} - A function that returns the elapsed time in milliseconds.
 */
export function lrDuration(): LowResolutionTimerStopFunction {
    const startTime = Date.now();
    const onEnd = function duration() {
        return Date.now() - startTime;
    };
    onEnd.start = startTime;
    onEnd.time = startTime;

    return onEnd;
}

/**
 * Function to calculate time duration.
 * It checks if the process.hrtime() method is available, if so it uses the hrDuration function to get high resolution time duration.
 * If the process.hrtime() method is not available, it uses the lrDuration function to get low resolution time duration.
 *
 * @returns {Function} - A function that returns the elapsed time in milliseconds.
 */
export function duration(): TimerStopFunction {
    // @ts-expect-error - hrtime may not be defined depending on the node/browser version
    return (typeof performance !== 'undefined' && performance.now) ? hrDuration() : lrDuration();
}