export type CEPRawValue = string | number;

export type AvaliableProviders =
  "brasilapi" |
  "correios" |
  "viacep" |
  "widenet"

export interface Configurations {
  providers?: AvaliableProviders[],
  timeout?: number
}
export interface CEP {
  cep: string,
  state: string,
  city: string,
  street: string,
  neighborhood: string,
  service: AvaliableProviders
}

export type ArrayString = { [k: string]: string }