/** @format */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type EventHandler = (...args: any[]) => boolean | void | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<T = any> {
  private _handlers: Map<string, Map<EventHandler, boolean>> = new Map();
  protected get handlers() {
    if (!this._handlers) {
      this._handlers = new Map();
    }
    return this._handlers;
  }

  initEvent<K extends keyof T>(_event: K): void;
  initEvent(_event: string | number | symbol): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initEvent(_event: string | number | symbol) {
    // abstract method
  }

  disposeEvent<K extends keyof T>(_event: K): void;
  disposeEvent(_event: string | number | symbol): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disposeEvent(_event: string | number | symbol) {
    // abstract method
  }

  on<K extends keyof T>(event: K, handler: (evt: T[K]) => boolean | void | undefined): void;
  on(event: string | number | symbol, handler: EventHandler) {
    event = event.toString();
    this.listen(event, handler, false);
  }

  off<K extends keyof T>(event: K, handler?: (evt: T[K]) => boolean | void | undefined): boolean;
  off(event: string | number | symbol, handler?: EventHandler) {
    event = event.toString();
    return this.deleteHandler(event, handler);
  }

  once<K extends keyof T>(event: K, handler: (evt: T[K]) => boolean | void | undefined): void;
  once(event: string | number | symbol, handler: EventHandler) {
    this.listen(event.toString(), handler, true);
  }

  emit<K extends keyof T>(event: K, params: T[K]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string | number | symbol, ...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string | number | symbol, ...args: any[]) {
    event = event.toString();
    const handlers = this.handlers.get(event);
    if (handlers) {
      for (const handler of handlers.keys()) {
        if (handlers.get(handler)) {
          this.deleteHandler(event, handler);
        }
        const result = !!handler(...args);
        if (result) {
          break;
        }
      }
    }
  }

  private deleteHandler(event: string | number | symbol, handler?: EventHandler) {
    const key = event.toString();
    if (handler) {
      const map = this.handlers.get(key);
      const result = Boolean(map?.delete(handler));

      if (!map?.size) {
        this.handlers.delete(key);
        this.disposeEvent(event);
      }

      return result;
    } else {
      this.disposeEvent(event);
      return this.handlers.delete(key);
    }
  }

  private listen(event: string, handler: EventHandler, once: boolean) {
    if (!this.handlers.has(event)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.initEvent(event as any);
    }
    const handlers = this.handlers.get(event) || new Map();
    handlers.set(handler, once);
    this.handlers.set(event, handlers);
  }
}
