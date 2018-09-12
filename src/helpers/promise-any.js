'use strict'

const reverse = (promise) => new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve));

Promise.any = (iterable) => reverse(Promise.all([...iterable].map(reverse)));

export { Promise };

export default Promise;
