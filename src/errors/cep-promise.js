function CepPromiseError (options = {}) {
  this.name = 'CepPromiseError'
  this.message = options.message
  this.type = options.type
  this.errors = options.errors
}

CepPromiseError.prototype = Object.create(Error.prototype)
CepPromiseError.prototype.constructor = CepPromiseError

export default CepPromiseError
