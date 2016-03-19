'use strict'

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    validateInput(cepRawValue)
      .catch(reject)

    function validateInput (cepRawValue) {
      return new Promise(function (resolve, reject) {
        if (!cepRawValue) {
          reject({
            type: 'type_error',
            message: 'You need to call the constructor with a String.'
          })
        }
      })
    }
  })
}
