import {Span} from './Span';
import {duration} from './duration';
import {logParamsToData} from './log-params-to-data';
import Logger from "./Logger";

jest.mock('./duration', () => {
    const timer = jest.fn().mockReturnValue(1000);
    (timer as unknown as Record<string, number>).start = 1;
    return {
        duration: jest.fn().mockReturnValue(timer)
    }
});
jest.mock('./log-params-to-data');

describe('Span', () => {
    it('creates a new span with a parent', () => {
        const parent = new Span();
        const child = new Span(parent);

        expect(child.parent).toBe(parent);
    });

    it('creates a new span without a parent', () => {
        const span = new Span();

        expect(span.parent).toBe(span);
    });

    it('gets the root span of a child span', () => {
        const parent = new Span();
        const child = new Span(parent);

        expect(child.root).toBe(parent);
    });
});

describe('Span#parent', () => {
    it('gets the parent span', () => {
        const parent = new Span();
        const child = new Span(parent);

        expect(child.parent).toBe(parent);
    });

    it('gets the current span if there is no parent', () => {
        const span = new Span();

        expect(span.parent).toBe(span);
    });
});

describe('Span#root', () => {
    it('gets the root span in a chain', () => {
        const parent = new Span();
        const child = new Span(parent);
        const childOfChild = new Span(child);

        expect(childOfChild.root).toBe(parent);
    });

    it('gets the current span if there is no parent', () => {
        const span = new Span();

        expect(span.root).toBe(span);
    });
});

describe('Span#log', () => {
    it('logs data with the root span', () => {
        const root = new Logger()
        const parent = new Span(root);
        const child = new Span(parent);
        const data = {key: 'value'};

        jest.spyOn(root, 'log');

        child.log(data);

        expect(root.log).toHaveBeenCalledWith(data);
    });
});

describe('Span#beginSpan', () => {
    it('begins a new child span and annotates it with provided data', () => {
        const parent = new Span();
        const data = {key: 'value'};

        (logParamsToData as jest.Mock).mockReturnValue(data);

        const child = parent.beginSpan(data);

        expect(child).toBeInstanceOf(Span);
        expect(child.parent).toBe(parent);
        expect(child.context).toEqual(expect.objectContaining(data));
    });
});

describe('Span#annotate', () => {
    it('annotates the span with provided data', () => {
        const span = new Span();
        const data = {key: 'value'};

        (logParamsToData as jest.Mock).mockReturnValue(data);

        span.annotate(data);

        expect(span.context).toEqual(expect.objectContaining(data));
    });

    it('can annotate a single property', () => {
        const span = new Span();

        span.annotate('key', 'value');

        expect(span.context).toEqual(expect.objectContaining({key: 'value'}));
    });
});

describe('Span#span', () => {
it('runs a function within a new child span', async () => {
    const parent = new Span();
    const fn = jest.fn().mockResolvedValue('result');
    const data = {key: 'value'};

    (logParamsToData as jest.Mock).mockReturnValue(data);

    const result = await parent.span(fn, data);

    expect(result).toBe('result');
    expect(fn).toHaveBeenCalled();
});
});

describe('Span#end', () => {
    it('ends the span and logs it', () => {
        const span = new Span();
        const data = {key: 'value'};

        (logParamsToData as jest.Mock).mockReturnValue(data);
        (duration as jest.Mock).mockReturnValue(() => 1000);

        jest.spyOn(span, 'log');

        span.end(data);

        expect(span.log).toHaveBeenCalledWith(expect.objectContaining(data));
    });
});

describe('Span#startTimer', () => {
    it('starts a timer', () => {
        const span = new Span();

        span.startTimer('test-timer');

        expect(duration).toHaveBeenCalled();
    });

    it('will record when the timer is stopped', () => {
        const span = new Span();
        const stop = span.startTimer('test-timer');

        stop();

        expect(span.context['metrics.timers.test_timer_ms']).toBe(1000);
    })

    it('allows attaching additional log data to the startTimer call', () => {
        const span = new Span();
        const stop = span.startTimer('timer', {timer: 'data1'});
        stop({end: 'data2'});

        expect(span.context['timer']).toBe('data1');
    });

    it('allows attaching additional log data to the endTimer call', () => {
        const span = new Span();
        const stop = span.startTimer('timer', {timer: 'data1'});
        stop({end: 'data2'});

        expect(span.context['end']).toBe('data2');
    });
});

describe('Span#exception', () => {
    it('logs an exception', () => {
        const span = new Span();
        const error = new Error('test');
        const data = {key: 'value'};

        (logParamsToData as jest.Mock).mockReturnValue(data);

        span.exception(error, data);

        expect(span.context['error']).toEqual('test');
        expect(span.context['error.details']).toEqual(error.stack);
        expect(span.context['error.type']).toEqual('Error');
    });

    it('allows additional data to be logged with the exception', () => {
        const span = new Span();
        const error = new Error('test');
        const data = {key: 'value'};

        (logParamsToData as jest.Mock).mockReturnValue(data);

        span.exception(error, data);

        expect(span.context['error.key']).toEqual('value');
    });
})