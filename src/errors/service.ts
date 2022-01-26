class ServiceError extends Error {
  service: string;
  constructor ({ message, service }: { message: string, service: string}) {
    super()

    this.name = 'ServiceError'
    this.message = message
    this.service = service
  }
}

export default ServiceError
