import {normalizePropertyName} from './normalize-property-name'
import { StructuredLog } from './StructuredLog'

export type LogParameters = string[] | StructuredLog[]
/**
 * Converts an array of parameters to a StructuredLog object.
 *
 * This function takes an array of parameters and returns a StructuredLog object.
 * If the first parameter is an object, its entries are included in the returned object.
 * The keys of the entries are normalized using the `normalizePropertyName` function.
 *
 * @param params - An array of parameters. If the first parameter is an object, its entries are included in the returned object.
 * @returns A StructuredLog object that includes the entries of the first parameter if it's an object.
 */
export function logParamsToData(params: LogParameters): StructuredLog {
    if (typeof params[0] === 'string') {
        return {
            message: params.join(' ')
        };
    }

    return Object.entries(params[0] || {})
        .reduce((data: StructuredLog, [key, value]) => {
            data[normalizePropertyName(key)] = value;
            return data;
        }, {})
}