import { EventEmitter } from "./EventEmitter";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('test for EventEmitter', () => {
  it('EventEmitter: on and emit', done => {
    const TEST_MSG = 'hello world';
    const TEST_EVT = 'test';
    const eventEmitter = new EventEmitter();
    const handler = (evt: string) => {
      expect(evt).toBe(TEST_MSG);
      done();
    }
    eventEmitter.on(TEST_EVT, handler);
    const handlers = (eventEmitter as any).handlers;
    expect(handlers.has(TEST_EVT)).toBeTruthy();
    expect(handlers.get(TEST_EVT).get(handler)).toBeFalsy();
    eventEmitter.emit(TEST_EVT, TEST_MSG);
  });

  it('EventEmitter: once and emit', done => {
    const TEST_MSG = 'hello world';
    const TEST_EVT = 'test';
    const eventEmitter = new EventEmitter();
    const handlers = (eventEmitter as any).handlers;
    const handler = (evt: string) => {
      expect(evt).toBe(TEST_MSG);
      expect(handlers.get(TEST_EVT)).toBeUndefined();
      done();
    };
    eventEmitter.once(TEST_EVT, handler);
    expect(handlers.has(TEST_EVT)).toBeTruthy();
    expect(handlers.get(TEST_EVT).get(handler)).toBeTruthy();
    eventEmitter.emit(TEST_EVT, TEST_MSG);
  });

  it('EventEmitter: on and off', () => {
    const TEST_EVT = 'test';
    const eventEmitter = new EventEmitter();
    const handlers = (eventEmitter as any).handlers;
    const handler1 = () => {
      // empty
    };
    const handler2 = () => {
      // empty
    };
    const handler3 = () => {
      // empty
    };

    eventEmitter.on(TEST_EVT, handler1);
    eventEmitter.on(TEST_EVT, handler2);
    eventEmitter.on(TEST_EVT, handler3);
    eventEmitter.emit(TEST_EVT);
    expect(handlers.get(TEST_EVT).has(handler1)).toBeTruthy();
    expect(handlers.get(TEST_EVT).has(handler2)).toBeTruthy();
    expect(handlers.get(TEST_EVT).has(handler3)).toBeTruthy();

    eventEmitter.off(TEST_EVT, handler3);
    eventEmitter.emit(TEST_EVT);
    expect(handlers.get(TEST_EVT).has(handler1)).toBeTruthy();
    expect(handlers.get(TEST_EVT).has(handler2)).toBeTruthy();
    expect(handlers.get(TEST_EVT).has(handler3)).toBeFalsy();

    eventEmitter.off(TEST_EVT);
    eventEmitter.emit(TEST_EVT);
    expect(handlers.has(TEST_EVT)).toBeFalsy();
  });
});
