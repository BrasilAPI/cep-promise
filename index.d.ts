declare module 'cep-promise' {
  export interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string,
    service: string
  }

  type AvaliableProviders =
    "brasilapi" |
    "correios" |
    "viacep" |
    "widenet"

  export interface Configurations {
    providers?: AvaliableProviders[],
    timeout?: number
  }

  function cep(cep: string | number, configurations?: Configurations): Promise<CEP>

  export default cep
}
