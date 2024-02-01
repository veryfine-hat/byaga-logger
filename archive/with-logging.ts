import { withLoggingAsync } from "./with-logging-async";
import { withLoggingCallback } from "./with-logging-callback";
import { FunctionWithCallback } from "./FunctionWithCallback";
import { AsyncFunction } from "./AsyncFunction";

/**
 * Creates a decorator that wraps a given method with logging behavior.
 * It checks if the last parameter of the method is a function (callback).
 * If it is, it uses `withLoggingCallback` to decorate the method with logging behavior for callback-based methods.
 * If it's not, it uses `withLoggingAsync` to decorate the method with logging behavior for promise-based methods.
 *
 * @param name - The name to be used for logging.
 * @returns A decorator function that takes a target object, a property key, and a property descriptor, and returns a new descriptor for a method with the same signature that has been wrapped with logging behavior.
 */
export function withLogging(name: string) {
    return function <T extends AsyncFunction | FunctionWithCallback>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
        // Cast fn to the Function type
        const fnAsFunction = descriptor.value as unknown as unknown[];

        // Check if the last parameter is a function (callback)
        if (typeof fnAsFunction[fnAsFunction.length - 1] === 'function') {
            // If it is, use withLoggingCallback to decorate the method with logging behavior for callback-based methods
            return withLoggingCallback(name)(target, propertyKey, descriptor as TypedPropertyDescriptor<T>);
        }

        // If the last parameter is not a function, assume the method returns a Promise
        // Use withLoggingAsync to decorate the method with logging behavior for promise-based methods
        return withLoggingAsync(name)(target, propertyKey, descriptor as TypedPropertyDescriptor<T>);
    };
}
export default withLogging;