
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface Type<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any[]): T;
}
