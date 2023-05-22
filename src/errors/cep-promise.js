/**
 * @typedef {import('./service').ServiceErrorOptions} ServiceErrorOptions
 */

/**
 * @typedef { Object } ErrorOptions
 * @property { string } [message]
 * @property { string } [type]
 * @property { ServiceErrorOptions[] } [errors]
 */

class CepPromiseError extends Error {
  /**
   * 
   * @param { ErrorOptions } options 
   */
  constructor ({ message, type, errors } = {}) {
    super()

    this.name = 'CepPromiseError'
    this.message = message
    this.type = type
    this.errors = errors
  }
}

export default CepPromiseError
