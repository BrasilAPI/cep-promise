function ServiceError (options) {
  options = options || {}
  this.name = 'ServiceError'
  this.message = options.message
  this.service = options.service
}

ServiceError.prototype = Object.create(Error.prototype)
ServiceError.prototype.constructor = Error

export default ServiceError

