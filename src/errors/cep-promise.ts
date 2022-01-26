type ErrorService = { 
  message: string;
  service: string
}

export interface CepPromiseProps {
  message: string;
  type: string;
  errors: Array<ErrorService>
}
class CepPromiseError extends Error implements CepPromiseProps {
  public type: string;
  public errors: Array<ErrorService>
  constructor({ message, type, errors }: CepPromiseProps) {
    super()

    this.name = 'CepPromiseError'
    this.message = message
    this.type = type
    this.errors = errors
  }
}

export default CepPromiseError
