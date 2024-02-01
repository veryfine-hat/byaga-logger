import { withLoggingAsync } from './with-logging-async';
import Journal from '../index';

jest.mock('../index');

describe('withLoggingAsync', () => {
    it('returns a decorator that wraps an async method with logging behavior', async () => {
        class MockClass {
            @withLoggingAsync()
            async mockMethod() {
                return 'result';
            }
        }

        // const descriptor = {
        //     value: MockClass.prototype.mockMethod,
        //     writable: true,
        //     configurable: true,
        // };
        //
        // const newDescriptor = withLoggingAsync('mockMethod')(MockClass.prototype, 'mockMethod', descriptor);
        //
        // MockClass.prototype.mockMethod = newDescriptor.value;

        const instance = new MockClass();
        const result = await instance.mockMethod();

        expect(result).toEqual({ result: 'result' });
        expect(Journal.startTimer).toHaveBeenCalledWith('mockMethod');
        expect(Journal.exception).not.toHaveBeenCalled();
    });

    it('returns a decorator that wraps an async method and handles errors', async () => {
        class MockClass {
            @withLoggingAsync('mockMethod')
            async mockMethod() {
                throw new Error('error');
            }
        }

        const instance = new MockClass();
        const result = await instance.mockMethod();

        expect(result).toEqual({ error: new Error('error') });
        expect(Journal.startTimer).toHaveBeenCalledWith('mockMethod');
        expect(Journal.exception).toHaveBeenCalledWith(new Error('error'));
    });
});