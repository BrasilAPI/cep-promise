declare module 'cep-promise' {
  export interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string,
    service: string
  }

  type AvailableProviders =
    "brasilapi" |
    "correios" |
    "viacep" |
    "widenet"

  export interface Configurations {
    providers?: AvailableProviders[],
    timeout?: number
  }

  export function cep(cep: string | number, configurations: Configurations): Promise<CEP>

  export default cep
}
