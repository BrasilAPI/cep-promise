'use strict'

/**
]* @function
 * @template A
 * @param { Promise<A> } promise 
 * @returns 
 */
function reverse (promise) {
  return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve))
}

/**
 * @function
 * @template A
 * @param { Promise<A>[] } iterable 
 * @returns { Promise<A> }
 */
const any = (iterable) => reverse(Promise.all([...iterable].map(reverse)))

export default {
  ...Promise,
  any,
}
