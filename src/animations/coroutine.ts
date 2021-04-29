import { defer } from "./helpers";

const coroutine = function (generatorFunction: GeneratorFunction) {
  const promise = defer();
  const generator = generatorFunction();

  // Call next() or throw() on the generator as necessary
  function next(value?: any, isError?: boolean) {
    const response = isError ? generator.throw(value) : generator.next(value);

    if (response.done) {
      return promise.resolve(response);
    }

    handleAsync(response.value);
  }

  next();

  return promise;

  // Handle the result the generator yielded
  function handleAsync(async?: unknown) {
    if (typeof async === "function") {
      var v = async();
      next(v);
    } else if (async instanceof Promise) {
      handlePromise(async);
    } else if (async === undefined) {
      setTimeout(next, 0);
    } else {
      next(new Error(`Invalid yield ${async}`), true);
    }
  }

  // If the generator yielded a promise, call `.then()`
  function handlePromise(async: Promise<any>) {
    async.then(next, (error) => next(error, true));
  }
};

export default coroutine;
