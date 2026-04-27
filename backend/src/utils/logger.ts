type LogFn = (...args: unknown[]) => void;

const stamp = () => new Date().toISOString();
const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  gray: (s: string) => `\x1b[90m${s}\x1b[0m`,
};

export const logger = {
  info: ((...args: unknown[]) =>
    console.log(c.gray(stamp()), c.cyan("[info]"), ...args)) as LogFn,
  warn: ((...args: unknown[]) =>
    console.warn(c.gray(stamp()), c.yellow("[warn]"), ...args)) as LogFn,
  error: ((...args: unknown[]) =>
    console.error(c.gray(stamp()), c.red("[err ]"), ...args)) as LogFn,
};
