export function capitalize(word: string) {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

type Defer = Promise<unknown> & {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

export function defer(): Defer {
  let res: (value: unknown) => void = () => {};
  let rej: (reason?: any) => void = () => {};

  const prom = new Promise((resolve, reject) => {
    res = resolve as (value: unknown) => void;
    rej = reject as (reason?: any) => void;
  });

  return {
    ...prom,
    resolve: res,
    reject: rej,
  };
}
