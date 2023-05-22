/**
 * @typedef { Object } ServiceErrorOptions
 * @property { string } [message]
 * @property { string } [service]
 */


class ServiceError extends Error {
  /**
   * 
   * @param { ServiceErrorOptions } options 
   */
  constructor ({ message, service } = {}) {
    super()

    this.name = 'ServiceError'
    this.message = message
    this.service = service
  }
}

export default ServiceError
