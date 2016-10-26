'use strict'

const reverse = (promise) => new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve))

Promise.any = function (iterable) {
  return reverse(Promise.all([...iterable].map(reverse)))
}

export default Promise
