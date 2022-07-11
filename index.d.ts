declare module 'cep-promise' {
  export interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string,
    service: string
  }

  export enum AvailableProviders {
    brasilapi = "brasilapi",
    correios = "correios",
    correiosAlt = "correios-alt",
    viacep = "viacep",
    widenet = "widenet"
  }


  export interface Configurations {
    providers?: AvailableProviders[],
    timeout?: number
  }

  export function cep(cep: string | number, configurations?: Configurations): Promise<CEP>

  export default cep
}
