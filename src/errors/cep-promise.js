function CepPromiseError ({ message, type, errors } = {}) {
  this.name = 'CepPromiseError'
  this.message = message
  this.type = type
  this.errors = errors
}

CepPromiseError.prototype = new Error()

export default CepPromiseError
