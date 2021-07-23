class CepPromiseError extends Error {
  constructor ({ message, type, errors } = {}) {
    super()

    this.name = 'CepPromiseError'
    this.message = message
    this.type = type
    this.errors = errors
  }
}

export default CepPromiseError
