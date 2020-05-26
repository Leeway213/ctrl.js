/**
 * @format
 */

/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A decorator to decorate for extending a class
 *
 * @param base the class will be extended
 * @param unextend define a unextend function named 'unextend'. If ‘unextend' function exists in 'base', this will extends the exist one instead of replace it.
 */
export function extendsTo<S, T>(base: Type<T>, unextend = 'unextends'): (target: Type<S>) => Type<S & T> {
  let unextendFunc: { func?: () => void };
  if (unextend) {
    const baseUnextendDescriptior = Object.getOwnPropertyDescriptor(base.prototype, unextend) || {};
    baseUnextendDescriptior.value = function (...args: any[]): void {
      if (baseUnextendDescriptior.value) {
        baseUnextendDescriptior.value.call(this, ...args);
      }
      if (unextendFunc.func) {
        unextendFunc.func();
      }
    };
    Object.defineProperty(base.prototype, unextend, baseUnextendDescriptior);
  }
  return (target: Type<S>): Type<S & T> => {
    // if (target.prototype.constructor) {
    //   target.prototype.constructor();
    // }

    const props = Object.getOwnPropertyNames(target.prototype).filter(v => v !== 'constructor');
    unextendFunc = {
      func: (): void =>
        props.forEach(prop => {
          try {
            delete base.prototype[prop];
          } catch (error) {
            console.warn(error);
          }
        }),
    };
    return applyMixin(base, target);
  };
}

/**
 * Extend derived class from base
 * @param base base class
 * @returns class mixed by derived and base class
 */
export function extendFrom<S, T>(base: Type<T>): (target: Type<S>) => Type<S & T> {
  return (target: Type<S>): Type<S & T> => {
    return applyMixin<S, T>(target, base) as any;
  };
}

/**
 * Apply mixin on derivedClass use baseClass
 * @param derivedClass
 * @param baseClass
 */
export function applyMixin<D, B>(derivedClass: Type<D>, baseClass: Type<B>): Type<D & B> {
  const props = Object.getOwnPropertyNames(baseClass.prototype).filter(v => v !== 'constructor');
  for (const prop of props) {
    const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, prop);
    if (descriptor) {
      Object.defineProperty(derivedClass.prototype, prop, descriptor);
    }
  }
  return derivedClass as Type<D & B>;
}

/**
 * Apply multiple classes on derivedClass
 */
export function applyMixins<D, T>(derived: Type<D>, base: Type<T>): Type<D & T>;
/**
 * Apply multiple classes on derivedClass
 */
export function applyMixins<D, T1, T2>(derived: Type<D>, base1: Type<T1>, base2: Type<T2>): Type<D & T1 & T2>;
/**
 * Apply multiple classes on derivedClass
 */
export function applyMixins<D, T1, T2, T3>(
  derived: Type<D>,
  base1: Type<T1>,
  base2: Type<T2>,
  base3: Type<T3>,
): Type<D & T1 & T2 & T3>;
/**
 * Apply multiple classes on derivedClass
 */
export function applyMixins<D, T1, T2, T3, T4>(
  derived: Type<D>,
  base1: Type<T1>,
  base2: Type<T2>,
  base3: Type<T3>,
  base4: Type<T4>,
): Type<D & T1 & T2 & T3 & T4>;
/**
 * Apply multiple classes on derivedClass
 */
export function applyMixins<D, T1, T2, T3, T4, T5>(
  devived: Type<D>,
  base1: Type<T1>,
  base2: Type<T2>,
  base3: Type<T3>,
  base4: Type<T4>,
  base5: Type<T5>,
): Type<D & T1 & T2 & T3 & T4 & T5>;
export function applyMixins<D>(derivedClass: Type<D>, ...baseClasses: Array<Type<any>>): Type<any> {
  for (const baseClass of baseClasses) {
    derivedClass = applyMixin(derivedClass, baseClass);
  }
  return derivedClass;
}

/**
 * return mixed class by multiple bases
 */
export function mixins<T1, T2>(base1: Type<T1>, base2: Type<T2>): Type<T1 & T2>;
/**
 * return mixed class by multiple bases
 */
export function mixins<T1, T2, T3>(base1: Type<T1>, base2: Type<T2>, base3: Type<T3>): Type<T1 & T2 & T3>;
/**
 * return mixed class by multiple bases
 */
export function mixins<T1, T2, T3, T4>(
  base1: Type<T1>,
  base2: Type<T2>,
  base3: Type<T3>,
  base4: Type<T4>,
): Type<T1 & T2 & T3 & T4>;
/**
 * return mixed class by multiple bases
 */
export function mixins<T1, T2, T3, T4, T5>(
  base1: Type<T1>,
  base2: Type<T2>,
  base3: Type<T3>,
  base4: Type<T4>,
  base5: Type<T5>,
): Type<T1 & T2 & T3 & T4 & T5>;
/**
 * return mixed class by multiple bases
 */
export function mixins(...baseClasses: Array<Type<any>>): any {
  let derivedClass: Type<any> | undefined;
  for (const base of baseClasses) {
    if (!derivedClass) {
      derivedClass = base;
    } else {
      applyMixin(derivedClass, base);
    }
  }
  return derivedClass;
}
