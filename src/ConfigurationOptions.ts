import {StructuredLog} from "./StructuredLog";

export interface ConfigurationOptions {
    write?: (data: StructuredLog) => void;
}