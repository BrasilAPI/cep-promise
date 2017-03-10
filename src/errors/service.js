function ServiceError ({ message, service }) {
  this.name = 'ServiceError'
  this.message = message
  this.service = service
}

ServiceError.prototype = new Error()

export default ServiceError
