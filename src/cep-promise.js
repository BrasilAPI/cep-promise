'use strict'

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    if (!cepRawValue) {
      reject()
    }
    resolve(true)
  })
}
