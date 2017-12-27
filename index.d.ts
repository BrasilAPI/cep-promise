declare module 'cep-promise' {
  interface CEP {
    cep: string,
    state: string,
    city: string,
    street: string,
    neighborhood: string
  }

  // this workarround is because this : https://github.com/Microsoft/TypeScript/issues/5073
  namespace cep {}

  function cep( cep: string | number ): Promise<CEP>

  export = cep
}


