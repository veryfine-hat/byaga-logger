import {duration, hrDuration, lrDuration} from './duration';

jest.useFakeTimers();

// jest.mock('performance', () => ({
//     now: jest.fn(),
// }));

describe('hrDuration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(performance, 'now');
    })

    it('returns a function that calculates the elapsed time in milliseconds', () => {
        (performance.now as unknown as jest.Mock).mockReturnValueOnce(0)
            .mockReturnValueOnce(1.003);

        const stop = hrDuration();
        const elapsed = stop();

        expect(elapsed).toBe(1.003);
        expect(performance.now).toHaveBeenCalledTimes(2);
    });

    it('returns a function that calculates the elapsed time in milliseconds with fractional seconds', () => {
        (performance.now as unknown as jest.Mock).mockReturnValueOnce(0)
            .mockReturnValueOnce(0.005);

        const stop = hrDuration();
        const elapsed = stop();

        expect(elapsed).toBe(0.005);
        expect(performance.now).toHaveBeenCalledTimes(2);
    });

    it('returns a function that calculates the elapsed time in milliseconds with multiple seconds', () => {
        (performance.now as unknown as jest.Mock).mockReturnValueOnce(0)
            .mockReturnValueOnce(3);

        const stop = hrDuration();
        const elapsed = stop();

        expect(elapsed).toBe(3);
        expect(performance.now).toHaveBeenCalledTimes(2);
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
        (performance.now as unknown as jest.Mock).mockReturnValueOnce(0)
            .mockReturnValueOnce(1 + 1e3);

        const stop = duration();
        const elapsed = stop();

        expect(elapsed).toBe(1001);
        expect(performance.now).toHaveBeenCalledTimes(2);
    });

    it('returns a function that calculates the elapsed time in milliseconds using Date.now if hrtime is not available', () => {
        delete (process as unknown as Record<string, unknown>).hrtime;

        const stop = duration();

        jest.advanceTimersByTime(1000);

        const elapsed = stop();

        expect(elapsed).toBe(1000);
    });
});