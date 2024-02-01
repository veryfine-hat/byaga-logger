import {withLogging} from './with-logging';
import {withLoggingAsync} from './with-logging-async';
import {withLoggingCallback} from './with-logging-callback';

jest.mock('./with-logging-async');
jest.mock('./with-logging-callback');

it('returns a decorator that wraps a method with a callback with logging behavior', () => {
    const mockFn = jest.fn((callback: (error: unknown, result?: unknown) => void) => callback(null, 'result'));
    const mockDecorator = withLogging('mockFn');
    const mockDescriptor = {value: mockFn};

    mockDecorator(mockFn, 'mockFn', mockDescriptor);

    expect(withLoggingCallback).toHaveBeenCalledWith('mockFn');
    expect(withLoggingAsync).not.toHaveBeenCalled();
});

it('returns a decorator that wraps an async method with logging behavior', () => {
    const mockFn = jest.fn(async () => 'result');
    const mockDecorator = withLogging('mockFn');
    const mockDescriptor = {value: mockFn};

    mockDecorator(mockFn, 'mockFn', mockDescriptor);

    expect(withLoggingAsync).toHaveBeenCalledWith('mockFn');
    expect(withLoggingCallback).not.toHaveBeenCalled();
});