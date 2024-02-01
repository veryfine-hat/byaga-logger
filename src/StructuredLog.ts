export type LogItem = number | string | boolean | undefined
export interface StructuredLog {
    duration_ms?: number,
    [key: string]: LogItem
}
