import Journal from '../index'
import { AsyncFunction } from "./AsyncFunction";

/**
 * Creates a decorator that wraps a given async method with logging behavior.
 * It starts a timer before calling the method and stops the timer after the method has finished executing.
 * If the method throws an error, it logs the error and returns a SafeResponse object with the error.
 * If the method resolves successfully, it returns the result.
 *
 * @returns A decorator function that takes a target object, a property key, and a property descriptor, and returns a new descriptor for a method with the same signature that has been wrapped with logging behavior.
 */
export function withLoggingAsync() {
  return function<T extends AsyncFunction>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T> = Object.getOwnPropertyDescriptor(target, propertyKey) || {}): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;
    const done = Journal.startTimer(propertyKey);

    descriptor.value = async function(this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        Journal.exception(error);
        throw error
      }
      finally {
        done();
      }
    } as unknown as T;

    return descriptor;
  };
}

export default withLoggingAsync;