declare module 'cep-promise' {
  export interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string,
    service: string
  }

  export type AvailableProviders = "brasilapi" | "correios" |  "correios-alt" | "viacep" | "widenet"


  export interface Configurations {
    providers?: AvailableProviders[],
    timeout?: number
  }

  export function cep(cep: string | number, configurations?: Configurations): Promise<CEP>

  export default cep
}
