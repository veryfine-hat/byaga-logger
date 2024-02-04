import { Logger } from './Logger';

export {type StructuredLog, type LogItem} from './StructuredLog';
export {type Span} from './Span';
export {type ConfigurationOptions} from './ConfigurationOptions';
export {type LogOptions} from './LogOptions';

export {Logger}
export {duration, hrDuration, lrDuration, type TimerStopFunction, type LowResolutionTimerStopFunction, type HighResolutionTimerStopFunction} from './duration';
export default Logger;
