import Journal from '../index'
import { Callback } from "./FunctionWithCallback";

export function withLoggingCallback(name: string) {
  return function<T extends (...args: any[]) => any>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    const originalMethod = descriptor.value!;
    const done = Journal.startTimer(name);
    
    descriptor.value = function(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | void {
      const originalCallback = args[args.length - 1] as Callback;

      // Replace the callback with a new function
      args[args.length - 1] = (error: unknown, result: unknown) => {
        if (error) Journal.exception(error);
        done();
        originalCallback(error, result);
      };

      // Call the original method with the new arguments
      return originalMethod.apply(this, args);
    } as unknown as T;

    return descriptor;
  };
}

export default withLoggingCallback;