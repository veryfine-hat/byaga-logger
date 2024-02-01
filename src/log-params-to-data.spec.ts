import {logParamsToData} from './log-params-to-data';
import {normalizePropertyName} from './normalize-property-name';
import {StructuredLog} from "./StructuredLog";

jest.mock('./normalize-property-name');

it('returns an empty object if no parameters are provided', () => {
    const result = logParamsToData([]);

    expect(result).toEqual({});
});

it('returns an object with normalized keys if the first parameter is an object', () => {
    (normalizePropertyName as jest.Mock).mockImplementation((key) => key.toUpperCase());

    const params = [{key1: 'value1', key2: 'value2'} as StructuredLog];
    const result = logParamsToData(params);

    expect(result).toEqual({KEY1: 'value1', KEY2: 'value2'});
    expect(normalizePropertyName).toHaveBeenCalledWith('key1');
    expect(normalizePropertyName).toHaveBeenCalledWith('key2');
});

it('if 1st parameter is a string it will concatenate all params into a message string', () => {
    const params = ['string1', 'string2'];
    const result = logParamsToData(params);

    expect(result).toEqual({ message: 'string1 string2'});
});