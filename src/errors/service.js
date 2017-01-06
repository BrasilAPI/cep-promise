function ServiceError ({ message, service } = {}) {
  this.name = 'ServiceError'
  this.message = message
  this.service = service
}

ServiceError.prototype = Object.create(Error.prototype)
ServiceError.prototype.constructor = Error

export default ServiceError
