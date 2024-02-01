import {duration, hrDuration, lrDuration} from './duration';

jest.useFakeTimers();

jest.mock('process', () => ({
    hrtime: jest.fn(),
}));

describe('hrDuration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(process, 'hrtime');
    })
    it('returns a function that calculates the elapsed time in milliseconds', () => {
        (process.hrtime as unknown as jest.Mock).mockReturnValueOnce([0, 0]).mockReturnValueOnce([1, 1e6]);

        const stop = hrDuration();
        const elapsed = stop();

        expect(elapsed).toBe(1001);
        expect(process.hrtime).toHaveBeenCalledTimes(2);
    });

    it('returns a function that calculates the elapsed time in milliseconds with fractional seconds', () => {
        (process.hrtime as unknown as jest.Mock).mockReturnValueOnce([0, 0]).mockReturnValueOnce([0, 5e6]);

        const stop = hrDuration();
        const elapsed = stop();

        expect(elapsed).toBe(5);
        expect(process.hrtime).toHaveBeenCalledTimes(2);
    });

    it('returns a function that calculates the elapsed time in milliseconds with multiple seconds', () => {
        (process.hrtime as unknown as jest.Mock).mockReturnValueOnce([0, 0]).mockReturnValueOnce([3, 0]);

        const stop = hrDuration();
        const elapsed = stop();

        expect(elapsed).toBe(3000);
        expect(process.hrtime).toHaveBeenCalledTimes(2);
    });
});

describe('lrDuration', () => {
    it('returns a function that calculates the elapsed time in milliseconds', () => {
        const stop = lrDuration();

        jest.advanceTimersByTime(1000);

        const elapsed = stop();

        expect(elapsed).toBe(1000);
    });

    it('returns a function that calculates the elapsed time in milliseconds with fractional seconds', () => {
        const stop = lrDuration();

        jest.advanceTimersByTime(500);

        const elapsed = stop();

        expect(elapsed).toBe(500);
    });

    it('returns a function that calculates the elapsed time in milliseconds with multiple seconds', () => {
        const stop = lrDuration();

        jest.advanceTimersByTime(3000);

        const elapsed = stop();

        expect(elapsed).toBe(3000);
    });
});

describe('duration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(process, 'hrtime');
    })
    it('returns a function that calculates the elapsed time in milliseconds using hrtime if available', () => {
        (process.hrtime as unknown as jest.Mock).mockReturnValueOnce([0, 0]).mockReturnValueOnce([1, 1e6]);

        const stop = duration();
        const elapsed = stop();

        expect(elapsed).toBe(1001);
        expect(process.hrtime).toHaveBeenCalledTimes(2);
    });

    it('returns a function that calculates the elapsed time in milliseconds using Date.now if hrtime is not available', () => {
        delete (process as unknown as Record<string, unknown>).hrtime;

        const stop = duration();

        jest.advanceTimersByTime(1000);

        const elapsed = stop();

        expect(elapsed).toBe(1000);
    });
});