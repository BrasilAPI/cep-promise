function CepPromiseError ({ message, type, errors } = {}) {
  this.name = 'CepPromiseError'
  this.message = message
  this.type = type
  this.errors = errors
}

CepPromiseError.prototype = Object.create(Error.prototype)
CepPromiseError.prototype.constructor = CepPromiseError

export default CepPromiseError
