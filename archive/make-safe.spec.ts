import {makeSafe} from './make-safe';

it('returns result when function is successful', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const safeFn = makeSafe(fn);

    const result = await safeFn('test');

    expect(result).toEqual({result: 'success'});
    expect(fn).toHaveBeenCalledWith('test');
});

it('returns error when function throws an error', async () => {
    const error = new Error('test error');
    const fn = jest.fn().mockRejectedValue(error);
    const safeFn = makeSafe(fn);

    const result = await safeFn('test');

    expect(result).toEqual({error});
    expect(fn).toHaveBeenCalledWith('test');
});