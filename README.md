# @byaga/journal

`@byaga/journal` is a structured logging library for Node.js applications.  It may also be useful in a browser but that is untested at this time.

## Installation

```bash
npm install @byaga/journal
```

## Usage

```javascript
import Journal from '@byaga/journal';

journal.info('Hello, world!');
```

### `withChildSpan`

The `withChildSpan` method is used to create a new child span for a given function. This is useful for tracing the execution of your code and understanding the performance of your application.

```javascript
import Journal from '@byaga/journal';

const myFunction = () => {
  // Your function logic here
  Journal.annoate({
    'additional': 'metadata'
  })
};

const tracedFunction = Journal.withChildSpan(myFunction, 'my-function');
```

In this example, `myFunction` is your function that you want to trace. The `withChildSpan` method wraps `myFunction` and returns a new function that, when called, will create a new child log with the name 'my-function' and then call `myFunction`.

The child span will automatically be ended when `myFunction` finishes executing. If `myFunction` is an async function or returns a promise, the child span will be ended when the promise is settled.  The child span will contain a duration_ms property with the execution time as well as the parent span having an additional app.timer.my_function_dur_ms property with the execution time.

## API

### `Journal`

The `Journal` class provides structured logging functionality. You can create a new instance of `Journal` and use it for logging in your application.

### `Context`

The `Context` module provides a context management system. It can be used to provide 'thread' aware logging without the need to pass the logger in as an input to every async method

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)