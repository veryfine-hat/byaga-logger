import {AsyncFunction, SafeFunction, SafeResponse} from "./logged-method/AsyncFunction";

/**
 * Wraps a function with error handling to ensure it always returns a `SafeResponse`.
 * If the wrapped function throws an error, the error is caught and returned as part of the `SafeResponse`.
 * @function makeSafe
 * @template T - The type of the function to wrap. Must be a function that returns a Promise.
 * @param {T} fn - The function to wrap.
 * @returns {SafeFunction<T>} - The wrapped function.
 */
export const makeSafe = <T extends AsyncFunction>(fn: T): SafeFunction<T> => {
    /**
     * The wrapped function.
     * @async
     * @param {...Parameters<T>} args - The arguments to pass to the wrapped function.
     * @returns {Promise<SafeResponse<ReturnType<T>>>} - A promise that resolves with a `SafeResponse`. If the wrapped function throws an error, the error is included in the `SafeResponse`.
     */
    const decoratedFunction = async (...args: Parameters<T>): Promise<SafeResponse<ReturnType<T>>> => {
        try {
            return {result: await fn(...args)};
        } catch (error) {
            return {error};
        }
    }
    return decoratedFunction as SafeFunction<T>;
}

export default makeSafe;