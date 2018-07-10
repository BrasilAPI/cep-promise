declare module 'cep-promise' {
  interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string
  }

  export default function cep(cep: string | number): Promise<CEP>
}
