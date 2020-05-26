/** @format */
import ResizeObserver from 'resize-observer-polyfill';
import { pascalCase } from 'pascal-case';
import { EventEmitter } from './EventEmitter/EventEmitter';

/**
 * 鼠标、触摸事件参数
 */
export interface IPointerEventParams {
  /**
   * 指针位置，支持多点交互
   */
  readonly pointers: { [id: number]: { x: number; y: number; id: number } };

  /**
   * 源事件对象
   */
  readonly source: MouseEvent | TouchEvent;

  /**
   * 事件目标控件
   */
  readonly target: HTMLElement;

  /**
   * 事件类型
   */
  readonly type: keyof IGestureInputHandlers;
}

export interface IGestureInputHandlers {
  mousedown: IPointerEventParams;
  mouseup: IPointerEventParams;
  mousemove: IPointerEventParams;
  touchstart: IPointerEventParams;
  touchend: IPointerEventParams;
  touchmove: IPointerEventParams;
  resize: ResizeObserverEntry;
}

export class Input extends EventEmitter<IGestureInputHandlers> {
  get target() {
    return this._target;
  }
  set target(value: HTMLElement) {
    if (this._target !== value) {
      // need to reset events when the target element changed
      const keys = this.unset();
      this._target = value;
      this.resume(keys);
    }
  }

  private resizeObserver: ResizeObserver;

  constructor(private _target: HTMLElement) {
    super();
    this.resizeObserver = new ResizeObserver(this.onResize);
  }

  dispose() {
    this.unset();
    this.resizeObserver.disconnect();
  }

  /**
   * unset event temporarily
   */
  protected unset() {
    const removed: Array<keyof IGestureInputHandlers> = [];
    const keys = this.handlers.keys() as IterableIterator<keyof IGestureInputHandlers>;
    for (const key of keys) {
      this.disposeEvent(key);
      removed.push(key);
    }
    return removed;
  }

  /**
   * resume events unseted temporarily
   * @param keys
   */
  protected resume(keys: Array<keyof IGestureInputHandlers>) {
    for (const key of keys) {
      this.initEvent(key);
    }
  }

  initEvent(type: keyof IGestureInputHandlers) {
    const funcName = `init${pascalCase(type)}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[funcName]();
  }

  disposeEvent(type: keyof IGestureInputHandlers) {
    const funcName = `dispose${pascalCase(type)}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[funcName]();
  }

  // #region events' init/dispose hooks
  // #region mousedown hook
  protected initMousedown() {
    this._target.addEventListener('mousedown', this.onMouseDown);
  }

  protected disposeMousedown() {
    this._target.removeEventListener('mousedown', this.onMouseDown);
  }
  // #endregion

  // #region mousemove hook
  protected initMousemove() {
    this._target.addEventListener('mousemove', this.onMouseMove);
  }

  protected disposeMousemove() {
    this._target.removeEventListener('mousemove', this.onMouseMove);
  }
  //#endregion

  // #region mouseup hook
  protected initMouseup() {
    this._target.addEventListener('mouseup', this.onMouseUp);
  }

  protected disposeMouseup() {
    this._target.removeEventListener('mouseup', this.onMouseUp);
  }
  //#endregion

  // #region touchstart hook
  protected initTouchstart() {
    this._target.addEventListener('touchstart', this.onTouchStart);
  }

  protected disposeTouchstart() {
    this._target.removeEventListener('touchstart', this.onTouchStart);
  }
  //#endregion

  // #region touchmove hook
  protected initTouchmove() {
    this._target.addEventListener('touchmove', this.onTouchMove);
  }

  protected dispostTouchmove() {
    this._target.removeEventListener('touchmove', this.onTouchMove);
  }
  //#endregion

  // #region touchend hook
  protected initTouchend() {
    this._target.addEventListener('touchend', this.onTouchEnd);
  }

  protected disposeTouchend() {
    this._target.removeEventListener('touchend', this.onTouchEnd);
  }
  //#endregion

  // #region resize hook
  protected initResize() {
    this.resizeObserver.observe(this._target);
  }

  protected disposeResize() {
    this.resizeObserver.unobserve(this._target);
  }
  //#endregion
  //#endregion

  private onMouseDown = (evt: MouseEvent) => {
    this.emit('mousedown', {
      pointers: { Infinity: { id: Infinity, ...this.getOffsetOfTouch(evt) } },
      // pointers: [{ id: 0, ...this.getOffsetOfTouch(evt) }],
      target: this.target,
      source: evt,
      type: 'mousedown',
    });
  };

  private onMouseUp = (evt: MouseEvent) => {
    this.emit('mouseup', {
      pointers: {},
      target: this.target,
      source: evt,
      type: 'mouseup',
    });
  };

  private onMouseMove = (evt: MouseEvent) => {
    this.emit('mousemove', {
      pointers: { Infinity: { id: Infinity, ...this.getOffsetOfTouch(evt) } },
      target: this.target,
      source: evt,
      type: 'mousemove',
    });
  };

  private onTouchStart = (evt: TouchEvent) => {
    const pointers: { [id: number]: { x: number; y: number; id: number } } = {};
    for (const touch of evt.touches) {
      pointers[touch.identifier] = { id: touch.identifier, ...this.getOffsetOfTouch(touch) };
    }
    this.emit('touchstart', {
      pointers,
      target: this.target,
      source: evt,
      type: 'touchstart',
    });
  };

  private onTouchEnd = (evt: TouchEvent) => {
    const pointers: { [id: number]: { x: number; y: number; id: number } } = {};
    for (const touch of evt.touches) {
      pointers[touch.identifier] = { id: touch.identifier, ...this.getOffsetOfTouch(touch) };
    }
    this.emit('touchend', {
      pointers,
      target: this.target,
      source: evt,
      type: 'touchend',
    });
  };

  private onTouchMove = (evt: TouchEvent) => {
    const pointers: { [id: number]: { x: number; y: number; id: number } } = {};
    for (const touch of evt.touches) {
      pointers[touch.identifier] = { id: touch.identifier, ...this.getOffsetOfTouch(touch) };
    }
    this.emit('touchmove', {
      pointers,
      target: this.target,
      source: evt,
      type: 'touchmove',
    });
  };

  private onResize = (entries: ResizeObserverEntry[]) => {
    this.emit('resize', entries[0]);
  };

  private getOffsetOfTouch(e: Touch | MouseEvent) {
    const rect = this.target.getBoundingClientRect();
    let x: number;
    let y: number;
    if (!(e instanceof MouseEvent)) {
      x = e.pageX - (rect.left + window.scrollX);
      y = e.pageY - (rect.top + window.scrollY);
    } else {
      x = e.pageX - (rect.left + window.scrollX);
      y = e.pageY - (rect.top + window.scrollY);
    }
    return {
      x,
      y,
    };
  }
}
