import {normalizePropertyName} from './normalize-property-name';

it('converts uppercase characters to lowercase preceded by an underscore', () => {
    const result = normalizePropertyName('propertyName');

    expect(result).toEqual('property_name');
});

it('replaces hyphens with underscores', () => {
    const result = normalizePropertyName('property-name');

    expect(result).toBe('property_name');
});

it('converts the entire string to lowercase', () => {
    const result = normalizePropertyName('PropertyName');

    expect(result).toEqual('property_name');
});

it('handles a combination of uppercase characters and hyphens', () => {
    const result = normalizePropertyName('Property-Name');

    expect(result).toEqual('property__name');
});

it('returns an empty string if no property name is provided', () => {
    const result = normalizePropertyName('');

    expect(result).toBe('');
});