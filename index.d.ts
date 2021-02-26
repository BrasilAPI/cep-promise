declare module 'cep-promise' {
  export interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string,
    service: string
  }

  // this workarround is because this : https://github.com/Microsoft/TypeScript/issues/5073
  namespace cep {}

  type AvaliableProviders =
    "brasilapi" |
    "correios" |
    "viacep" |
    "widenet"

  export interface Configurations {
    providers?: AvaliableProviders[],
    timeout?: number
  }

  export function cep(cep: string | number, configurations: Configurations): Promise<CEP>

  export default cep
}
